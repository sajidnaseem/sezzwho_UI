/*global Framework7, Dom7 */
// Initialize your app
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
Template7.global = {
    android: isAndroid,
    ios: isIos
};

var myApp = new Framework7({
    // Default title for modals
    modalTitle: 'SEZZWHO',
     //Tell Framework7 to compile templates on app init
    precompileTemplates: true,
    // If it is webapp, we can enable hash navigation:
    pushState: true,
	swipeBackPage:isAndroid ? false : true,
	swipePanelCloseOpposite	:true,
	animateNavBackIcon:true,
	swipePanel: isAndroid ? 'left' : false,
	material :  isAndroid ? true : false,
	materialPageLoadDelay:0,
	statusbarOverlay:isAndroid ? false : true,
	fastClicksDistanceThreshold:20,
	fastClicksDelayBetweenClicks:50,
	notificationTitle:'Sezzwho',
	notificationSubtitle:'',
	notificationHold:3000,
	//cache: false,
	template7Pages: true, // enable Template7 rendering for Ajax and Dynamic pages
	// Hide and show indicator during ajax requests
   	fastClicks: true,
	preloader:false,
	modalActionsTemplate:$("script#actions-modal-custom").html(),
	materialPreloaderHtml :'<span class="preloader-inner"><span class="preloader-inner-gap"></span><span class="preloader-inner-left"><span class="preloader-inner-half-circle"></span></span><span class="preloader-inner-right"><span class="preloader-inner-half-circle"></span></span></span>'
	
});



var limit=10,
    page=1,
    cookie={},
    count=10,
    homeModule="",
    retrievedObject="",
    activityData="",
    userloginInfo,
	pictureSource,   // picture source
    destinationType; // sets the format of returned value ;
// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
     dynamicNavbar: true,
	 domCache: true //enable inline pages
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    "use strict";
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});
mainView.hideToolbar();



var sezzwhoApp          			=  myApp;
	sezzwhoApp.uploadlimit 			= '78643200';
	sezzwhoApp.embedding			= '',
	sezzwhoApp.url          		= 'API LINK',
	sezzwhoApp.pageUrl  			= 'pages/android/',
	sezzwhoApp.uploadPath			= 'SERVER',				
	sezzwhoApp.homeUrl				= 'URL',
	sezzwhoApp.lostPasswordUrl      = 'LINKREQUIRED',
	sezzwhoApp.isUploading			= false,
	sezzwhoApp.isUploaded			= false,
	sezzwhoApp.postButton 			= false,
	sezzwhoApp.addLocationButton 	= false,
	sezzwhoApp.addReviewButton 	 	= false,
    sezzwhoApp.autoWhatsNew 		= false,
	sezzwhoApp.isStillUploading 	= false,
	sezzwhoApp.uploadToken			= "";
	sezzwhoApp.baseUrl    			= 'LINK';
	sezzwhoApp.googleServerKey 		= 'AIzaSyBZVeN2VJIqZrM196M1rrlRpoJF9MRN6tQ';
	sezzwhoApp.jsonpcb      		= 'jsonpCallbackSezzWhoApp8513467259';
	sezzwhoApp.notificationsOptions= 'ac_notifier,activity,ditto,refer,follow';
	sezzwhoApp.ziggeoUrl    = 'http://embed.ziggeo.com/v1/applications/KEY/videos/';
	sezzwhoApp.sezzwhoAction = {'generate_auth_cookie'		: 	'generate_auth_cookie', 
								'validate_auth_cookie'		: 	'validate_auth_cookie', 
							'activities'				:	'activities',
							'xprofile'					:	'xprofile',
							'following'					:	'following_activities',
							'activities_post_update'	:	'activities_post_update',
							'notifications_unread_count' 	:	'notifications_unread_count',
							'notifications'					:	'notifications',
							'notifications_delete'			:	'notifications_delete',
							'notifications_single_mark'		:	'notifications_single_mark',
							'activities_post_update_review'	: 'activities_post_update_review',
							'activities_new_comment'		: 'activities_new_comment',
							'retrieve_password'				: 'retrieve_password',
							'members'						: 'members',
							'get_refer_user_count'			: 'get_refer_user_count',
							'sz_add_user_ditte'				: 'sz_add_user_ditte',
							'following_follower'			: 'following_follower',
							'sz_single_activity_post'		: 'sz_single_activity_post',
							'activities_delete_activity'  	: 'activities_delete_activity',
							'activities_post_update'		: 'activities_post_update',
							'delete_comment'				: 'delete_comment',
							'add_follow_button'				: 'add_follow_button',
							'xprofile_update'				: 'xprofile_update',
							'email_exists'					: 'email_exists',
							'username_exists'				: 'username_exists',
							'register'						: 'register',
							'update_user_meta_vars'			: 'update_user_meta_vars',
							'refreshed'						: 'refresh_activities',
							'settings_update_notifications'	: 'settings_update_notifications',
							'avatar_upload'					: 'avatar_upload',
							'fb_connect'					: 'fb_connect',
							'save_device_id'				: 'save_device_id',
							'update_password'				: 'update_password',
							'sezzwho_share_count'			: 'sezzwho_share_count',
							'sz_following_list'				: 'sz_following_list',
							'sz_follower_list'				: 'sz_follower_list'		 			
						   };
  

