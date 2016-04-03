var startIntro = function startIntro(){
	var intro = introJs();
	intro.setOptions({
		showStepNumbers: false,
		steps: [
			{ 
				intro: 'Welcome to the binary-bot!',
				showButtons: false,
			},
			{
				element: '#placeHolderForWorkspace',
				intro: 'This is the main workspace, you can add blocks to define your functionality here.',
				position: 'left',
				highlightClass: 'hidden',
			},
		],
	});
	intro.oncomplete(function(){
		var intro2 = introJs();
		intro2.setOptions({
			showStepNumbers: false,
			showButtons: false,
			steps: [
				{ 
					intro: 'Welcome to the binary-bot!',
					showButtons: false,
				},
				{
					element: '.blocklyToolboxDiv',
					intro: 'Pick blocks from here.',
					position: 'right',
				},
				{
					element: '.intro_xml_files',
					intro: 'Open/Save your blocks using these tools.',
				},
				{
					element: '.intro_token',
					intro: 'Add a token to use in the bot. At least one token has to be added.',
				},
				{
					element: '.intro_code',
					intro: 'Run the code when ready. Stop execution of the code.',
				},
				{
					element: '#placeHolderForTrash',
					intro: 'Remove the blocks by dropping them in here.',
					position: 'left',
					highlightClass: 'hidden',
				},
			]
		});
		intro2.start();
	});
	intro.start();
};

startIntro();
