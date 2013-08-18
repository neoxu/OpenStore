var http = require('lib/Http');
var common = require('lib/Common');
var waitingSection;
var worksSection;
var seachSection;
var tableView;

function initTableView() {
	var data = [];
	if (waitingSection && waitingSection.rowCount > 0)
	  data.push(waitingSection);
	  
	if (worksSection && worksSection.rowCount > 0)
	  data.push(worksSection);
	
	tableView.setData(data);
}

function WorksWindow() {
	var self = Ti.UI.createWindow({
		title: L('works'),
		backgroundImage: 'images/grain.png',
		barColor: '#b89b00'		
	});	
	
	var backBtn = Ti.UI.createButton({title:L('back'), visible: false});
	self.setLeftNavButton(backBtn);
	backBtn.addEventListener('click', function() {
		backBtn.visible = false;
		initTableView();
	});	
	
	var search = Titanium.UI.createSearchBar({
		barColor : '#385292',
		hintText : 'search',
		hintText : L('searchhint'),
		showBookmark : true,
		showCancel : true,
		height : 38,
		top : 0
	});
	
	search.addEventListener('return', function(e) {		
		if (search.value && search.value !== '') {
			tableView.setData([]);
			backBtn.visible = true;
			var doc = {name : search.value};
			http.post('findWorks', doc, function(msg) {				
				seachSection = Ti.UI.createTableViewSection();
				var docs = JSON.parse(msg);
				docs.forEach(function(work) {
					var row = common.createTableViewRow(work);
					seachSection.add(row);
					
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
							var work = e.source.row.rowData;
							if (!waitingSection) {
								waitingSection = Ti.UI.createTableViewSection({
									headerTitle : L('waiting_accept')
								});
							}

							var row = common.createTableViewRow(work);
							waitingSection.add(row);
							
							if (seachSection.rowCount === 0)
								initTableView();
						});
						
						seachSection.remove(e.source.row);
						tableView.setData([seachSection]);
					});			
				});
				
				tableView.setData([seachSection]);
			});
		}

		search.blur();
	});
	search.addEventListener('cancel', function(e) {
		search.blur();
	});	
	self.add(search);
	
	tableView = Ti.UI.createTableView({top: search.height});
	self.add(tableView);			
	
	http.get('findMyCustomer', function(msg) {
		var customer = JSON.parse(msg);		
		
		if (customer.waiting) {
			waitingSection = Ti.UI.createTableViewSection({
				headerTitle : L('waiting_accept')
			});
			
			for (var i in customer.waiting) {
				var row = common.createTableViewRow(customer.waiting[i]);
				waitingSection.add(row);
			}
		}
		
		if (customer.works) {
			worksSection = Ti.UI.createTableViewSection({
				headerTitle : L('works')
			});
			
			for (var i in customer.works) {
				var row = common.createTableViewRow(customer.works[i]);
				worksSection.add(row);
			}
		}
		
		initTableView();		
	});

	return self;
};

module.exports = WorksWindow;
