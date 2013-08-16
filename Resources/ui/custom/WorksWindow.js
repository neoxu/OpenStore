var http = require('lib/Http');
var common = require('lib/Common');
var waitingSection;
var worksSection;
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
	
	var button = Ti.UI.createButton({title:L('add'),});
	self.setRightNavButton(button);
	button.addEventListener('click', function() {
		var win = require('ui/custom/UpdateWorkWindow');
		self.containingTab.open(new win());
	});		
	
	tableView = Ti.UI.createTableView();
	self.add(tableView);	
	
	function addCustomerWaiting(work) {
		if (!waitingSection) {
			waitingSection = Ti.UI.createTableViewSection({
				headerTitle : L('waiting_accept')
			});
		}
		
		var row = common.createTableViewRow(work);
		waitingSection.add(row);
		
		initTableView();		
	}
	
	Ti.App.addEventListener('addCustomerWaiting', addCustomerWaiting);
	
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