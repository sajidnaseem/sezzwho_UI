	/*
	 * Please see the included README.md file for license terms and conditions.
	 */
	// This file is a suggested starting place for your code.
	// It is completely optional and not required.
	// Note the reference that includes it in the index.html file.
	/*jslint browser:true, devel:true, white:true, vars:true */
	/*global $:false, intel:false app:false, dev:false, cordova:false */
	// This file contains your event handlers, the center of your application.
	// NOTE: see app.initEvents() in init-app.js for event handler initialization code.
	// function myEventHandler() {
	//     "use strict" ;
	// // ...event handler code here...
	// }
	// ...additional event handlers here...
	var activityTemplate = $("script#comment-ziggeo-template").html();
	var userHeaderTemplate = $("script#user-profile-template").html();
	var notificationTemplate = $("script#notification-template").html();
	var commentTemplate = $("script#comment-template").html();
	var searchTemplate = $("script#search-results-template").html();
	var profileTemplate = $("script#profile-template").html();
	var popularTemplate = $("script#popular-video-template").html();
	var followingTemplate = $("script#following-list-template").html();
	var followerTemplate = $("script#follower-list-template").html();
	var pushNotification;      // Android notification variable
	var push;                 // IOS notification variable 
	var page = 1,
		limit = 10,
		comments = false,
		cookie = '',
		loginUserID;
	var mainInit = {
		init: function() {
			var that = this;
			this.bindEvent();
			$$(document).on('pageBeforeInit', function(e) {
				var page = e.detail.page;
				that.pageBeforeInit(page);
			});
			$$(document).on('pageAfterAnimation', function(e) {
				var page = e.detail.page;
				that.pageAfterAnimation(page);
			});
			$$(document).on('pageBack', function(e) {
				var page = e.detail.page;
				that.pageBack(page);
			});
			//End Function
		},
		pageAfterAnimation: function(page) {
			var name = page.name;
			var from = page.from;
			if (name === 'homeView' || name === 'contactView' || name === 'setting') {
				if (from === 'left') { //End Function
					//  appFunc.showToolbar();
				}
			}
			
			//End Function
		},
		pageBeforeInit: function(page) {
			var name = page.name;
			var query = page.query;
			var context = page.context;
			checkConnection();
			switch (name) {
				case 'home':
					homeModule.init(query);
					sezzwhoApp.popularVideos.init();
					sezzwhoApp.searchs.init();
					sezzwhoApp.commonFunc.refreshAll();
					(device.platform == "Android" || device.platform == 'android') ? sezzwhoApp.notifications.registerDeviceAndroid(): sezzwhoApp.notifications.registerDeviceIOS();
					break;
				case 'comment':
					sezzwhoApp.showIndicator();
					comments.init(query);
					break;
				case 'detailPage':
					sezzwhoApp.showIndicator();
					detailpage.init(query);
					sezzwhoApp.searchs.init();
					//sezzwhoApp.commonFunc.followingFollower(query.id);
					//sezzwhoApp.commonFunc.activitiesCount(query.id);
					break;
				case 'message':
					messageModule.init(query);
					break;
				case 'business':
					sezzwhoApp.addbusiness.autoComplete(context);
					sezzwhoApp.addbusiness.init();
					break;
				case 'single':
					sezzwhoApp.singlePage.init(query);
					break;
				case 'profile':
					sezzwhoApp.profiles.init();
					break;
				case 'register':
					sezzwhoApp.registers.init();
					break;
				case 'setting':
					sezzwhoApp.settings.init();
					break;
				case 'videodetail':
					videodetail.init(context);
					break;
				case 'accountsetting':
					sezzwhoApp.settings.bindEvent();
					sezzwhoApp.settings.initPasswordValidate();
					break;	
				case 'lostPassword':
					sezzwhoApp.lostPasswords.init();
					break;
				case 'following':
					sezzwhoApp.showIndicator();
					sezzwhoApp.searchs.bindEvent();
				    sezzwhoApp.followingList.init(query);
					break;
				case 'follower':
					sezzwhoApp.showIndicator();
					sezzwhoApp.searchs.bindEvent();
				    sezzwhoApp.followerList.init(query);
					break;		
				case 'default':
					break;
			}
			//End Function
		},
		pageBack: function(page){
			//console.log(page.query.id);
			if(typeof(page.query.id) !== "undefined"){ 
			sezzwhoApp.userIDetail = page.query.id; $("#tab-detial").show(); }
			var name = page.name;
			switch (name){
			case 'home':
			if(isAndroid) {
				 navigator.app.exitApp();
				 }
				 else
				 {
		    	$$(".sezzwho-profile-menu, .sezzwho-setting-menu, .sezzwho-change-password-menu, .sezzwho-about-menu, .sezzwho-logout-menu").hide();
				$$(".sezzwho-login-menu,.sezzwho-registration-menu, .sezzwho-lost-password-menu").show();
			 	sezzwhoApp.mainInits.restLocalStorage();
				$("#my-form2").show("slow");

				 }
			break;
			case 'default':
			}
		},
		getRemoteAvatar: function(id) {
  		return 'http://lorempixel.com/68/68/people/'+id;
		},
		getUserCookies: function() {
			retrievedObject = localStorage.getItem('userlogin');
			return retrievedObject;
			//End Function
		},
		displayResult: function(template, data) {},
		renderTpl: function(markup, renderData) {
			var compiledTemplate = Template7.compile(markup);
			return compiledTemplate(renderData);
			//End Function
		},
		getsezzwhoContents: function(content) {
			var arrContent = {},
				ziggeoCode = {},
				hashtag = {},
				title = {};
			//console.log(content);
			ziggeoCode = content.match(/ziggeo-video=(.*?)><\/ziggeo>/);
			title = content.match(/<div class="videotitle">(.*?)<\/div>/);
			hashtag = content.match(/<div class="hashtags">(.*?)<\/div>/);
			//console.log(ziggeoCode);
			if (ziggeoCode === null) {
				ziggeoCode = {};
				ziggeoCode[1] = "";
			}
			if (title === null) {
				title = {};
				title[0] = "";
			}
			if (hashtag === null) {
				hashtag = {};
				hashtag[0] = "";
			}
			return arrContent = {
					'ziggeoCode': ziggeoCode[1].slice(1, 33),
					'title': title[0],
					'hashtag': hashtag[0]
				}
				//End Function
		},
		stripHTML: function(){
			var re= /<\S[^><]*>/g;
			for (i=0; i<arguments.length; i++)
			arguments[i].value=arguments[i].value.replace(re, "");
		},
		rememberMe: function() {
			if (localStorage.chkbx && localStorage.chkbx != '') {
				$('#remember_me').attr('checked', 'checked');
				$('.sezzwho-username').val(localStorage.usrname);
				$('.sezzwho-password').val(localStorage.pass);
				mainInit.checkLoginStatus();
				
			} else {
				$('#remember_me').removeAttr('checked');
				/*$('#username').val('');*/
				$('#pass').val('');
				$("#my-form2").show("slow");
				//$("#my-form2").removeClass("form-hide");
				if(localStorage.welcome !== "true")
				welcomepages();
			}
			$('#remember_me').click(function() {
				if ($('#remember_me').is(':checked')) {
					// save username and password
					localStorage.usrname = $('.sezzwho-username').val();
					localStorage.pass = $('.sezzwho-password').val();
					localStorage.chkbx = $('#remember_me').val();
				} else {
					localStorage.usrname = '';
					localStorage.pass = '';
					localStorage.chkbx = '';
				}
			});
			//End Function
		},
		checkLoginStatus: function() {
			if (localStorage.userLoggedIn == "true" && localStorage.userLoggedIn != '') {
				$("#my-form2").hide();
				//$("#my-form2").addClass("form-hide");
				b_init.click();
			}
			else if(localStorage.fbLogin == "true" && localStorage.fbLogin != ''){
				$("#my-form2").hide();
				//$("#my-form2").addClass("form-hide");
				//login();
				myApp.showIndicator();
				getStatus();
			}
			else{
			$("#my-form2").show(3000);
			// $("#my-form2").removeClass("form-hide");
			}
		},
		checkWelcomeTutorial : function(){
			
		},
		clearCache: function() {
			var success = function(status) {
				console.log('Message: ' + status);
			}
			var error = function(status) {
				console.log('Error: ' + status);
			}
			window.cache.clear(success, error);
		},
		countFormat: function(value) {
			var result;
			if (value > 999 && value <= 999999) {
				result = (Math.floor(value * 10 / 1000))/10 + 'K';
			} else if (value > 999999) {
				result = (Math.floor(value * 10 / 1000000))/10 + 'M';
			} else {
				result = value;
			}
			return result;
		},
		getHashTags : function(string) {
			   var hashTags, i, len, word, words;
			   words = string.split(/[\s\r\n]+/);
			   hashTags = [];
			   for (i = 0, len = words.length; i < len; i++) {
				 word = words[i];
				 if (word.indexOf('#') === 0 || word.indexOf('@') === 0) {
				   hashTags.push(word);
				 }
			   }
			   return hashTags;
		},
		initUserInfoTemplate: function(data) {
			$(".whats-new-info").text("What's new, " + sezzwhoApp.userloginInfo.user.username + "?");
			$(".recored-facebook-avatar img").attr('src', sezzwhoApp.userloginInfo.user.avatar);
		},
		activities: function(response, bool, type) {
			var items = [],
				item = [],
				count,
				text = [],
				i = 0,
				title="",
				html = '<br><br><div class="none-comment"><i class="fa fa-newspaper-o  fa-5x"></i><p>No Activities</p></div>';
			 if((response.status === "error" || response.error ==="No Activities found.") && type !== "refresh") {
			     sezzwhoApp.hideIndicator();
			   $('.load-result').html(html);
			   $$('.infinite-scroll-preloader').remove();
			    return false;
			 }
			  if((response.status === "error" || response.error ==="No Activities found.") && type === "refresh") {
			     sezzwhoApp.hideIndicator();
				 
			     return false;
			 }
			if (bool) count = sezzwhoApp.activityData.activities.length;
			while (i < response.activities.length) {
				text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
				title = text.title;
				title = title.replace(/\\/g, '');
				if (!bool) {
					sezzwhoApp.activityData = response;
					sezzwhoApp.refreshTime = response.activities[0].time
				} else {
					sezzwhoApp.activityData.activities[count + i] = response.activities[i];
					sezzwhoApp.activityData.page = response.page;
					sezzwhoApp.activityData.page = response.page;
					sezzwhoApp.activityData.has_more_items = response.has_more_items;
				}
				// console.log(text);
				item[i] = {
					nickname: response.activities[i].user[0].username,
					avatar: sezzwhoApp.mainInits.addhttp(response.activities[i].user[0].avatar),
					user_id: response.activities[i].user[0].user_id,
					time: response.activities[i].time_since,
					title: title,
					hashtag: text.hashtag,
					ziggeocode: text.ziggeoCode,
					type: ((response.activities[i].type == "Member_review" || response.activities[i].type == "activity_update") ? true : false),
					commentLenght: (typeof(response.activities[i].comments) !== "undefined") ? response.activities[i].comments.length : 0,
					comments: (typeof(response.activities[i].comments) !== "undefined") ? true : false,
					page: response.page,
					id: response.activities[i].activity_id,
					action: response.activities[i].action,
					name: "following",
					star: response.activities[i].star,
					likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
					like_button: response.activities[i].likes_button,
					refer_count: response.activities[i].refer_count,
					web_link: (response.activities[i].web_link === "") ? false : sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
					location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address) : false,
					share_count : response.activities[i].share_count, 
					is_follow : response.activities[i].followCheck,
					account_type : response.activities[i].user[0].account_type

				};
				i++;
			} // while  loop
			
			items.push({
				"item": item
			});
			//console.log(JSON.stringify(items));
			var output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
			/*
						if(type === 'prepend'){
							$$('#homeView').find('.home-timeline').prepend(output);
						}else if(type === 'append') {
							$$('#homeView').find('.home-timeline').append(output);
						}else {
							$$('#homeView').find('.home-timeline').html(output);
						} */
			if (type !== "refresh") {
				$('.load-result').append(output);
				if($(".load-result .none-comment").length ==1) $(".load-result .none-comment").remove();
			} else {
				if (response.activities.lenght !== 0) sezzwhoApp.refreshTime = response.activities[0].time;
				$('.load-result').prepend(output);
			}
			
			myApp.hideIndicator();
			sezzwhoApp.commonFunc.init(); // Blind share event button ;   
			//End Function
		},
		allLinkUpdate: function(response) {
			sezzwhoApp.activityData = response;
		},
		timeFormat: function(ms) {
			ms = ms * 1000;
			var d_second, d_minutes, d_hours, d_days;
			var timeNow = new Date().getTime();
			var d = (timeNow - ms) / 1000;
			d_days = Math.round(d / (24 * 60 * 60));
			d_hours = Math.round(d / (60 * 60));
			d_minutes = Math.round(d / 60);
			d_second = Math.round(d);
			if (d_days > 0 && d_days < 2) {
				return d_days + i18n.global.day_ago;
			} else if (d_days <= 0 && d_hours > 0) {
				return d_hours + i18n.global.hour_ago;
			} else if (d_hours <= 0 && d_minutes > 0) {
				return d_minutes + i18n.global.minute_ago;
			} else if (d_minutes <= 0 && d_second >= 0) {
				return i18n.global.just_now;
			} else {
				var s = new Date();
				s.setTime(ms);
				return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' ' + f(s.getHours()) + ':' + f(s.getMinutes()));
			}

			function f(n) {
				if (n < 10) return '0' + n;
				else return n;
			}
			//End Function
		},
		getCharLength: function(str) {
			var iLength = 0;
			for (var i = 0; i < str.length; i++) {
				if (str.charCodeAt(i) > 255) {
					iLength += 2;
				} else {
					iLength += 1;
				}
			}
			return iLength;
			//End Function
		},
		matchUrl: function(string) {
			var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;
			string = string.replace(reg, function(a) {
				if (a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1 || a.indexOf('https') !== -1) {
					return '<a href=\"#\" onclick=\"cordova.InAppBrowser.open(\'' + a + '\',\'_blank\',\'location=yes\')\">' + 'click here for web' + '</a>';
				} else {
					return '<a href=\"#\" onclick=\"cordova.InAppBrowser.open(\'http://' + a + '\',\'_blank\',\'location=yes\')\">' + 'click here for web' + '</a>';
				}
			});
			return string;
		},
		addhttp : function(url) {
		   if (!/^(f|ht)tps?:\/\//i.test(url)) {
			  url = "http://" + url;
		   }
		   return url;
		},
		getAge : function(dateString) {
			var today = new Date();
			var birthDate = new Date(dateString);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		},
		mapUrl: function(string) {
			
					return '<a href=\"#\" onclick=\"cordova.InAppBrowser.open(\'https://www.google.ca/maps/place/' + string + '/\',\'_blank\',\'location=no\')\">' + "find us on google maps" + '</a>';
			
		},
		sezzwhoLogout: function() {
			console.log('logout');
			myApp.showIndicator();
			mainView.router.load({
				pageName: "index"
			});
			//mainInit.init();
			//mainInit.rememberMe();
			window.location.reload();
			$$(".sezzwho-profile-menu, .sezzwho-setting-menu, .sezzwho-change-password-menu, .sezzwho-about-menu, .sezzwho-logout-menu").hide();
			$$(".sezzwho-login-menu,.sezzwho-registration-menu, .sezzwho-lost-password-menu").show();
			logout();
			sezzwhoApp.mainInits.restLocalStorage();
			if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
			sezzwhoApp.notifications.unregisterDeviceAndroid();
			}else{
			sezzwhoApp.notifications.unregisterDeviceIos();
			}
			//sezzwhoApp.mainInits.clearCache();
			setTimeout(function(){ myApp.hideIndicator();}, 3000);
		},
		bindEvent: function() {
			var bindings = [{
				element: '.sezzwho-logout-menu',
				event: 'click',
				handler: mainInit.sezzwhoLogout
			}];
			mainInit.bindEvents(bindings);
		},
		restLocalStorage : function(){
			localStorage.setItem("userLoggedIn", false);
			localStorage.setItem("pass" , '');
			localStorage.setItem("chkbx",  '');
			localStorage.setItem("fbLogin",false);
		},
		bindEvents: function(bindings) {
			for (var i in bindings) {
				if (bindings[i].selector) {
					$$(bindings[i].element).on(bindings[i].event, bindings[i].selector, bindings[i].handler);
				} else {
					$$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
				}
			}
			//End Function
		}
	};