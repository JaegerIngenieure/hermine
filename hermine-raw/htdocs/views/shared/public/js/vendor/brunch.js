var BRUNCH = BRUNCH || {

	//loading spinners
	spinnerCount : 0,
	showSpinner : function() {
		BRUNCH.spinnerCount = BRUNCH.spinnerCount + 1;
		$("#spinnerArea > .spinnerBox ").removeClass("spinnerFadeOut");
		$("#spinnerArea > .spinnerBox ").show();
		$("#spinnerArea > .spinnerOverlay").show();
	},
	hideSpinner : function() {
		BRUNCH.spinnerCount = BRUNCH.spinnerCount - 1;
		if(BRUNCH.spinnerCount===0) {
			$("#spinnerArea > .spinnerBox ").addClass("spinnerFadeOut");
			setTimeout(function(){ $("#spinnerArea > .spinnerBox ").hide(); }, 510);
			$("#spinnerArea > .spinnerOverlay").hide();
		}
	},

	//notifications
	notify : function(type,title,text) {
		BRUNCH.helpers.initPNotify();
		var notice = new PNotify({
			title: title,
			text: text,
			type: type, //info, success, error, warning
			animate: {
				animate: true,
				in_class: 'bounceIn',
				out_class: 'bounceOutRight'
			}
		});
		notice.get().click(function() {
			notice.remove();
		});
	},

	//navigation and url functions
	navigateTo:function(path) {
		window.location.href = path;
	},
	refresh:function() {
		location.reload();
	},
	refreshTarget:function(param) {
		window.location.href = location.protocol+'//'+location.host+location.pathname+"?"+param[0]+"="+param[1];
	},
	oneHistoryBack:function() {
		window.history.back();
	},

	//get url param
	getUrlParameter : function(sParam) {
		var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++)
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam)
	        {
	            return sParameterName[1];
	        }
	    }
	},

	//send post
	post : function(url,data,type) {
		$.post(url,data,BRUNCH.helpers.postCallback,type);
	},

	//create globally unique id
	createGUID : function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	},

	//check if id is globally unique id
	isGUID : function(id) {
		if(typeof id == "string") {
			return (id.indexOf("-") == -1) ? false : true;
		} else {
			return false;
		}
	},
	
	//check if date is valid date object
	isValidDateObject : function(dateObject) {
		if(Object.prototype.toString.call(dateObject) === "[object Date]") {
			// it is a date
			if (isNaN(dateObject.getTime())) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	},

	//functions classes
	functions : {

		//perform login routine
		login : function() {
			var usr = $("#loginUsername").val();
			var pas = hashGlobalPass($("#loginPassword").val(),usr);
			$.post(
				BRUNCH.config.pageRoot+'/ajax/auth/login',
				{
					"username":usr,
					"password":pas
				},
				BRUNCH.functions.loginCallback,
				'json'
			);
		},
		loginCallback : function(response) {
			if(typeof response.errorCode != "undefined") {
				var title = "Login failed";
				var text = "Username or password is incorrect.";
				$("#loginUsername").val("");
				$("#loginPassword").val("");
				BRUNCH.notify(
					"error",
					title,
					text
				);
			} else {
				if(typeof response.username != "undefined") {
					BRUNCH.notify(
						"success",
						"Login Successful",
						"You have successfully logged in."
					);
					setTimeout(function() {
						BRUNCH.navigateTo(BRUNCH.config.pageRoot);
					},1000);
				} else {
					BRUNCH.notify(
						"error",
						"Login failed",
						"The server does not answer."
					);
				}
			}
		},

		//perform logout routine
		logout : function() {
			$.post(
				BRUNCH.config.pageRoot+'/ajax/auth/logout',
				{},
				BRUNCH.functions.logoutCallback,
				'json'
			);
		},
		logoutCallback : function(response) {
			if(!response.error) {
				BRUNCH.notify(
					"success",
					"Logout successful",
					"You have successfully logged out."
				);
				setTimeout(function() {
					BRUNCH.navigateTo(BRUNCH.config.pageRoot);
				},1000);
			} else {
				BRUNCH.notify(
					"error",
					"Logout failed",
					"You could not be successfully logged out."
				);
			}
		}

	},

	//helper classes
	helpers : {

		//initializes pNotify
		initPNotify : function() {
			if(PNotify.prototype.options.styling != "bootstrap3") {
				PNotify.prototype.options.styling = "bootstrap3";
			}
		},

		//post callback function
		postCallback : function(data) {
			if(data.error) {
				BRUNCH.notify("error","Error","An error occurred: '"+data+"'");				
			} else {
				BRUNCH.notify("success","Action successful","Action completed.");				
			}
		},
	},

	//customData
	customData : {
		userRoles	: new Array()
	}
};

/* user roles */
BRUNCH.customData.userRoles		= {
	"100" : "Framework Administrator",
	"90" : "Administrator",
	"70" : "Moderator",
	"50" : "User",
	"0" : "- None -",
};