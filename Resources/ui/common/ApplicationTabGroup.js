var self;
var tab1;
var tab2;
var tab3;
var tab4;
var ctab1;
var ctab2;
var ctab3;
var ctab4;

function initStoreGroup(){	
	var customWin = require('ui/common/CustomsWindow');
	var reservationWin = require('ui/common/ReservationWindow');
	var storeWin = require('ui/common/StoreWindow');
	var settingWin = require('ui/common/SettingWindow');
	var win1 = new customWin();
	var win2 = new reservationWin(); 
	var win3 = new storeWin();
	var win4 = new settingWin(0);

	tab1 = Ti.UI.createTab({
		title : L('customs'),
		icon : '/images/KS_nav_ui.png',
		window : win1
	});
	win1.containingTab = tab1;	

	tab2 = Ti.UI.createTab({
		title : L('reservation'),
		icon : '/images/KS_nav_ui.png',
		window : win2
	});
	win2.containingTab = tab2;

	tab3 = Ti.UI.createTab({
		title : L('store'),
		icon : '/images/KS_nav_ui.png',
		window : win3
	});
	win3.containingTab = tab3;

	tab4 = Ti.UI.createTab({
		title : L('settings'),
		icon : '/images/KS_nav_views.png',
		window : win4
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
}

function initCustomGroup(){	
	var storesWin = require('ui/custom/StoreSearchWindow');
	var worksWin = require('ui/custom/WorksWindow');
	var historyWin = require('ui/custom/HistoryWindow');
	var settingWin = require('ui/common/SettingWindow');
	var win1 = new storesWin();
	var win2 = new worksWin();
	var win3 = new historyWin();
	var win4 = new settingWin(1);

	ctab1 = Ti.UI.createTab({
		title : L('store'),
		icon : '/images/KS_nav_ui.png',
		window : win1
	});
	win1.containingTab = ctab1;	

	ctab2 = Ti.UI.createTab({
		title : L('works'),
		icon : '/images/KS_nav_ui.png',
		window : win2
	});
	win2.containingTab = ctab2;
	
	ctab3 = Ti.UI.createTab({
		title : L('history'),
		icon : '/images/KS_nav_views.png',
		window : win3
	});
	
	ctab4 = Ti.UI.createTab({
		title : L('settings'),
		icon : '/images/KS_nav_views.png',
		window : win4
	});
	win4.containingTab = ctab4;

	self.addTab(ctab1);
	self.addTab(ctab2);
	self.addTab(ctab3);
	self.addTab(ctab4); 	
}

function ApplicationTabGroup() {
	//create module instance
	self = Ti.UI.createTabGroup();
	
	var mode = 0;
	myData = Ti.App.Properties.getObject('myData');	
	if (myData && myData.mode) {
		mode = myData.mode;
	}
	
	if (mode === 0)
		initStoreGroup();
	else
		initCustomGroup();
	
	Ti.App.addEventListener('switchCustom', function(){
		self.removeTab(tab1);
		self.removeTab(tab2);
		self.removeTab(tab3);
		self.removeTab(tab4);
		initCustomGroup();
	});
	
	Ti.App.addEventListener('switchStore', function(){
		self.removeTab(ctab1);
		self.removeTab(ctab2);
		self.removeTab(ctab3);
		self.removeTab(ctab4);
		initStoreGroup();
	});
	
	return self;
};

module.exports = ApplicationTabGroup;
