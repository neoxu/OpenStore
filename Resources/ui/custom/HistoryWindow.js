var common = require('lib/Common');

function ApplicationWindow() {
	var self = Ti.UI.createWindow({
		title: L('history'),
		backgroundImage: 'images/grain.png',
		barColor: '#b89b00'		
	});
	
	var button = Ti.UI.createButton({title:L('add')});
	common.setRightNavButton(self, button);		
	button.addEventListener('click', function() {});	

	return self;
};

module.exports = ApplicationWindow;
