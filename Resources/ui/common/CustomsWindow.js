var http = require('lib/Http');
var common = require('lib/Common');
var tableView;
var self;
var sectionInviteStore;
var sectionInviteCustom;
var sectionCustoms;

function initTableView() {
	//sectionImported.headerTitle = L('imported') + '(' + sectionImported.rowCount + ')';	
	//sectionFacebook.headerTitle = L('facebookfriends') + '(' + sectionFacebook.rowCount + ')';	
	//sectionContacts.headerTitle = L('contacts') + '(' + sectionContacts.rowCount + ')';
	var data = [];
	if (sectionInviteStore.rowCount > 0)
	  data.push(sectionInviteStore);
	  
	if (sectionInviteCustom.rowCount > 0)
	  data.push(sectionInviteCustom);
	  
	if (sectionCustoms.rowCount > 0)
	  data.push(sectionCustoms);
	
	tableView.setData(data);
}

function initCustoms(msg) {
	if (msg == 'se31') {
		http.get('findCustoms', initCustoms);
	} else {
		if (msg !== '') {			
			var docs = JSON.parse(msg);
			if (docs && docs.length > 0) {
				pushCustoms(docs);

				var customsData = {};
				for (var i = 0; i < docs.length; i++)
					customsData[docs[i].name] = docs[i];

				Ti.App.Properties.setObject('docs', docs);
				Ti.App.Properties.setObject('customsData', customsData);
				self.setTitle(L('customs') + ' (' + docs.length + ')');

				Ti.App.fireEvent('updatePickerRow');
			}
		}
		else {
			Ti.App.Properties.setObject('docs', []);
			Ti.App.Properties.setObject('customsData', {});
		}		
	}
}

function rowClick(e) {
	var win = require('ui/common/CustomInfoWindow');
	self.containingTab.open(new win(self, e.row.rowData));
}

function pushCustoms(docs) {	
	sectionCustoms = Ti.UI.createTableViewSection({headerTitle : L('customs')});
	for (var i = 0; i < docs.length; i++) {
		var row = common.createTableViewRow(docs[i]);
		row.addEventListener('click', rowClick);
		sectionCustoms.add(row);
	}

	initTableView();
}

function answerInvite(e) {	
	var doc = {
		owner : e.source.row.storeData.owner,
		storeName : e.source.row.storeData.storeName,
		answer : e.source.answer
	};

	http.post('updateInviteStore', doc, function(msg) {
		if (msg === '1') {
			if (e.source.answer === 1) {
				var myData = Ti.App.Properties.getObject('myData');
				if (myData) {					
					var store = {
						owner : e.source.row.storeData.owner,
						ownerName : e.source.row.storeData.ownerName,
						storeName : e.source.row.storeData.storeName,
						storeUrl : e.source.row.storeData.storeUrl,
						members : e.source.row.storeData.members,
						waiting : []
					};
							
					if (e.source.row.storeData.waiting) {
						for (var i in e.source.row.storeData.waiting) {
							if (e.source.row.storeData.waiting[i].account !== myData.account) 
								store.waiting.push(m);
						}
					}

					var member = {account : myData.email, name : myData.name};
					store.members.push(member);
						
					Ti.App.fireEvent('addStores', store);
				}
			}
			
			sectionInviteStore.remove(e.source.row);
			initTableView();			
		}
	}); 
}
	
