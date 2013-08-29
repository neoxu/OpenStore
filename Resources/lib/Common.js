var select = require('lib/soupselect').select;
var htmlparser = require('lib/htmlparser');

exports.setRightNavButton = function(win, btn) {
	if (Ti.Platform.osname === 'android') {
		btn.bottom = 0;
		btn.left = '50%';
		btn.width = '50%';	
		win.add(btn);
	}
	else 
		win.setRightNavButton(btn);	
};

exports.setLeftNavButton = function(win, btn) {
	if (Ti.Platform.osname === 'android') {
		btn.bottom = 0;
		btn.left = 0;
		btn.width = '50%';	
		win.add(btn);
	}
	else 
		win.setLeftNavButton(btn);	
};

exports.popup = function(){
    var win = Ti.UI.createWindow({
        backgroundColor: 'gray',
        fullscreen: true,
        navBarHidden: false,
        opacity : 0.50,
        id : "popup"
    });
    win.orientationModes = [Ti.UI.PORTRAIT];
 
    var blur = Ti.UI.createAnimation({
        opacity: 0.50
    });
    
    var shadow = Ti.UI.createView({
        left: 20,
        top: 100,
        right: 20,
        bottom: 200,
        opacity: 0.50,
        backgroundColor: 'black',
        borderRadius: 10,
        borderColor: 'black'
    });
    var frmLog = Ti.UI.createView({
        top : 110,
        left: 30,
        right: 30,
        bottom: 210,
        opacity: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        layout: "vertical"
    });
 
    var txtuser = Ti.UI.createTextField({
        hintText: "Enter Username",
        top: 30,
        left: 30,
        right: 30,
        txtID : "txtuser"
    });
    var txtpass = Ti.UI.createTextField({
        hintText: "Enter Password",
        left: 30,
        right: 30,
        txtID : "txtpass"
    });
    var btngroup = Ti.UI.createView({
        layout: "vertical"
    });
    var btnLog = Ti.UI.createButton({
        title: "Login",
        btnID : "btnLog",
        width: 100
    });
    var btnSign = Ti.UI.createButton({
        title: "SignUp",
        btnID : "btnSign",
        width: 100
    });
    frmLog.add(txtuser);
    frmLog.add(txtpass);
    frmLog.add(btnLog);
    frmLog.add(btnSign);
    shadow.animate(blur);
    win.add(shadow);
    win.add(frmLog);
    return win;
};

exports.createTableViewRow = function(user) {
	if (user) {
		if (user.pic_square == null || user.pic_square == undefined)
			user.pic_square = '/images/user.png';

		var tvRow = Ti.UI.createTableViewRow({
			height : 'auto',
			selectedBackgroundColor : '#fff',
			backgroundColor : '#fff',
			rowData : user
		});				
		
		var imageView = Ti.UI.createImageView({
			image : user.pic_square,
			left : 10,
			width : 50,
			height : 50
		});
		tvRow.add(imageView);
		
		if (user.name) {
			var userLabel = Ti.UI.createLabel({
				font : {fontSize : 16, fontWeight : 'bold'},
				left : 70,
				top : 5,
				right : 5,
				height : 20,
				color : '#576996',
				text : user.name
			});
			tvRow.add(userLabel);
		}
		
		var status = '';
		if (user.email && user.email !== '')
			status = user.email;
		else
		if (user.phone && user.phone !== '')
			status = user.phone;
		else
		if (user.birthday && user.birthday !== '')
			status = user.birthday;		

		if (status !== '') {
			var statusLabel = Ti.UI.createLabel({
				font : {fontSize : 14},
				left : 70,
				top : 25,
				right : 20,
				height : 'auto',
				color : '#222',
				text : status
			});
			tvRow.add(statusLabel);
		}
		
		return tvRow;
	} else
		return null;
};

exports.createStoreView = function(doc) {		
	var index = doc.storeUrl.toLowerCase().indexOf('http');
	if (index < 0) {
		doc.storeUrl = 'http://' + doc.storeUrl;
	}
				
	var view = Ti.UI.createView({storeData: doc});	
	
	if (doc.storeName) {
		var tf = Ti.UI.createTextField({
			editable : false,
			color : 'black',
			font : {fontSize : 20,fontWeight : 'bold'},
			textAlign : 'left',
			value : doc.storeName + '(' + doc.name + ')',
			left : Ti.Platform.displayCaps.platformWidth * 0.1,
			top : 5,
			width : Ti.Platform.displayCaps.platformWidth * 0.8,
			height : 40
		});
		view.add(tf);
	}			
	
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var handler = new htmlparser.DefaultHandler(function(err, dom) {
				if (err) {
					alert('Error: ' + err);
				} else {		
					var storeData = this.doc;							
					
					function addImage(row) {
						if (row.attribs.src) {
							var imgUrl = row.attribs.src;
							if (imgUrl.indexOf('http') < 0) {
								if (imgUrl[0] !== '/' && storeData.storeUrl[doc.storeUrl.length - 1] !== '/')
									storeData.storeUrl += '/';

								imgUrl = storeData.storeUrl + imgUrl;
							}

							if (!imgs[imgUrl] && count < 3) {
								var image = Ti.UI.createImageView({
									image : imgUrl,
									left : count * 110 + 10,
									top : Ti.Platform.displayCaps.platformHeight * 0.4 + 70,
									width : 100
								});

								view.add(image);
								imgs[imgUrl] = true;
								count++;
							}
						}
					}

					var opimage = false;
					var count = 0;
					var imgs = {};
					var title = '';
					var rows2 = select(dom, 'meta');

					rows2.forEach(function(row) {
						if (row.attribs.content && row.attribs.name) {
							switch (row.attribs.name) {
								case 'description':
								case 'og:description':
									title = row.attribs.content;
									break;
								case 'og:image':
									opimage = true;
									addImage(row);
									break;
								 
							}
						}
					});

					if (title == '') {
						var rows = select(dom, 'title');

						rows.forEach(function(row) {
							if (row.children && row.children[0].data) {
								title = row.children[0].data;
							}
						});
					};

					if (title !== '') {
						var ta = Ti.UI.createTextArea({
							editable : false,
							borderWidth : 2,
							borderColor : '#bbb',
							borderRadius : 5,
							color : '#888',
							font : {fontSize : 14,fontWeight : 'bold'},
							textAlign : 'left',
							value : title,
							left : Ti.Platform.displayCaps.platformWidth * 0.1,
							top : 50,
							width : Ti.Platform.displayCaps.platformWidth * 0.8,
							height : Ti.Platform.displayCaps.platformHeight * 0.4
						});
						view.add(ta);
					}					
					
					if (opimage == false) {
						var rows3 = select(dom, 'img');
						rows3.forEach(function(row) {
							addImage(row);
						});
					}
				}
			});

			handler.doc = doc;
			var parser = new htmlparser.Parser(handler);
			
			if (this.responseText !== null)
				parser.parseComplete(this.responseText);
			else
			if (this.responseData !== null) {
				if (this.responseXML && this.responseXML.documentElement) {
					var docu = this.responseXML.documentElement;
					var elements = docu.getElementsByTagName("screen_name");
					var screenName = elements.item(0);
					Ti.API.info("screenname = " + screenName.text); 
				}			
			}
		},
		onerror : function(e) {
			Ti.API.debug('store error ' + e.error);
		},
		timeout : 60000 // in milliseconds
	});

	xhr.open("GET", doc.storeUrl);
	xhr.send();	
	
	return view;
};