var b_init= $$('.button.get-storage-data');


b_init.on('click', function (e) {
 // alert(sezzwhoApp.sezzwhoAction.generate_auth_cookie);
    myApp.showIndicator();
   var ajaxurl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.generate_auth_cookie;
    var data = {
			'username'               : $$(".sezzwho-username").val(),
			'password'               : $$(".sezzwho-password").val(),
            'key'                    : sezzwhoApp.jsonpcb  
  		};
	checkConnection(); // Check Connection
   $.post(ajaxurl, data, function(response) {
   
       
       if(response.status == "ok"){
           localStorage.setItem('loginuser', response);
           sezzwhoApp.cookie=response.cookie;
           sezzwhoApp.userloginInfo = response;
           mainView.router.load({url: sezzwhoApp.pageUrl + 'home.html?count=10',force:true});
           sezzwhoApp.mainInits = mainInit;
		   sezzwhoApp.personalFeeds.init(sezzwhoApp.userloginInfo.user.id);   // Initial personal profile Tab
		   sezzwhoApp.notifications.init(); //Initial Notification Tab
           sezzwhoApp.mainInits.initUserInfoTemplate(response);
           myApp.hideIndicator();
           $$(".sezzwho-profile-menu,.sezzwho-change-password-menu, .sezzwho-setting-menu,.sezzwho-about-menu, .sezzwho-logout-menu").show();
		   $$(".sezzwho-login-menu,.sezzwho-registration-menu, .sezzwho-lost-password-menu").hide();
		   localStorage.userLoggedIn = true;
 		   localStorage.setItem("fbLogin",false);
		   localStorage.usrname = $('.sezzwho-username').val();
		   localStorage.pass = $('.sezzwho-password').val();
		   localStorage.chkbx = $('#remember_me').val();
		   $("#my-form2").hide();
		   //$("#my-form2").addClass("form-hide");
       }else{
           myApp.hideIndicator();
		   $(".alert.alert-danger").text(response.error);
		   $("#my-form2").show(3000);
		   //$("#my-form2").removeClass("form-hide");
		   $('#remember_me').removeAttr('checked');
       }
       
    });
    
    
   
});


myApp.onPageInit('home',function(){
		$$(".tab-link.userprofile").on('click', function(e){
				//sezzwhoApp.personalFeeds.init(this.className,sezzwhoApp.userloginInfo.user.id);    
				});

		$$('.open-popup-record').on('click', function () {
			console.log("e");
			myApp.popup('.popup-record');						
			sezzwhoApp.searchs.init();             //Init search function
			sezzwhoApp.addbusiness.init();       // init Business page
			star_rating();                    // Call star rating function
			
			if(sezzwhoApp.isStillUploading){
		     if ($$('.popup-record.modal-in').length > 0) { 
				setTimeout(function(){
					 myApp.addNotification({
						title: 'Uploading...',
						message:isAndroid ? 'Stay tuned, uploading....':'Stay tuned, uploading....<a href="#"><span class="color-red">Cancel upload</span></a>',
						button:{
						 text: 'Cancel upload',
						 color: 'red',
						 close: true
						},
						hold:5000,
						onClose:function(){
						 isAndroid ? navigator.notification.confirm("Do you want to stop video uploading?",onUploadingStop,'Stop uploading',['Yes','No']): '';	
						}
						,	
						onClick:function(){
						 isAndroid ? '' : navigator.notification.confirm("Do you want to stop video uploading?",onUploadingStop,'Stop uploading',['Yes','No']);	
						}
						
					});
					
						myApp.closeModal(".popup-record"); },1000);
					return false;
					}		
			}
			
			});
	
	   $$('.close-popup').on('click',function(){
		  /* $$(".demo-progressbar-load-hide").html('<p style="height:2px"></p>');
		   $$(".record-input").val("");
		   $$("#review-rating img").attr('src','images/star_off.png');
		   $$("#post-a-reivew").attr("disabled", "disabled");
		   $$('input#rating').attr( 'value', 0 );
           $$("#auto-add-business,#auto-aw-whats-new-submit,#auto-post-business").prop("disabled", true);
		   
           */
		   
	   	});
	
		 $$('.window-minimize').on('click',function(){
  			 if ($$('.popup-record.modal-in').length > 0) { 
	    			myApp.closeModal(".popup-record");
				return false;
				}					
		 });
	
	});

