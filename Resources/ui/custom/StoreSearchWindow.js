var http = require('lib/Http');
var common = require('lib/Common');
var storesSection;
var tableView;

function findWorks(name) {
	var doc = {name : name};
	http.post('findWorks', doc, function(msg) {
		storesSection = Ti.UI.createTableViewSection();
		var docs = msg.doc;
		docs.forEach(function(work) {
			var row = common.createTableViewRow(work);
			storesSection.add(row);
		});

		tableView.setData([storesSection]);
	}); 
}

function UpdateWorkWindow() {
	var self = Ti.UI.createWindow({
		title: L('store'),
		backgroundImage: 'images/grain.png',
		barColor: '#b89b00'		
	});
	
	var popupWin = common.popup();
	
	self.addEventListener('click', function(e) {
		popupWin.close();
	});

	var searchHeigh = 0;
	if (Ti.Platform.osname === 'mobileweb') {
		
	} else {
		var search = Titanium.UI.createSearchBar({
			barColor : '#385292',
			hintText : 'search',
			hintText : L('searchhintstore'),
			showBookmark : true,
			showCancel : true,
			height : Ti.Platform.osname === 'android' ? 80 : 40,
			top : 0
		});
		
		searchHeigh = search.height;

		search.addEventListener('return', function(e) {
			if (search.value && search.value !== '') 
				findWorks(search.value);

			search.blur();
		});
		search.addEventListener('cancel', function(e) {
			search.blur();
		});
		self.add(search); 
	}
	
 	storesSection = Ti.UI.createTableViewSection();
	tableView = Ti.UI.createTableView({top: searchHeigh});
	self.add(tableView);
	
	http.get('findAllStores', function(msg) {
		var docs = msg.doc;
		
		for (var i in docs) {
			var user = docs[i];
			if (user.pic_square == null || user.pic_square == undefined)
				user.pic_square = '/images/user.png';

			var tvRow = Ti.UI.createTableViewRow({
				height : 'auto',
				selectedBackgroundColor : '#fff',
				backgroundColor : '#fff',
				rowData : user
			});

			/*var btn = Ti.UI.createButton({
				title:L('book'),
				height : Ti.Platform.osname === 'android' ? Ti.UI.SIZE : 40,
				left: 10,
				width: 50,
				top: 50
			});
			tvRow.add(btn);
			btn.addEventListener('click', function(e) {						
				popupWin.open();
			});*/
			
			var imageView = Ti.UI.createImageView({
				image : user.pic_square,
				top : 0,
				left : 10,
				width : 50,
				height : 50
			});
			tvRow.add(imageView);

			if (user.storeName) {
				var userLabel = Ti.UI.createLabel({
					font : {fontSize : 16,fontWeight : 'bold'},
					left : 70,
					top : 5,
					right : 5,
					height : 20,
					color : '#576996',
					text : user.storeName
				});
				tvRow.add(userLabel);
			}

			var restStr = '';
			var openStr = [];
			for (var i in user.openTime) {
				if (user.openTime[i].open === false) {
					restStr += L('week'+i);
				} else	{
					var theSameTime = false;
					for (var j in openStr) {
						if (user.openTime[i].openH === openStr[j].openH &&
							user.openTime[i].openM === openStr[j].openM && 
							user.openTime[i].endH === openStr[j].endH &&
							user.openTime[i].endM === openStr[j].endM) {
							theSameTime = true;							
							openStr[j].days.push(i);
							break;
						}
					}
					
					if (theSameTime === false) {
						var days = [];
						days.push(i);
						user.openTime[i].days = days;
						openStr.push(user.openTime[i]);
					} 
				}  
			};
			
			if (restStr !== '')
			  restStr += ' ' + L('rest');
			  
			var status = '';
			for (var i in openStr) {
				var dayStr = '';
				for (var j in openStr[i].days) {
					if (dayStr === '')
						dayStr = L('week'+openStr[i].days[j]);
					else
					 	dayStr += L('week'+openStr[i].days[j]);
				}
				
				dayStr += openStr[i].startH + ':' + openStr[i].startM + ' - ' + 
						  openStr[i].endH + ':' + openStr[i].endM + ' ';	
						  
				status += dayStr;
			}
			
			status += restStr;
			
			var openLabel = Ti.UI.createLabel({
				font : {fontSize : 14},
				left : 70,
				top : 25,
				right : 20,
				height : 'auto',
				color : '#222',
				text : status
			});
			tvRow.add(openLabel);			
			
			storesSection.add(tvRow);
		}
		
		tableView.setData([storesSection]);
	});
	
	return self;
};

module.exports = UpdateWorkWindow;
