var http = require('lib/Http');
var membersData = {};
var win;
var addBtn;
var tableview;
var addCound = 0;

function addMembers() {	
	if (tableview.sections[0] && tableview.sections[0].rows) {
		for (var i = 0; i < tableview.sections[0].rows.length; i++) {
			var row = tableview.sections[0].rows[i];
			if (row.hasCheck) {
				membersData[row.rowData.name] = row.rowData;
			}
		}
		
		Ti.App.Properties.setObject('membersData', membersData);
		Ti.App.fireEvent('initMembers', membersData);
	}
	
	win.close();
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
	 	
	for (var i = 0; i < docs.length; i ++) {
		if (membersData[docs[i].name] == undefined) {
			
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
				text : docs[i].name,
				left : 70,
				top : 4,
				width : 200,
				height : 30
			});
			tvRow.add(labelUserName); 
			
			tvRow.addEventListener('click', rowClick); 
			tvRow.addEventListener('touch', rowClick);	
			
			rowData.push(tvRow);
		}
	}
	
	return rowData;
}

function MembersWindow() {
	win = Titanium.UI.createWindow({
		title:L('members'),
	    backgroundColor:'transparent',
		backgroundImage: 'images/grain.png',		
		barColor: '#6d0a0c'	
	});
	
	addBtn = Titanium.UI.createButton({title : L('add'), visible : false});
	addBtn.addEventListener('click', addMembers);
	
	if (Titanium.Platform.name == 'iPhone OS') {
		win.setRightNavButton(addBtn);
	}	

	var search = Titanium.UI.createSearchBar({
		barColor : '#385292',
		hintText : 'search'
	});
	search.addEventListener('change', function(e) {
		e.value // search string as user types
	});
	search.addEventListener('return', function(e) {
		search.blur();
	});
	search.addEventListener('cancel', function(e) {
		search.blur();
	});	
	
	membersData = Ti.App.Properties.getObject('membersData');
	if (membersData == null)
	 	membersData = {};
	 	
	tableview = Titanium.UI.createTableView({
		data : initMembers(membersData),
		search : search
	});	
	
	win.add(tableview);	
	
	return win;
};

module.exports = MembersWindow;
