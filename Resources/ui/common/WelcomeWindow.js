function WelcomeWindow() {
	var self = Ti.UI.createTabGroup();
	
	var win1 = require('ui/common/LoginWindow');	
	var tab1 = Ti.UI.createTab({
		title: L('user_login'),
		icon: '/images/KS_nav_ui.png',
		window: new win1()
	});
	win1.containingTab = tab1;
	self.addTab(tab1);
	
	var win2 = require('ui/common/SignupWindow');	
	var tab2 = Ti.UI.createTab({
		title: L('user_signup'),
		icon: '/images/KS_nav_ui.png',
		window: new win2()
	});
	win2.containingTab = tab2;
	self.addTab(tab2);
	
	return self;
};

module.exports = WelcomeWindow;