(function() {
	var showError = Bot.utils.showError;
	var log = Bot.utils.log;
	var LiveApi = window['binary-live-api'].LiveApi;
	Bot.server = {}; 

	window.addEventListener('contract:finished', function(e){
		var detail_list = [
			e.detail.statement, 
			e.detail.type, 
			e.detail.entrySpot, 
			new Date(parseInt(e.detail.entrySpotTime + '000')).toLocaleTimeString(),
			e.detail.exitSpot, 
			new Date(parseInt(e.detail.exitSpotTime + '000')).toLocaleTimeString(),
		];
		if ( e.detail.type.indexOf('DIGIT') > -1 || e.detail.type.indexOf('ASIAN') > -1) {
			detail_list.push(e.detail.barrier);
		}
		log('Purchase was finished, result is: ' + e.detail.result, (e.detail.result === 'win')? 'success': 'error');
		Bot.finish(e.detail.result, detail_list);
	});

	window.addEventListener('tick:updated', function(e){
		if ( !Bot.server.strategyFinished ) {
			Bot.strategy(e.detail.tick, e.detail.direction);
		}
	});

	var tokenList = Bot.utils.storageManager.getTokenList();
	if ( tokenList.length === 0 ) {
		Bot.server.accounts = [['Please add a token first', '']];
	} else {
		Bot.server.accounts = [];
		tokenList.forEach(function(tokenInfo){
			Bot.server.accounts.push([tokenInfo.account_name, tokenInfo.token]);
		});
	}
	Bot.server.purchase_choices = [['Click to select', '']];

	Bot.server.addAccount = function addAccount(token){
		if ( token === '' ) {
			showError('Token cannot be empty');
		} else if ( token !== null ) {
			var api = new LiveApi();
			api.authorize(token).then(function(response){
				if ( Bot.server.accounts[0][1] === '' ) {
					Bot.server.accounts = [];
				}
				Bot.server.accounts.push([response.authorize.loginid, token]);
				api.disconnect()
				Bot.utils.storageManager.addToken(token, response.authorize.loginid);
				var account_block = Blockly.getMainWorkspace().getBlockById('trade');
				if ( account_block !== null ) {
					account_block.getField('ACCOUNT_LIST').setValue(token);
				}
				log('Your token was added successfully', 'success');
			}, function(reason){
				api.disconnect()
				Bot.utils.storageManager.removeToken(token);
				showError('Authentication using token: ' + token + ' failed!');
			});
		}
	};

	Bot.server.getAccounts = function getAccounts(){
		return Bot.server.accounts;
	};

	Bot.server.getPurchaseChoices = function getPurchaseChoices(){
		return Bot.server.purchase_choices;
	};

	Bot.server.portfolio = function portfolio(proposalContract, purchaseContract){
		Bot.server.api.getPortfolio().then(function(portfolio){
			var contractId = purchaseContract.buy.contract_id;
			portfolio.portfolio.contracts.forEach(function (contract) {
				if (contract.contract_id == contractId) {
					log('Processing the contract: ' + contract.contract_id);
					Bot.server.contractService.addContract({
						statement: contract.transaction_id,
						startTime: contract.date_start + 1,
						duration: parseInt(proposalContract.echo_req.duration),
						type: contract.contract_type,
						barrier: proposalContract.echo_req.barrier
					});
				}
			});
		}, function(reason){
			showError(reason.message);
		});
	};

	Bot.server.purchase = function purchase(option){
		Bot.server.strategyFinished = true;
		log('purchase was called');
		if ( Bot.contracts.length !== 0 ) {
			var proposalContract = (option === Bot.contracts[1].echo_req.contract_type)? Bot.contracts[1] : Bot.contracts[0];
			log('purchasing contract: ' + proposalContract.proposal.longcode, 'info');
			Bot.server.api.buyContract(proposalContract.proposal.id, proposalContract.proposal.ask_price).then(function(purchaseContract){
				Bot.server.portfolio(proposalContract, purchaseContract);
			}, function(reason){
				showError(reason.message);
			});
		}
	};

	Bot.server.requestHistory = function requestHistory(){
		Bot.server.api.getTickHistory(Bot.server.symbol,{
			"end": "latest",
			"count": Bot.server.contractService.getCapacity(),
			"subscribe": 1,
		}).then(function(value){
			log('Request sent for history');
		}, function(reason){
			showError(reason.message);
		});
	};

	Bot.server.observeTicks = function observeTicks(){

		Bot.server.api.events.on('tick', function (feed) {
			log('tick received at: ' + feed.tick.epoch);
			if (feed && feed.echo_req.ticks_history === Bot.server.symbol) {
				Bot.server.contractService.addTick(feed.tick);
			}
		});

		Bot.server.api.events.on('history', function (feed) {
			if (feed && feed.echo_req.ticks_history === Bot.server.symbol) {
				Bot.server.contractService.addHistory(feed.history);
			}
		});

		Bot.server.requestHistory();
	};

	Bot.server.submitProposal = function submitProposal(options){
		Bot.server.api.getPriceProposalForContract(options).then(function(value){
			log('contract added: ' + value.proposal.longcode);
			if ( Bot.contracts.length === 1 ) {
				Bot.server.strategyFinished = false;
				log('Contracts are ready', 'success'); 
			}
			Bot.contracts.push(value);
		}, function(reason){
			showError(reason.message);
		});
	};

	Bot.server.init = function init(token, callback, strategy, finish){
		log('Processing the trade...', 'info');
		if ( token === '' ) {
			showError('No token is available to authenticate');
			return;
		}
		if ( Bot.server.hasOwnProperty('api') ) {
			Bot.server.api.disconnect();
		}
		Bot.server.api = new LiveApi();
		Bot.server.api.authorize(token).then(function(response){
			log('Authenticated using token: ' + token, 'success');
			Bot.server.contractService = ContractService();	
			Bot.contracts = [];
			Bot.server.strategyFinished = true;
			Bot.strategy = strategy;
			Bot.finish = finish;
			Bot.server.observeTicks();
			callback();
		}, function(reason){
			Bot.utils.storageManager.removeToken(token);
			showError('Authentication using token: ' + token + ' failed!');
		});
	};
})();
