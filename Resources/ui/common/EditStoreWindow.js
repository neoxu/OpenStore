var http = require('lib/Http');
var common = require('lib/Common');
var tableView;
var sectionWaiting;
var sectionMembers;
var tf;

function updateInviteMember(msg) {			
	var user = {};
	user['name'] = msg.doc;
	var tvRow = common.createTableViewRow(user);

	if (!sectionWaiting)
		sectionWaiting = Ti.UI.createTableViewSection({
			headerTitle : L('waiting')
		});

	sectionWaiting.add(tvRow);
	tableView.setData([sectionWaiting, sectionMembers]);

	var m = {
		account : tf.value,
		name : user.name
	};
	Ti.App.fireEvent('updateWaiting', m);
	tf.value = '';
	tf.blur();
}

exports.settingMember = function(storeData) {
	var self = Ti.UI.createWindow({
		title : storeData.storeName,
	    backgroundColor : 'transparent',
		backgroundImage : 'images/grain.png',		
		barColor : '#6d0a0c'
	});
	
	var closeBtn = Ti.UI.createButton({title:L('close')});	
	common.setLeftNavButton(self, closeBtn);		
	closeBtn.addEventListener('click', function() {		
		self.close();
	});
	
	var scrollView = Ti.UI.createScrollView();
	self.add(scrollView);		
	
	var myData = Ti.App.Properties.getObject('myData');
		
	var canEdit = myData.account === storeData.owner;
	if (canEdit) {
		var addbtn = Ti.UI.createButton({title : L('add')});
		common.setRightNavButton(self, addbtn);			
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
	
	tableView = Ti.UI.createTableView({
		top : canEdit ? 50 : 0,
		data : [sectionWaiting, sectionMembers]
	});	
	scrollView.add(tableView);
	
	if (storeData.waiting && storeData.waiting.length >0) {
		sectionWaiting = Ti.UI.createTableViewSection({headerTitle : L('waiting')});
		storeData.waiting.forEach(function(member) {
			var tvRow = common.createTableViewRow(member);
			sectionWaiting.add(tvRow);
		});
	}
	
	if (storeData.members && storeData.members.length > 0) {
		sectionMembers = Ti.UI.createTableViewSection({headerTitle : L('openstore3')});	
		storeData.members.forEach(function(member) {
			var tvRow = common.createTableViewRow(member);
			sectionMembers.add(tvRow);
		});
	}	
	
	tableView.setData([sectionWaiting, sectionMembers]);
	
	return self; 
};

exports.settingTime = function(storeData) {
	var self = Ti.UI.createWindow({
		title : storeData.storeName,
	    backgroundColor : 'transparent',
		backgroundImage : 'images/grain.png',		
		barColor : '#6d0a0c'
	});
	
	var closeBtn = Ti.UI.createButton({title:L('close')});
	common.setLeftNavButton(self, closeBtn);		
	closeBtn.addEventListener('click', function() {		
		self.close();
	});		
	
	var setBtn = Ti.UI.createButton({title:L('setting')});
	common.setRightNavButton(self, setBtn);		
	setBtn.addEventListener('click', function() {
		var doc = {
			owner: storeData.owner, 
			storeName: storeData.storeName, 
			openTime: storeData.openTime
		};
		
		var time = {openTime: storeData.openTime};
		Ti.App.fireEvent('updateOpenTime', time);		
		
		http.post('updateStoreTime', doc, function(msg) {
			
		});
	});		
	
	var basicSwitch = Ti.UI.createSwitch({
		top: 80,
		left : '40%',
		value : true // mandatory property for iOS
	});
	
	self.add(basicSwitch);

	basicSwitch.addEventListener('change', function(e) {
		storeData.openTime[bb1.index].open = basicSwitch.value;
	}); 
	self.add(basicSwitch);
	
	var bb1 = Titanium.UI.createButtonBar({
		labels : [L('week0'), L('week1'), L('week2'), L('week3'), L('week4'), L('week5'), L('week6')],
		backgroundColor : '#336699',		
		width : '100%',
		top : 0,
		index : 0
	});
	self.add(bb1);
	bb1.addEventListener('click', function(e){
		bb1.setIndex(e.index);
		basicSwitch.value = storeData.openTime[e.index].open;	
		picker.setSelectedRow(0, storeData.openTime[e.index].startH, true);
		picker.setSelectedRow(1, storeData.openTime[e.index].startM, true);
		picker.setSelectedRow(2, storeData.openTime[e.index].endH, true);
		picker.setSelectedRow(3, storeData.openTime[e.index].endM, true);
	});	 
		
	var labels = new Array(2);
	for (var i = 0; i < 2; i++) {
		labels[i] = Ti.UI.createLabel({
			color : 'black',
			font : {fontSize : 24},
			text : L('time' + i),
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top : Ti.Platform.displayCaps.platformHeight * 0.4 - 30,
			left : i * 100 + 70
		});
		self.add(labels[i]);
	}
	
	function getNum(num) {
		return num >= 10 ? num : '0' + num;		
	}
	
	picker = Ti.UI.createPicker({		
		selectionIndicator: true,
		top: Ti.Platform.displayCaps.platformHeight*0.4
	});
	
	var column1 = Ti.UI.createPickerColumn({width:45});
	for (var i = 0; i <= 23; i++) {
		column1.addRow(Ti.UI.createPickerRow({title : getNum(i).toString()}));
	};    
	
	var column2 = Ti.UI.createPickerColumn({width:45});
	for (var i = 0; i < 4; i++) {
		column2.addRow(Ti.UI.createPickerRow({title : getNum(i*15).toString()}));
	}		
	
	var column3 = Ti.UI.createPickerColumn({width:45});
	for (var i = 0; i <= 23; i++) {
		column3.addRow(Ti.UI.createPickerRow({title : getNum(i).toString()}));
	}    
	
	var column4 = Ti.UI.createPickerColumn({width:45});
	for (var i = 0; i < 4; i++) {
		column4.addRow(Ti.UI.createPickerRow({title : getNum(i*15).toString()}));
	}	
	
	picker.add([column1,column2, column3,column4]);	
	picker.addEventListener('change',function(e)
	{
		switch (e.columnIndex) {
			case 0: 
				storeData.openTime[bb1.index].startH = e.rowIndex;
				break;
			case 1: 
				storeData.openTime[bb1.index].startM = e.rowIndex;
				break;
			case 2: 
				storeData.openTime[bb1.index].endH = e.rowIndex;
				break;
			case 3: 
				storeData.openTime[bb1.index].endM = e.rowIndex;
				break;
		}
	});
	
	self.add(picker);
	
	var e = {index: 0};
	bb1.fireEvent('click', e);
	
	return self;	
};