/************************/

function onUploadingStop(buttonIndex){
	if(buttonIndex == 1){
	 sezzwhoApp.addbusiness.closePopup();
	}

}

/***********************/

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    //alert('Connection type: ' + states[networkState]);
     var state = navigator.connection.type;
	if (state == Connection.NONE)
	{     
	     setTimeout(function(){ myApp.hideIndicator(); myApp.hidePreloader(); }, 3000); 
	      
		// doesn't have internet, notify
			myApp.addNotification({
				title: 'Sezzwho',
				subtitle: 'No internet',
				hold:5000,
				message: 'Please check your network connection or try again later',
				media: '<i class="fa fa-chain-broken" aria-hidden="true"></i>'
			});
	  		
	}
	else if(state == Connection.WIFI || state == Connection.ETHERNET)
	{
		// has WIFI or ethernet, so we can download all the data
	}
	else
	{
		// has mobile internet, download just basic data
	} 
}

$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

function onDeviceReady() {
    // Now safe to use device APIs
	//welcomepages();
	// pictureSource=navigator.camera.PictureSourceType;
     //destinationType=navigator.camera.DestinationType;
	 sezzwhoApp.ziggeo.init();
	document.addEventListener("backbutton", onBackKeyDown, false);
	mainInit.init();                     // Initialize 
	mainInit.rememberMe();
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);

    window.addEventListener("batterycritical", onBatteryCritical, false);

	//mainInit.clearCache();
	
	
	  var notificationOpenedCallback = function(jsonData) {
    		console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  		};
  
 

  window.plugins.OneSignal
    .startInit("c422207d-3b55-47f4-9158-0a035d044bfe")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
  
  
	
	

}
 // Handle the offline event
    //
    function onOffline() {
		console.log("offline :");
		myApp.addNotification({
				title: 'Sezzwho',
				subtitle: 'No internet',
				hold:5000,
				message: 'Please check your network connection or try again later',
				media: '<i class="fa fa-chain-broken" aria-hidden="true"></i>'
			});
	  	
				/*	var html = "<div class='none-comment'><i class='fa fa-plug fa-5x'></i><p>You're offline</p></div>";
 
			      $(".page .page-content").html(html); */
    }
	
	
    // Handle the online event
    //
    function onOnline() {
   
     // mainInit.checkLoginStatus();
    }

	
// Handle the batterycritical event
    //
    function onBatteryCritical(info) {
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
function onBackKeyDown() {
		 if ($$('.modal-in').length > 0) { 
		 myApp.closeModal(); 
		 return false; 
		 } 
		 else { 
		 mainView.router.back(); 
		 } 
		 return true;
	 }

function welcomepages(){
	
  var options = {
      'bgcolor': '#0da6ec',
      'fontcolor': '#fff',
      'onOpened': function () {
        console.log("welcome screen opened");
      },
      'onClosed': function () {
        console.log("welcome screen closed");
		localStorage.welcome = true;
      }
    },
    welcomescreen_slides = [
      {
        id: 'slide0',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-01.png" /></div>',
        text: ''
      },
      {
        id: 'slide1',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-02.png" /></div>',
        text: ''
      },
      {
        id: 'slide2',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-03.png" /></div>',
        text: ''
      },
      {
        id: 'slide3',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-04.png" /></div>',
        text: ''
      },
	  {
        id: 'slide4',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-05.png" /></div>',
        text: ''
      },
      {
        id: 'slide5',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-06.png" /></div>',
        text: ''
      },
	  {
        id: 'slide6',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-07.png" /></div>',
        text: ''
      },
	  {
        id: 'slide7',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-08.png" /></div>',
        text: ''
      },
	  {
        id: 'slide8',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-09.png" /></div>',
        text: ''
      },
	  {
        id: 'slide9',
        picture: '<div class="tutorialicon"><img src="images/welcome/In-App-Tutorial-480x800-10.png" /></div>',
        text: '<br><br><a class="tutorial-close-btn" href="#">End Tutorial</a>'
      }
    ],
    welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
    
    $$(document).on('click', '.tutorial-close-btn, .welcomescreen-closebtn', function () {
    //  welcomescreen.close();
	 $$('.welcomescreen-container').remove();
	 localStorage.welcome = true;
    });

    $$('.tutorial-open-btn').click(function () {
      welcomescreen.open();  
    });
    
    $$(document).on('click', '.tutorial-next-link', function (e) {
      welcomescreen.next(); 
    });
    
    $$(document).on('click', '.tutorial-previous-slide', function (e) {
      welcomescreen.previous(); 
    });
	
}
/***************************** Face Book Login *******************************/

			var login = function () {
                if (!window.cordova) {
                    var appId = prompt("Enter FB Application ID", "");
                    facebookConnectPlugin.browserInit(appId);
                }
                facebookConnectPlugin.login( ["email"], 
                    function (response) { fb_login(response); console.log(JSON.stringify(response));
					 },
                    function (response) { 
						$("#my-form2").show();
					    //$("#my-form2").addClass("form-hide");
						//alert(JSON.stringify(response));
					
					 });
            }
            
            var showDialog = function () { 
                facebookConnectPlugin.showDialog( { method: "feed" }, 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });
            }
            
            var apiTest = function () { 
                facebookConnectPlugin.api( "me/?fields=id,email,age_range,picture", ["user_birthday"],
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) }); 
            }
            var getAccessToken = function () { 
                facebookConnectPlugin.getAccessToken( 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });
            }
            
            var getStatus = function () { 
                facebookConnectPlugin.getLoginStatus( 
                    function (response) { console.log(JSON.stringify(response)); fb_login(response);  },
                    function (response) { 
								alert(JSON.stringify(response)); 
								setTimeout(function(){ myApp.hideIndicator();}, 3000);
								$("#my-form2").show(); });
            }
            var logout = function () { 
                facebookConnectPlugin.logout( 
                    function (response) { console.log(JSON.stringify(response)) },
                    function (response) { 	
								setTimeout(function(){ myApp.hideIndicator();}, 3000);
								$("#my-form2").show();
							    console.log(JSON.stringify(response)); });
            }

	
