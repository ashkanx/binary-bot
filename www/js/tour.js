var startIntro = function startIntro(){
	var intro = introJs();
	intro.setOptions({
		showStepNumbers: false,
		steps: [
			{
				element: $(".blocklyBlockCanvas:contains('Submarket')")[0],
				intro: 'This is the trade block.',
				position: 'bottom',
			},
			{ 
				intro: 'Welcome to the binary-bot!',
				showButtons: false,
			},
			{
				intro: 'This is the main workspace, you can add blocks to define your functionality here.',
				highlightClass: 'hidden',
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
	intro.start();
};

startIntro();
