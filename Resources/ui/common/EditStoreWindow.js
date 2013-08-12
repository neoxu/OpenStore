var http = require('lib/Http');
var common = require('lib/Common');
var tableView;
var sectionWaiting;
var sectionMembers;
var tf;

function updateInviteMember(msg) {			
	if (msg !== '0') {
		var user = {};
		user['name'] = msg;		
		var tvRow = common.createTableViewRow(user);		
		sectionWaiting.add(tvRow);
		tableView.setData([sectionWaiting, sectionMembers]);			
		
		var m = {account: tf.value, name : user.name};
		Ti.App.fireEvent('updateWaiting', m);		
		tf.value = '';	
		tf.blur();	
	}
	else
	  Ti.UI.createAlertDialog({title : L('invite_error'),message : L(msg)}).show();
}

function CustomsWindow(storeData) {
	var self = Ti.UI.createWindow({
		title : storeData.storeName,
	    backgroundColor : 'transparent',
		backgroundImage : 'images/grain.png',		
		barColor : '#6d0a0c'		
	});
	
	var closeBtn = Ti.UI.createButton({title:L('close')});
	self.setLeftNavButton(closeBtn);
	closeBtn.addEventListener('click', function() {		
		self.close();
	});
	
	var scrollView = Ti.UI.createScrollView();
	self.add(scrollView);		
	
	var myData = Ti.App.Properties.getObject('myData');
		
	if (myData.account === storeData.owner) {
		var addbtn = Ti.UI.createButton({title : L('add')});
		self.setRightNavButton(addbtn);
		addbtn.addEventListener('click', function() {
			if (tf.value !== '') {
			var doc = {};
				doc['owner'] = storeData.owner;
				doc['storeName'] = storeData.storeName;
				doc['inviteName'] = tf.value;
				http.post('updateInviteMember', doc, updateInviteMember);
			}
		});
				
		tf = Ti.UI.createTextField({
			height : 40,
			width : Ti.Platform.displayCaps.platformWidth * 0.9,
			top : 5,
			keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType : Titanium.UI.RETURNKEY_DONE,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			hintText : L('memberemail')
		});
		scrollView.add(tf);
	}	
	
	sectionWaiting = Ti.UI.createTableViewSection({headerTitle : L('waiting')});
	sectionMembers = Ti.UI.createTableViewSection({headerTitle : L('openstore3')});
	
	tableView = Ti.UI.createTableView({
		top : 50,
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		animationStyle : Titanium.UI.iPhone.RowAnimationStyle.DOWN,
		data : [sectionWaiting, sectionMembers]
	});	
	scrollView.add(tableView);
	
	if (storeData.members) {
		storeData.members.forEach(function(member) {
			var tvRow = common.createTableViewRow(member);
			sectionMembers.add(tvRow);
		});
	}
	
	if (storeData.waiting) {
		storeData.waiting.forEach(function(member) {
			var tvRow = common.createTableViewRow(member);
			sectionWaiting.add(tvRow);
		});
	}
	
	tableView.setData([sectionWaiting, sectionMembers]);
	
	return self; 
}

module.exports = CustomsWindow;