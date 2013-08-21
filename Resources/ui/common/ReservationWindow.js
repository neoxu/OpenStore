var http = require('lib/Http');
var scrollView;
var picker;
var rowIndex0 = 0;
var rowIndex2 = 0;

function updateReservation() {	
	var customsRow = picker.getSelectedRow(0);
	if (customsRow) {	
		var doc = {
			date : scrollView.views[scrollView.currentPage].tableView.headerTitle,
			custom : customsRow.title,
			project : picker.getSelectedRow(1).title,
			h : picker.getSelectedRow(2).title,
			m : picker.getSelectedRow(3).title
		};

		var text = doc.h + ':' + doc.m + ' ' + doc.custom + ' ' + doc.project;

		function updateSuccess() {}
		http.post('updateReservation', doc, updateSuccess);

		var row = null;
		if (scrollView.views[scrollView.currentPage].tableView.sections &&
			scrollView.views[scrollView.currentPage].tableView.sections.length > 0 &&
			scrollView.views[scrollView.currentPage].tableView.sections[0].rows) {
			for (var i = 0; i < scrollView.views[scrollView.currentPage].tableView.sections[0].rows.length; i++) {
				if (scrollView.views[scrollView.currentPage].tableView.sections[0].rows[i].data.custom == doc.custom) {
					row = scrollView.views[scrollView.currentPage].tableView.sections[0].rows[i];
					break;
				}
			}
		}

		if (row == null) {
			scrollView.views[scrollView.currentPage].tableView.appendRow({title : text,	data : doc});
			//picker.setSelectedRow(0, rowIndex0 + 1, true);
			//picker.setSelectedRow(2, rowIndex2 + 1, true);
		} else {
			row.title = text;
			row.data = doc;
		}	
	}
	else {
		
	}
}

function findSuccess(msg) {
	if (msg == 'se41') {

	} else {
		if (msg !== '' || scrollView.views) {
			var docs = JSON.parse(msg);
			for (var i = 0; i < docs.length; i++) {
				for (var j = 0; j < scrollView.views.length; j ++) {
					if (scrollView.views[j].tableView.headerTitle == docs[i].date) {
						var text = docs[i].h + ':' + docs[i].m + ' ' + docs[i].custom + ' ' + docs[i].project; 
						scrollView.views[j].tableView.appendRow({title : text, data: docs[i]});
					}				
				}
			}
		}
	}
} 
	
function ReservationWindow() {	
	self = Ti.UI.createWindow({
		title:L('reservation'),
	    backgroundColor:'transparent',
		backgroundImage: 'images/grain.png',		
		barColor: '#6d0a0c'		
	});		
		
	var addBtn = Ti.UI.createButton({title:L('add')});
	addBtn.addEventListener('click', updateReservation);
	self.setRightNavButton(addBtn);	
	
	var editBtn = Ti.UI.createButton({title:L('edit')});
	var cancelBtn = Titanium.UI.createButton({title:L('cancel')});
	
	self.setLeftNavButton(editBtn);	
	editBtn.addEventListener('click', function()
	{
		self.setLeftNavButton(cancelBtn);		
		for (var i = 0; i < scrollView.views.length; i ++) {
			scrollView.views[i].tableView.editing = true;
			//scrollView.views[i].tableView.moving = true;
		}
	});	
	
	cancelBtn.addEventListener('click', function()
	{
		self.setLeftNavButton(editBtn);
		for (var i = 0; i < scrollView.views.length; i ++) {
			scrollView.views[i].tableView.editing = false;
			//scrollView.views[i].tableView.moving = false;
		}
	});	
	
	scrollView = Ti.UI.createScrollableView();
	
	function getDate(day) {	
		var currentTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * day);
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		return month + "/" + day + "/" + year; 
	}
	
	for (var i = 0; i < 7; i ++) {
		var tabView = Ti.UI.createTableView({
			editable:true,
			allowsSelectionDuringEditing:true,
			headerTitle : getDate(i)
		});			
		
		function removeReservation(e) {
			var doc = {date:e.row.data.date, custom: e.row.data.custom};
			http.post('removeReservation', doc, removeFinish);
			
			function removeFinish() {
				
			}
		}
		tabView.addEventListener('delete', removeReservation);
		
		function setPicker(e) {
			var data = [];
			data.push(e.row.data.custom);
			data.push(e.row.data.project);
			data.push(e.row.data.h);
			data.push(e.row.data.m);
						
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < picker.columns[i].rows.length; j++) {
					if (data[i] == picker.columns[i].rows[j].title) {
						picker.setSelectedRow(i, j, true);
						break;
					}
				}
			}
		}
		tabView.addEventListener('click', setPicker);
		
		var newView = Ti.UI.createView({tableView:tabView, date:tabView.headerTitle});		
		newView.add(tabView);
		scrollView.addView(newView);
	}
	
	picker = Ti.UI.createPicker({		
		selectionIndicator: true,
		top: Ti.Platform.displayCaps.platformHeight*0.4
	});

	var column1 = Ti.UI.createPickerColumn({width:130});
	var column2 = Ti.UI.createPickerColumn({width:80});
	var projectAy = ['剪髮', '洗髮', '染髮', '燙髮', '護髮'];
	for (var i = 0; i < projectAy.length; i++) {
		column2.addRow(Ti.UI.createPickerRow({title: projectAy[i].toString()}));
	}
 
 	function getNum(num) {
		return num >= 10 ? num : '0' + num;		
	}
	
	var column3 = Ti.UI.createPickerColumn({width:45});
	for (var i = 9; i <= 22; i++) {
		column3.addRow(Ti.UI.createPickerRow({title : getNum(i).toString()}));
	}    
	
	var column4 = Ti.UI.createPickerColumn({width:45});
	for (var i = 0; i < 12; i++) {
		column4.addRow(Ti.UI.createPickerRow({title : getNum(i*5).toString()}));
	}
		
	picker.add([column1,column2,column3,column4]);	
	picker.addEventListener('change',function(e)
	{
		switch (e.columnIndex) {
			case 0: 
				rowIndex0 = e.rowIndex;
				break;
			case 2: 
				rowIndex2 = e.rowIndex;
				break;
		}
	});
	
	self.add(scrollView);	
	self.add(picker);	
	
	if (scrollView.views) {
		var dateay = [];
		for (var i in scrollView.views) {
			dateay.push(scrollView.views[i].tableView.headerTitle);
		}
	
		var doc = {dateay: dateay};
		http.post('findReservation', doc, findSuccess);
	}
	
	function updatePickerRow() {
		var docs = Ti.App.Properties.getObject('docs');
		if (docs) {			
			column1.rows = [];
			for (var i in docs) {
				if (docs[i].name) {
					column1.addRow(Ti.UI.createPickerRow({title : docs[i].name}));
				}
			}
			
			picker.reloadColumn(0);
		}
	}
	Ti.App.addEventListener('updatePickerRow', updatePickerRow);
	
	return self;
};

module.exports = ReservationWindow;