function findMyWork(msg) {	
	if (msg !== 'se7') {
		var work = JSON.parse(msg);
		if (work && work.waiting) {
			sectionInviteCustom = Ti.UI.createTableViewSection({
				headerTitle : L('accept_join')
			});
			work.waiting.forEach(function(custom) {
				var data = {account: custom.account, name : custom.name};
				var row = common.createTableViewRow(data);
				var joinBtn = Ti.UI.createButton({
					title : L('join'),
					color : 'blue',
					top : 5,
					left : Ti.Platform.displayCaps.platformWidth - 120
				});

				joinBtn.row = row;
				joinBtn.answer = 1;
				joinBtn.addEventListener('click', answerAccept);
				row.add(joinBtn);

				var denyBtn = Ti.UI.createButton({
					title : L('deny'),
					color : 'red',
					top : 5,
					left : Ti.Platform.displayCaps.platformWidth - 60
				});

				denyBtn.row = row;
				denyBtn.answer = 0;
				denyBtn.addEventListener('click', answerAccept);
				row.add(denyBtn);

				function answerAccept(e) {
					var doc = {account: e.source.row.rowData.account, answer: e.source.answer};
					http.post('updateAcceptJoinWork', doc, function(msg) {		
					   
					});
					
					if (e.source.answer === 1) {
						var row = common.createTableViewRow(e.source.row.rowData);
						sectionCustoms.add(row);
					}
					
					sectionInviteCustom.remove(e.source.row);
					initTableView();
				}

				sectionInviteCustom.add(row);
			});
			
			sectionCustoms = Ti.UI.createTableViewSection({
				headerTitle : L('customs')
			});			
			
			if (work.customers) {
				work.customers.forEach(function(custom) {
					var data = {
						account : custom.account,
						name : custom.name
					};
					var row = common.createTableViewRow(data);
					sectionCustoms.add(row);
				});
			}

			initTableView();
		}
	}
}

function findInvite(msg) {
	var user = JSON.parse(msg);
	
	if (user && user.length > 0) {
		sectionInviteStore = Ti.UI.createTableViewSection({headerTitle : L('confirm_join')});
		user.forEach(function(store) {
			var data = {name: store.storeName};
			var row = common.createTableViewRow(data);
			row.storeData = store;
			var joinBtn = Ti.UI.createButton({
				title:L('join'),
				color: 'blue',
				top: 5,
				left: Ti.Platform.displayCaps.platformWidth - 120
			});		
							
			joinBtn.row = row;
			joinBtn.answer = 1;
			joinBtn.addEventListener('click', answerInvite);			
			row.add(joinBtn);
			
			var denyBtn = Ti.UI.createButton({
				title:L('deny'),
				color: 'red',
				top: 5,
				left: Ti.Platform.displayCaps.platformWidth - 60
			});
			
			denyBtn.row = row;
			denyBtn.answer = 0;
			denyBtn.addEventListener('click', answerInvite);
			row.add(denyBtn);
			
			sectionInviteStore.add(row);					
		});
		
		initTableView();
	}
}

function CustomsWindow() {
	self = Ti.UI.createWindow({
		title:L('customs'),
	    backgroundColor:'transparent',
		backgroundImage: 'images/grain.png',		
		barColor: '#6d0a0c'		
	});		
	
	var addbtn = Ti.UI.createButton({title:L('add')});
	self.setRightNavButton(addbtn);
	addbtn.addEventListener('click', function() {		
		var updateWin = require('ui/common/UpdateCustomWindow');
		self.containingTab.open(new updateWin());
	});
	
	var importbtn = Ti.UI.createButton({title:L('import')});
	self.setLeftNavButton(importbtn);
	importbtn.addEventListener('click', function() {
		var importWin = require('ui/common/ImportWindow');
		self.containingTab.open(new importWin());
	});
	
	sectionInviteStore = Ti.UI.createTableViewSection({headerTitle : L('confirm_join')});
	sectionInviteCustom = Ti.UI.createTableViewSection({headerTitle : L('accept_join')});
	sectionCustoms = Ti.UI.createTableViewSection({headerTitle : L('customs')});
		
	tableView = Ti.UI.createTableView();
	self.add(tableView);		
	initTableView();
	
	function updateClientCustoms() {
		var docs = Ti.App.Properties.getObject('docs');		
		pushCustoms(docs);
		self.setTitle(L('customs') + ' (' + docs.length + ')');
		
		Ti.App.fireEvent('updatePickerRow');
	}
	Ti.App.addEventListener('updateClientCustoms', updateClientCustoms);
	
	function askServerCustoms() {
		http.get('findCustoms', initCustoms); 	
	}
	Ti.App.addEventListener('askServerCustoms', askServerCustoms);	
	
	askServerCustoms();	
	
	http.get('findUser', findUser);			
	function findUser(msg) {		
		var user = JSON.parse(msg);
		var myData = Ti.App.Properties.getObject('myData');
		if (user && user.name)
			myData.name = user.name;
				
		Ti.App.Properties.setObject('myData', myData);	
	}
	
	http.get('findInviteStore', findInvite);
	http.get('findMyWork', findMyWork);
	
	return self;
};

module.exports = CustomsWindow;
