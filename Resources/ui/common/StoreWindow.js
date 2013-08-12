var http = require('lib/Http');
var common = require('lib/Common');
var scrollView;

function updateWaiting(user) {
	var m = {account: user.account, name: user.name};
	var storeData = scrollView.views[scrollView.currentPage].storeData;	
	
	if (!storeData.waiting) {
		storeData.waiting = new Array();
	}
	
	storeData.waiting.push(m);	
	scrollView.views[scrollView.currentPage].storeData = storeData;
}

function initStore(msg) {
	if (msg == 'se41') {
		Ti.UI.createAlertDialog({title : L('store_error'), message : L(msg)}).show();
	} else {				
		if (msg !== '') {	
			var docs = JSON.parse(msg);		
			docs.forEach(function(doc) {			
				var view = common.createStoreView(doc);
				scrollView.addView(view);		
				scrollView.currentPage = scrollView.views.length-1;
			});				
			
			Ti.App.Properties.setObject('storesData', docs);
		}
	}
}

function addStore(store) {
	var view = common.createStoreView(store);
	scrollView.addView(view);		
	scrollView.currentPage = scrollView.views.length-1;
}

function StoreWindow() {
	var self = Ti.UI.createWindow({
		title:L('store'),
	    backgroundColor:'transparent',
		backgroundImage: 'images/grain.png',		
		barColor: '#6d0a0c'		
	});		
	
	var addBtn = Ti.UI.createButton({title:L('add')});
	self.setRightNavButton(addBtn);	
	addBtn.addEventListener('click', function(){
		Ti.App.Properties.setObject('membersData', {});
		var win = require('ui/common/OpenStoreWindow');
		self.containingTab.open(new win(self));
	});	 
	
	var editBtn = Ti.UI.createButton({title:L('edit')});
	self.setLeftNavButton(editBtn);	
	editBtn.addEventListener('click', function(){
		if (scrollView.views && scrollView.currentPage >= 0) {
			var editWin = require('ui/common/EditStoreWindow');			
			new editWin(scrollView.views[scrollView.currentPage].storeData).open({modal:true});
		}
	});	 
	
	scrollView = Ti.UI.createScrollableView();
	self.add(scrollView);
	
	Ti.App.addEventListener('updateWaiting', updateWaiting);
	
	Ti.App.addEventListener('addStores', addStore);
	
	http.get('findStore', initStore); 
	
	return self;		
}

module.exports = StoreWindow;