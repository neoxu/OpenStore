var hosturl = 'http://localhost:51122/';
//var hosturl = 'https://1f45836f2416164b4fe58bd5483acdf111f99426.cloudapp.appcelerator.com/';

exports.getUrl = function Get(theUrl, callback) {	
	var client = Ti.Network.createHTTPClient({		
		onload : function(e) {
		    callback(this.responseText);		
		},		
		onerror : function(e) {
			Ti.API.debug('Get error ' + e.error);
		},
		timeout : 600000 // in milliseconds
	});
    
	client.open('GET', theUrl);	
    client.send();
};

exports.get = function Get(theUrl, callback) {	
	var client = Ti.Network.createHTTPClient({		
		onload : function(e) {
		    callback(this.responseText);		
		},		
		onerror : function(e) {
			Ti.API.debug('Get error ' + e.error);
		},
		timeout : 600000 // in milliseconds
	});
    
	client.open('GET', hosturl+theUrl);	
    client.send();
};

exports.post = function Post(theUrl, jsonData, callback) {		
	var client = Ti.Network.createHTTPClient({			
		onload : function(e) {	
			//Ti.UI.createAlertDialog({title:'responseText', message:this.responseText}).show();
			callback(this.responseText);		
		},		
		onerror : function(e) {
			//Ti.UI.createAlertDialog({title:L('http_error'), message:e.error + ' ' + this.status}).show();
			Ti.API.debug('Post error ' + e.error);
		},
		timeout : 600000 // in milliseconds
	});	
	
	client.open('POST', hosturl+theUrl);	
	client.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');    		
	client.send(JSON.stringify(jsonData));
};
