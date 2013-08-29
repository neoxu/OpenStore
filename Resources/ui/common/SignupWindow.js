var http = require('lib/Http');			

function SignupWindow() {
	var self = Ti.UI.createWindow({
		title: L('user_signup'),
		backgroundColor:'transparent',
		backgroundImage: 'images/grain.png',
		barColor: '#6d0a0c'		
	});
	
	var tfay = new Array(5);
	
	for (var i = 0; i < tfay.length; i++) {
		tfay[i] = Ti.UI.createTextField({
			height : Ti.Platform.osname === 'android' ? Ti.UI.SIZE : 40,
			width : '90%',
			top : (i*12+2) + '%',
			keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType : Titanium.UI.RETURNKEY_DONE,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			hintText : L('signup' + (i + 1))
		});

		self.add(tfay[i]);
	}
	
	tfay[1].passwordMask = true;
	tfay[2].passwordMask = true;
	
	var btn = Ti.UI.createButton({
		title:L('signup'),
		height : Ti.Platform.osname === 'android' ? Ti.UI.SIZE : 40,
		width: '90%',
		bottom : 50
	});
	self.add(btn);		
    	
	btn.addEventListener('click', function() {		
		if (tfay[0].value != '') {
			if (tfay[1].value != '') {
				if (tfay[1].value == tfay[2].value) {
					function callBack(msg) {								
						var myData = Ti.App.Properties.getObject('myData');
						if (!myData)
							myData = {};

						myData.account = tfay[0].value;
						myData.password = tfay[1].value;

						Ti.App.Properties.setObject('myData', myData);
						Ti.App.Properties.setObject('docs', {});
						Ti.App.Properties.setObject('customsData', {});

						var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
						ApplicationTabGroup().open();											
					}					
				    	    
				    var data = {};
				    data['first_name'] = tfay[4].value;
       				data['last_name'] = tfay[3].value;	
        			data['email'] = tfay[0].value;
       				data['pw'] = tfay[1].value;	
       				data['pw_c'] = tfay[2].value;
				    http.post('signup', data, callBack);
				}
				else
					Ti.UI.createAlertDialog({title:L('signup_error'), message:L('ce3')}).show();
			}
			else
				Ti.UI.createAlertDialog({title:L('signup_error'), message:L('ce2')}).show();
		}
		else
			Ti.UI.createAlertDialog({title:L('signup_error'), message:L('ce1')}).show();
	});	
	
	return self;
};

module.exports = SignupWindow; 
