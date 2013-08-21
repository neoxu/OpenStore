function SettingWindow(page) {
	var self = Ti.UI.createWindow({
		title : L('settings'),
		backgroundImage : 'images/grain.png',
		barColor : page == 0 ? '#6d0a0c' : '#b89b00'
	});

	if (Ti.Platform.osname === 'mobileweb') {
		var btn1 = Ti.UI.createButton({
			title : L('store'),
			top : 50,
			left : 50
		});
		self.add(btn1);
		btn1.addEventListener('click', function(e) {
			var myData = Ti.App.Properties.getObject('myData');
			if (myData.mode !== 0) {
				myData.mode = 0;
				Ti.App.Properties.setObject('myData', myData);
				Ti.App.fireEvent('switchStore');
			}
		});

		var btn2 = Ti.UI.createButton({
			title : L('custom'),
			top : 50,
			left : 150
		});
		self.add(btn2);
		btn2.addEventListener('click', function(e) {
			var myData = Ti.App.Properties.getObject('myData');
			if (myData.mode !== 1) {
				myData.mode = 1;
				Ti.App.Properties.setObject('myData', myData);
				Ti.App.fireEvent('switchCustom');
			}
		});
	} else {
		var tb1 = Titanium.UI.iOS.createTabbedBar({
			labels : [L('store'), L('custom')],
			backgroundColor : '#336699',
			top : 50,
			height : 60,
			width : 300,
			index : page
		});

		self.add(tb1);

		tb1.addEventListener('click', function(e) {
			var myData = Ti.App.Properties.getObject('myData');
			switch(e.index) {
				case 0:
					myData.mode = 0;
					Ti.App.fireEvent('switchStore');
					break;
				case 1:
					myData.mode = 1;
					Ti.App.fireEvent('switchCustom');
					break;
			}

			Ti.App.Properties.setObject('myData', myData);
		});
	}

	return self;
};

module.exports = SettingWindow; 
