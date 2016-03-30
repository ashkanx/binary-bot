Blockly.Blocks['trade'] = {
	init: function() {
		this.appendDummyInput()
			.appendField("Trade");
		this.appendValueInput("ACCOUNT")
			.setCheck("Number")
			.appendField("With Account:")
			.appendField(new Blockly.FieldDropdown(Bot.server.getAccounts), "ACCOUNT_LIST");
		this.setInputsInline(true);
		this.appendStatementInput("SUBMARKET")
			.setCheck("Submarket")
			.appendField("Submarket");
		this.setPreviousStatement(true, 'Trade');
		this.setNextStatement(true, 'Submarket');
		this.setColour(60);
	}, 
	onchange: function(ev){
		Bot.utils.unplugErrors.trade(this, ev);
	},
};
