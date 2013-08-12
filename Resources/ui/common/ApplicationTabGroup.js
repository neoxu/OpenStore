function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var customWin = require('ui/common/CustomsWindow');
	var reservationWin = require('ui/common/ReservationWindow'); 
	var storeWin = require('ui/common/StoreWindow'); 
	var win1 = new customWin(),
		win2 = new reservationWin(),
		win3 = new storeWin(),
		win4 = new Window(L('settings'));
	
	var tab1 = Ti.UI.createTab({
		title: L('customs'),
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	win1.containingTab = tab1;
	tab1.addEventListener('click', function(e) {
		console.log('tab1');
	});
	
	var tab2 = Ti.UI.createTab({
		title: L('reservation'),
		icon: '/images/KS_nav_ui.png',
		window: win2
	});
	win2.containingTab = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: L('store'),
		icon: '/images/KS_nav_ui.png',
		window: win3
	});
	win3.containingTab = tab3;
	
	var tab4 = Ti.UI.createTab({
		title: L('settings'),
		icon: '/images/KS_nav_views.png',
		window: win4
	});
	win4.containingTab = tab4;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	
	self.addEventListener('focus', function(e) {
		switch (e.index) {
			case 1:			
			    //Ti.App.fireEvent('updatePickerRow');
				break;
		}
	});
	
	return self;
};

module.exports = ApplicationTabGroup;
