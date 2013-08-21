var http = require('lib/Http');
var common = require('lib/Common');
var sectionImported;
var sectionFacebook;
var sectionContacts;
var tableView; 

function initTableView() {
	//sectionImported.headerTitle = L('imported') + '(' + sectionImported.rowCount + ')';	
	//sectionFacebook.headerTitle = L('facebookfriends') + '(' + sectionFacebook.rowCount + ')';	
	//sectionContacts.headerTitle = L('contacts') + '(' + sectionContacts.rowCount + ')';
	
	tableView.setData([sectionImported, sectionFacebook, sectionContacts]);
}
	
function rowClick(e) {
	e.row.hasCheck = !e.row.hasCheck;
} 

function importContacts() {
	var performAddressBookFunction = function() {};	
	var addressBookDisallowed = function() {};
	
	if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
		performAddressBookFunction();
	} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN) {
		Ti.Contacts.requestAuthorization(function(e) {
			if (e.success) {
				performAddressBookFunction();
			} else {
				addressBookDisallowed();
			}
		});
	} else {
		addressBookDisallowed();
	}

	var customsData = Ti.App.Properties.getObject('customsData');
	var contacts = Ti.Contacts.getAllPeople();
	for (var i = 0; i < contacts.length; i++) {
		var c = contacts[i];
		var phone = '';
		var email = '';
		
		for(var temp in c.phone)
    	{
        	var temp_numbers = c.phone[temp];
        	for(var k=0;k<temp_numbers.length; k++)
        	{
            	var temp_num = temp_numbers[k];
            	phone = temp_num;
            	break;
            }
        }
        
        for(var temp in c.email)
    	{
        	var temp_emails = c.email[temp];
        	for(var k=0;k<temp_emails.length; k++)
        	{
            	var temp_email = temp_emails[k];
            	email = temp_email;
            	break;
            }
        }        
        
        var user = {};
        user['name'] = c.fullName;
        user['phone'] = phone;
        user['email'] = email;
        user['pic_square'] = c.image;        
       
		var tvRow = common.createTableViewRow(user);		
		
		if (customsData[c.fullName] == undefined) {
			tvRow.addEventListener('click', rowClick);
			tvRow.addEventListener('touch', rowClick);
			sectionContacts.add(tvRow);
		} else {
			sectionImported.add(tvRow);
		}
    }
    
    initTableView();
}

function importFacebook() {
	var platformName = Titanium.Platform.osname;
	var facebook;
	if (platformName !== 'mobileweb') {
		facebook = require('facebook');
	} else {
		facebook = Titanium.Facebook;
	}
	
	if (facebook.loggedIn) {
		facebook.appid = '205774956213358';
		facebook.accessToken = 'CAACEdEose0cBAEKeatchwezZCtTZCxpoLQR102upbFNDV5ASFUJlEpNaTs0QG61smZCnynvsfVdx9JNtYRa6JFv27oiJtzJtkmXqgk1saS4D3qsjcqlhIwUUu4b4CSbAqqg3EucuZAfeIrGLRiSviL8qePIfZCAUZD';
		facebook.permissions = ['publish_stream', 'read_stream'];

		// run query, populate table view and open window
		var query = "SELECT uid, name, pic_square, birthday FROM user ";
		query += "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + facebook.uid + ")";
		query += "order by name";

		facebook.request('fql.query', {
			query : query
		}, function(r) {
			if (!r.success) {
				if (r.error)
					alert(r.error);
				else
					alert("call was unsuccessful");

				return;
			}

			var result = JSON.parse(r.result);
			var customsData = Ti.App.Properties.getObject('customsData');

			for (var c = 0; c < result.length; c++) {
				var row = result[c];
				var tvRow = common.createTableViewRow(row);

				if (customsData[row.name] == undefined) {
					tvRow.addEventListener('click', rowClick);
					tvRow.addEventListener('touch', rowClick);
					sectionFacebook.add(tvRow);
				} else
					sectionImported.add(tvRow);
			}

			initTableView();
		});
	}
}

function importData() {		
	var facebookRows = [];
	var senddocs = [];
	var count = 0;
	
	if (sectionFacebook.rows !== undefined) {
		for (var i = 0; i < sectionFacebook.rows.length; i++) {
			var row = sectionFacebook.rows[i];
			if (row.hasCheck) {
				var data = {};
				data['name'] = row.rowData.name;
				data['fb'] = row.rowData.uid;
				if (row.rowData.birthday != null)
					data['birthday'] = row.rowData.birthday;

				senddocs.push(data);
				facebookRows.push(row);
				count++;
			}
		}
	}	
	
	var contactsRows = [];
	if (sectionContacts.rows !== undefined) {
		for (var i = 0; i < sectionContacts.rows.length; i++) {
			var row = sectionContacts.rows[i];
			if (row.hasCheck) {
				var data = {};
				data['name'] = row.rowData.name;
				data['phone'] = row.rowData.phone;
				data['email'] = row.rowData.email;

				senddocs.push(data);
				contactsRows.push(row);
				count++;
			}
		}
	}

	if (count > 0) {
		var sendData = {};
		sendData['docs'] = senddocs;		
		http.post('updateCustoms', sendData, callBack);
	}

	function callBack(msg) {
		if (msg == '1') {
			while (facebookRows.length > 0) {
				var row2 = facebookRows.pop();
				sectionFacebook.remove(row2);
				sectionImported.add(row2);
			}	
			
			while (contactsRows.length > 0) {
				var row2 = contactsRows.pop();
				sectionContacts.remove(row2);
				sectionImported.add(row2);
			}	
			
			initTableView();
						
			var docs = Ti.App.Properties.getObject('docs');
			var customsData = Ti.App.Properties.getObject('customsData');
			
			for (var i = 0; i < senddocs.length; i ++) {
				docs.push(senddocs[i]);
				customsData[senddocs[i].name] = senddocs[i];				
			}			
			
			Ti.App.Properties.setObject('docs', docs);
			Ti.App.Properties.setObject('customsData', customsData); 
			Ti.App.fireEvent("updateClientCustoms");
		}
	}
}

function ImportWindow() {
	var self = Ti.UI.createWindow({
		title : L('importing'),
		backgroundImage : 'images/grain.png',
		barColor : '#6d0a0c'
	});	
	
	sectionImported = Ti.UI.createTableViewSection({headerTitle : L('imported')});
	sectionFacebook = Ti.UI.createTableViewSection({headerTitle : L('facebookfriends')});
	sectionContacts = Ti.UI.createTableViewSection({headerTitle : L('contacts')});
		
	tableView = Ti.UI.createTableView({
		data : [sectionImported, sectionFacebook, sectionContacts]
	});	
	
	self.add(tableView);		
	
	var button = Ti.UI.createButton({title : L('add')});
	button.addEventListener('click', importData);
	self.setRightNavButton(button);	
	
	//import from facebook
	importFacebook();
	
	//import from addressbook
	importContacts();
	
	return self;
};

module.exports = ImportWindow; 
