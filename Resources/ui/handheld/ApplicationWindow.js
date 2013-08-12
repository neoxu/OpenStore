function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title: title,
		backgroundImage: 'images/grain.png',
		barColor: '#6d0a0c'		
	});
	
	var button = Ti.UI.createButton({
		title:L('add'),
		top:5
	});
	self.setRightNavButton(button);
	button.addEventListener('click', function() {
		self.containingTab.open(Ti.UI.createWindow({
			title: L('newWindow'),
			backgroundImage: 'images/grain.png',
		    barColor: '#6d0a0c'	
		}));
	});	

	return self;
};

module.exports = ApplicationWindow;
