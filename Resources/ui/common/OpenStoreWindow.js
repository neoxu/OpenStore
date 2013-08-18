var http = require('lib/Http');
var tfay = new Array(2);
var data = {};
var win;

function updateStoreSuccess(msg) {
	if (msg == '1') {
		var storesData = Ti.App.Properties.getObject('storesData');
		if (storesData == null) 
			storesData = [];

		storesData.push(data);
		Ti.App.Properties.setObject('storesData', storesData);
		
		Ti.App.fireEvent('addStores', data);
		win.close();
	}
	else {
		
	}
}

function updateStore() {	
	data = {};
	data['storeName'] = tfay[0].value;
	data['storeUrl'] = tfay[1].value;	
	http.post('updateStore', data, updateStoreSuccess);
	
	var myData = Ti.App.Properties.getObject('myData');
	if (myData) {
		data['owner'] = myData.account;
		data['ownerName'] = myData.name;
		
		var may = new Array();
		var m = {account: myData.account, name: myData.name};
		may.push(m);
		data['members'] = may; 
		
		var days = new Array();
		for (var i = 0; i < 7; i ++) {
			day = {open: true, startH: 9, startM: 0, endH: 21, endM: 0};
			days.push(day);			
		}
		
		data['openTime'] = days;
	}  
}

function initMembers(membersData) {
	function rowClick(e) {
		e.row.hasCheck = !e.row.hasCheck;
		
		if (e.row.hasCheck) 
		  	addCound++;
		else
			addCound--;
			
		if (addCound > 0)  
			addBtn.visible = true;
		else
		    addBtn.visible = false;  
	}
	
	var rowData = [];
	var docs = Ti.App.Properties.getObject('docs');	
	 	
	for (var member in membersData) {			
			var tvRow = Ti.UI.createTableViewRow({
				height : 'auto',
				selectedBackgroundColor : '#fff',
				backgroundColor : '#fff'				
			});			
			
			tvRow.rowData = docs[i];
			var labelUserName = Ti.UI.createLabel({
				color : '#576996',
				font : {
					fontFamily : 'Arial',
					fontSize : 20,
					fontWeight : 'bold'
				},
				text : member.name,
				left : 70,
				top : 4,
				width : 200,
				height : 30
			});
			tvRow.add(labelUserName); 			
			rowData.push(tvRow);
	}
	
	return rowData;
}

function OpenStoreWindow(parentWin) {
	win = Ti.UI.createWindow({
		title:L('openstore'),
	    backgroundColor:'transparent',
		backgroundImage: 'images/grain.png',		
		barColor: '#6d0a0c'		
	});		
	
	var addBtn = Ti.UI.createButton({title:L('add')});
	addBtn.addEventListener('click', updateStore);
	win.setRightNavButton(addBtn);	
		
	var scrollView = Ti.UI.createScrollView({  
		contentWidth: 'auto',
		contentHeight: 'auto',
		showVerticalScrollIndicator: true,
		height: '100%',
		width: '100%'
	});
	win.add(scrollView);
	
	var uiw = Ti.Platform.displayCaps.platformWidth * 0.9;			
	
	for (var i=0; i < tfay.length; i ++) {
		tfay[i] = Ti.UI.createTextField({
			height : 40,
			width : uiw,
			top : i*45 + 5,
			keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType : Titanium.UI.RETURNKEY_DONE,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED, 
			hintText:L('openstore'+(i+1))
		});
		scrollView.add(tfay[i]); 
	}	
	return win;
}

module.exports = OpenStoreWindow;
