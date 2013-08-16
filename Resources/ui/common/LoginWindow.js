var facebook = Titanium.Facebook;
var http = require('lib/Http');
var tf1;
var tf2;

function login() {
	if (tf1.value != '') {
		if (tf2.value != '') {
			function callBack(msg) {
				if (msg == '1') {
					var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
					ApplicationTabGroup().open();	
				} else {
					if (msg !== '') {
						Ti.UI.createAlertDialog({title : L('login_error'), message : msg}).show();
					}
				}
			}

			var data = {};
			data['un'] = tf1.value;
			data['pw'] = tf2.value;
			http.post('login', data, callBack);
			
			var myData = Ti.App.Properties.getObject('myData');
			if (!myData) 
				myData = {};
				
			myData.account = tf1.value;
			myData.password = tf2.value;				
				
			Ti.App.Properties.setObject('myData', myData);	
		} else
			Ti.UI.createAlertDialog({title : L('login_error'),message : L('ce2')}).show();
	} else
		Ti.UI.createAlertDialog({title : L('login_error'), message : L('ce1')}).show();
}

function fbLoginSuccess(msg) {
	if (msg == '1') {
		var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		ApplicationTabGroup().open();	
	} else
		Ti.UI.createAlertDialog({title : L('login_error'),	message : L(msg)}).show();
}	
			
function connectfacebook() {	
	facebook.appid = '205774956213358';
	facebook.permissions = ['publish_stream', 'read_stream'];	
	
	function updateLoginStatus() {
		if (facebook.loggedIn) {			
			var data = {email:facebook.uid.toString()};
			http.post('fbLogin', data, fbLoginSuccess); 
		}
	}

 	facebook.forceDialogAuth = true;
	facebook.addEventListener('login', updateLoginStatus);
	facebook.addEventListener('logout', updateLoginStatus);	
}

function LoginWindow() {
	var self = Ti.UI.createWindow({
		title: L('user_login'),
		backgroundImage: 'images/grain.png',
		barColor: '#6d0a0c'		
	});
	
	var myData = Ti.App.Properties.getObject('myData');
	if (myData == undefined) 
		myData = {account: '', password: ''};
	
	var uiw = Ti.Platform.displayCaps.platformWidth * 0.9;
	tf1 = Ti.UI.createTextField({
		value: myData.account,
		height:(Ti.Platform.osname==='android') ? Ti.UI.SIZE : 40,
		width: uiw,
		top:5,
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DONE,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText:L('email_addr')
	});
	self.add(tf1);
	
	tf2 = Ti.UI.createTextField({
		value: myData.password,
		height:(Ti.Platform.osname==='android') ? Ti.UI.SIZE : 40,
		width: uiw,
		top:50,
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DONE,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask: true,
		hintText:L('password')
	});
	self.add(tf2);
	
	var loginbtn = Ti.UI.createButton({
		title:L('login'),
		height:Ti.UI.SIZE,
		width: uiw,
		top:95
	});
	self.add(loginbtn);	    	
	loginbtn.addEventListener('click', login);		
		
	if (facebook.loggedIn) {
		var fbBtn = Ti.UI.createButton({
			title : L('fblogin'),
			height : Ti.UI.SIZE,
			width : uiw,
			bottom : 30
		});
		fbBtn.addEventListener('click', function() {
			var data = {email:facebook.uid.toString()};
			http.post('fbLogin', data, fbLoginSuccess);

		});
		self.add(fbBtn);
	} else {
		connectfacebook();
		var fbloginBtn = facebook.createLoginButton({
			style : facebook.BUTTON_STYLE_WIDE,
			height : Ti.UI.SIZE,
			width : uiw,
			bottom : 30
		});
	}
	
	return self;
};

module.exports = LoginWindow; 