function fb_login(fbresponse){
	 checkConnection(); // Check Connection
	if(fbresponse.status === "connected"){
	  var ajaxurl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.fb_connect;
			var data = {
					'key'       	: sezzwhoApp.jsonpcb,
					access_token 	: fbresponse.authResponse.accessToken,
					fields			: 'id,name,first_name,last_name,email,age_range,location,bio,birthday'  
				};
		   $.post(ajaxurl, data, function(response) {
			  // var response = JSON.parse(response);
			  console.log(response);
			    if(response.status == "ok"){
				   localStorage.setItem('loginuser', response);
				   localStorage.login = true;
				   sezzwhoApp.cookie=response.cookie;
				   sezzwhoApp.userloginInfo = response;
				   //sezzwhoApp.userloginInfo.user = [];
				   //sezzwhoApp.userloginInfo.user.id = response.wp_user_id;
				   sezzwhoApp.userloginInfo.user.username = response.user_login;
				   //sezzwhoApp.userloginInfo.user.avatar ="images/gravatar.png";
				   mainView.router.load({url: sezzwhoApp.pageUrl + 'home.html?count=10',force:true});
				   sezzwhoApp.mainInits = mainInit;
				   sezzwhoApp.personalFeeds.init(sezzwhoApp.userloginInfo.user.id);   // Initial personal profile Tab
				   sezzwhoApp.notifications.init(); //Initial Notification Tab
				   sezzwhoApp.mainInits.initUserInfoTemplate(response);
				   myApp.hideIndicator();
				   $$(".sezzwho-profile-menu, .sezzwho-setting-menu, .sezzwho-change-password-menu, .sezzwho-about-menu, .sezzwho-logout-menu").show();
				   $$(".sezzwho-login-menu,.sezzwho-registration-menu, .sezzwho-lost-password-menu").hide();
				   localStorage.usrname = response.user_login;
				   localStorage.pass = response.password;
				   localStorage.chkbx = 'remember-me';
				   localStorage.fbLogin = true;
		           $("#my-form2").hide();
				   //$("#my-form2").addClass("form-hide");

		   }else{
			 myApp.addNotification({
				title: 'Login Error',
				subtitle: 'Face Book',
				hold:5000,
				message: response.error,
				media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
			});  
		    $("#my-form2").show(3000);
			//$("#my-form2").removeClass("form-hide");
		   }
		   });
		
	}
	
}

/******************** Social Invites******************/

$$(".sezzwho-social-menu").on('click', function(){
 var url = sezzwhoApp.baseUrl+"/invites/";
var    inAppBrowserRef=cordova.InAppBrowser.open(url, '_blank', 'location=yes');
inAppBrowserRef.addEventListener('loadstart', function(){ 
   myApp.showIndicator();
});

    inAppBrowserRef.addEventListener('loadstop', function(){
		
		myApp.hideIndicator();
	});
});

