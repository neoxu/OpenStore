function CustomInfoWindow(parentWin, doc) {
	self = Ti.UI.createWindow({
		title : L('custominfo'),
		backgroundColor : 'transparent',
		backgroundImage : 'images/grain.png',
		barColor : '#6d0a0c'
	});
	
	var button = Ti.UI.createButton({title:L('edit')});
	self.setRightNavButton(button);
	button.addEventListener('click', function() {
		var win = require('ui/common/UpdateCustomWindow');
		parentWin.containingTab.open(new win(parentWin, doc));
	});	
	
	var nameLab = Ti.UI.createLabel({
		color: 'black',
  		font: { fontSize:18 },
  		text: doc.name,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		top: 20, left: 50
	})
	self.add(nameLab);
	
	var phoneBtn = Ti.UI.createButton({
		title:L('phone') + ' ' + doc.phone,
		width: Ti.Platform.displayCaps.platformWidth * 0.9,
		top: 80
	});
	self.add(phoneBtn);
	
	function updateInfoWin(data) {
		doc = data;
		nameLab.value = data.name;
		phoneBtn.title = L('phone') + ' ' + data.phone;
	}
	Ti.App.addEventListener('updateInfoWin', updateInfoWin);
	
	function closeInfoWin() {
		self.close();
	}
	Ti.App.addEventListener('closeInfoWin', closeInfoWin);

	return self;
};

module.exports = CustomInfoWindow;