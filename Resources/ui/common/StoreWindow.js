var http = require('lib/Http');
var common = require('lib/Common');
var manageStore = require('ui/common/EditStoreWindow');
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
	var docs = msg.doc;
	
	if (docs) {
		docs.forEach(function(doc) {
			var view = common.createStoreView(doc);
			scrollView.addView(view);
			scrollView.currentPage = scrollView.views.length - 1;
		});

		Ti.App.Properties.setObject('storesData', docs);
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
	common.setRightNavButton(self, addBtn);			
	addBtn.addEventListener('click', function(){
		Ti.App.Properties.setObject('membersData', {});
		var win = require('ui/common/OpenStoreWindow');
		self.containingTab.open(new win(self));
	});	 	
	
	var opts = {
		options : [L('setmember'), L('settime'), L('setservices'), L('setproduces')],
		title : L('managestore')
	};		

	var editBtn = Ti.UI.createButton({title:L('setting')});	
	common.setLeftNavButton(self, editBtn);
	editBtn.addEventListener('click', function(){
		if (scrollView.views && scrollView.currentPage >= 0) {
			var dialog = Ti.UI.createOptionDialog(opts);
			dialog.addEventListener('click', function(e) {
				switch(e.index) {
					case 0:
						manageStore.settingMember(scrollView.views[scrollView.currentPage].storeData).open({modal: true});
						break;
					case 1:
						manageStore.settingTime(scrollView.views[scrollView.currentPage].storeData).open({modal: true});
						break;
				}				
			});
			
			dialog.show();			
		};
	});	 
	
	scrollView = Ti.UI.createScrollableView();
	self.add(scrollView);
	
	Ti.App.addEventListener('updateWaiting', updateWaiting);
	
	Ti.App.addEventListener('addStores', addStore);
	
	Ti.App.addEventListener('updateOpenTime', function(doc){
		var storeData = scrollView.views[scrollView.currentPage].storeData;	
		storeData.openTime = doc.openTime;
		scrollView.views[scrollView.currentPage].storeData = storeData;					
	});
	
	http.get('findStore', initStore); 
	
	return self;		
}

module.exports = StoreWindow;
