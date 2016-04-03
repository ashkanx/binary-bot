var startIntro = function startIntro(){
	var intro = introJs();
	intro.setOptions({
		steps: [
			{ 
				intro: 'Welcome to the binary-bot!'
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
				element: '.blocklyToolboxDiv',
				intro: 'Pick blocks from here to add to your code.',
				position: 'right',
			},
		]
	});
	intro.setOptions({
		steps: [
			{
				element: $('.blocklyTrash')[0],
				intro: 'Remove the blocks by dropping them in here.',
			},
		]
	});
	intro.start();
};

startIntro();
