var http = require('lib/Http');
var tfay = new Array(10);
var data = {};
var self;
var docName;

function updateFinish(msg) {
	if (msg == '1') {			
		var customsData = Ti.App.Properties.getObject('customsData');
		var docs = Ti.App.Properties.getObject('docs');
		
		if (customsData[data.name] == undefined) {				
			docs.push(data);
		}
		else
		{
			for (var i = 0; i < docs.length; i ++) {
				if (docs[i].name == data.name) {
					docs[i] = data;
					break;
				}				
			}
		}
		
		customsData[data.name] = data;
		Ti.App.Properties.setObject('customsData', customsData);
		Ti.App.Properties.setObject('docs', docs);
		
		Ti.App.fireEvent("updateInfoWin", data);
		Ti.App.fireEvent("updateClientCustoms");
		self.close();
	} else
		Ti.UI.createAlertDialog({title : L('insert_error'),message : L(msg)}).show();
}

function updateCustoms(e) {
	if (tfay[0].value != '') {

		var docs = new Array(1);
		data = {};
		var dnay = new Array('name', 'phone', 'by', 'bm', 'bd', 'email', 'fb', 'line', 'google', 'skype');

		data['name'] = tfay[0].value;
		data['phone'] = tfay[1].value;

		function getNum(num) {
			return num >= 10 ? num : 0 + num;
		}

		if ((tfay[2].value != '') && (tfay[3].value != '') && (tfay[4].value != '')) {
			data['birthday'] = getNum(tfay[3].value) + '/' + getNum(tfay[3].value) + '/' + getNum(tfay[2].value);
		}

		for (var i = 5; i < dnay.length; i++) {
			if (tfay[i].value != null)
				data[dnay[i]] = tfay[i].value;
		}

		docs[0] = data;
		var sendData = {};
		sendData['docs'] = docs;
		http.post('updateCustoms', sendData, updateFinish);
	} else
		Ti.UI.createAlertDialog({title : L('insert_error'), message : L('ce21')}).show();
}

function RemoveFinish(msg) {
	if (msg == '1') {
		Ti.App.fireEvent("askServerCustoms");
		Ti.App.fireEvent("closeInfoWin");
		self.close();
	}
}
	
function UpdateCustomWindow(parentWin, doc) {   
	self = Ti.UI.createWindow({
		title : L('insert_custom'),
		backgroundColor : 'transparent',
		backgroundImage : 'images/grain.png',
		barColor : '#6d0a0c'
	});
	
	var button = Ti.UI.createButton({title:L('Done')});
	button.addEventListener('click', updateCustoms);	
	self.setRightNavButton(button);
	
	var scrollView = Ti.UI.createScrollView();
	self.add(scrollView);

	var uiw = Ti.Platform.displayCaps.platformWidth * 0.9;		
	
	for (var i=0; i < tfay.length; i ++) {
		tfay[i] = Ti.UI.createTextField({
			height : 40,
			width : uiw,
			top : i*45 + 5,
			keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType : Titanium.UI.RETURNKEY_DONE,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED, 
			hintText:L('update'+(i+1))
		});
		scrollView.add(tfay[i]); 
	}	
	
	if (doc) {
		tfay[0].value = doc.name;
		tfay[1].value = doc.phone;
		tfay[2].value = doc.by;
		tfay[3].value = doc.bm;
		tfay[4].value = doc.bd;
		tfay[5].value = doc.email;
		tfay[6].value = doc.fb;
		tfay[7].value = doc.line;
		tfay[8].value = doc.google;
		tfay[9].value = doc.skype;			
		docName = {delname: doc.name};
		
		var deletBtn = Ti.UI.createButton({
			title : L('delete'),
			Color : 'red',
			width : uiw,
			top : tfay.length*45+5
		});		
		
		deletBtn.addEventListener('click', function(doc) {
			var optionsDialogOpts = {
				options : [L('delete_custom'), L('cancel')],
				destructive : 0,
				cancel : -1
			};

			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

			dialog.addEventListener('click', function(e) {
				if (e.index == 0) {
					http.post('removeCustom', docName, RemoveFinish);	
				}				
			});
			
			dialog.show();
		});

		scrollView.add(deletBtn); 
	}				
	
	return self;
};

module.exports = UpdateCustomWindow;