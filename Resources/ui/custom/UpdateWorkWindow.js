var http = require('lib/Http');
var common = require('lib/Common');

function UpdateWorkWindow() {
	var self = Ti.UI.createWindow({
		title: L('updatework'),
		backgroundImage: 'images/grain.png',
		barColor: '#b89b00'		
	});

	var search = Titanium.UI.createSearchBar({
		barColor : '#385292',
		hintText : 'search',
		hintText : L('searchhint'),
		showBookmark : true,
		showCancel : true,
		height : 36,
		top : 0
	});
	search.addEventListener('change', function(e) {
		e.value // search string as user types
	});
	search.addEventListener('return', function(e) {		
		if (search.value && search.value !== '') {
			var doc = {name : search.value};
			http.post('findWorks', doc, function(msg) {				
				worksSection = Ti.UI.createTableViewSection();
				var docs = JSON.parse(msg);
				docs.forEach(function(work) {
					var row = common.createTableViewRow(work);
					worksSection.add(row);
					
					var joinBtn = Ti.UI.createButton({
						title:L('join'),
						color: 'blue',
						top: 5,
						left: Ti.Platform.displayCaps.platformWidth - 60
					});
					row.add(joinBtn);					
					
					joinBtn.row = row;
					joinBtn.addEventListener('click', function(e) {
						var doc = {account: e.source.row.rowData.account};
						http.post('updateJoinWork', doc, function(msg) {
							Ti.App.fireEvent('addCustomerWaiting', e.source.row.rowData);
							self.close();
						});
						
						worksSection.remove(e.source.row);
						tableView.setData([worksSection]);
					});			
				});
				
				tableView.setData([worksSection]);
			});
		}

		search.blur();
	});
	search.addEventListener('cancel', function(e) {
		search.blur();
	});	
	self.add(search);
	
	var worksSection = Ti.UI.createTableViewSection();
	var tableView = Ti.UI.createTableView({top: search.height});
	self.add(tableView);	
	
	return self;
};

module.exports = UpdateWorkWindow;