var i18n= {
    app: {
        name: 'HiApp'
    },
    global: {
        cancel: 'Cancel',
        send: 'Send',
        back:'Back',
        done:'Done',
        search:'Search',
        modal_title: 'System',
        modal_button_ok: 'OK',
        minute_ago:' mins ago',
        hour_ago:' hours ago',
        day_ago:' days ago',
        just_now:'Just now',
        language:'Language',
        switch_language:'Switching languages'
    },
    index: {
        nothing_found: 'No matching results',
        nothing_loaded:'Nothing loaded',
        tweet: 'Tweet',
        contacts: 'Contacts',
        setting: 'Setting',
        sen_tweet: 'New Tweet',
        send_placeholder: 'What is new with you.',
        sending:'Submitting...',
        err_text_too_short:'Ah,Content is too short'
    },
    setting: {
        feed_back: 'Feedback',
        feed_back_placeholder:'Hi,Any suggestions to tell us?',
        feed_back_result:'Thank you for your feedback',
        check_update: 'Update',
        about: 'About',
        login_out: 'Log out',
        nickname: 'Name',
        points: 'Points',
        confirm_logout:'Are you sure to log out?',
        current_version:'The current version is '
    },
    login: {
        loginname_placeholder: 'Email/Username',
        password_placeholder: 'Password',
        login_btn: 'Sign In',
        sign_up: 'Sign Up',
        forgot_pwd: 'Forgot password',
        err_empty_input: 'Please enter login name and password',
        err_illegal_email: 'Username must be Email',
        login: 'Loading, please wait...'
    },
    timeline:{
        forward:'Forward',
        comment:'Comment',
        like:'Like'
    },
    item:{
        title:'Tweet'
    },
    comment:{
        reply:'Reply',
        reply_comment:'Reply',
        copy_comment:'Copy',
        placeholder:'Write a comment ...',
        empty_comment:'No one comments',
        commenting:'Submitting...'
    },
    chat:{
        title:'Message',
        chatPlaceholder:'Message'
    },
    geo:{
        loading_geo:'Getting your geo info...',
        permission_denied:'Permission denied',
        position_unavailable:'Position unavailable',
        timeout:'Getting timeout',
        confirm_clean_geo:'You will clear geo info'
    },
    camera:{
        image_uploading: 'Uploading pictures',
        confirm_clear_image: 'Are you sure clear the selected pictures？',
        file_not_found_err: 'Upload file not found',
        invalid_url_err: 'Invalid url',
        connection_err: 'Connection error',
        abort_err: 'Abort upload',
        not_modified_err: 'Not modified'
    },
    error:{
        unknown_error:'Unknown error',
        no_network:'No network connection',
        phonegap_only:'PhoneGap Only'
    }
};;/*jslint browser: true*/
/*global console, Framework7, alert, Dom7, Swiper, Template7*/

/**
 * A plugin for Framework7 to show a slideable welcome screen
 *
 * @module Framework7/prototype/plugins/welcomescreen
 * @author www.timo-ernst.net
 * @license MIT
 */
Framework7.prototype.plugins.welcomescreen = function (app, globalPluginParams) {
  'use strict';
  // Variables in module scope
  var $$ = Dom7,
    t7 = Template7,
    Welcomescreen;

  // Click handler to close welcomescreen
  $$(document).on('click', '.close-welcomescreen', function (e) {
    e.preventDefault();
    var $wscreen = $$(this).parents('.welcomescreen-container');
    if ($wscreen.length > 0 && $wscreen[0].f7Welcomescreen) { $wscreen[0].f7Welcomescreen.close(); }
  });
  
  /**
   * Represents the welcome screen
   *
   * @class
   * @memberof module:Framework7/prototype/plugins/welcomescreen
   */
  Welcomescreen = function (slides, options) {
    
    // Private properties
    var self = this,
      defaultTemplate,
      template,
      container,
      swiper,
      swiperContainer,
      defaults = {
        closeButton: true,        // enabled/disable close button
        closeButtonText : 'Skip', // close button text
        cssClass: '',             // additional class on container
        pagination: true,         // swiper pagination
        loop: false,              // swiper loop
        open: true                // open welcome screen on init
      };
    
    /**
     * Initializes the swiper
     *
     * @private
     */
    function initSwiper() {
      swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: options.loop,
        pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
      });
    }
    
    /**
     * Sets colors from options
     *
     * @private
     */
    function setColors() {
      if (options.bgcolor) {
        container.css({
          'background-color': options.bgcolor,
          'color': options.fontcolor
        });
      }
    }
    
    /**
     * Sets the default template
     *
     * @private
     */
    function defineDefaultTemplate() {
      defaultTemplate = '<div class="welcomescreen-container {{#if options.cssClass}}{{options.cssClass}}{{/if}}">' +
          '{{#if options.closeButton}}' +
          '<div class="welcomescreen-closebtn close-welcomescreen">{{options.closeButtonText}}</div>' +
          '{{/if}}' +
          '<div class="welcomescreen-swiper swiper-container">' +
            '<div class="swiper-wrapper">' +
              '{{#each slides}}' +
              '<div class="swiper-slide" {{#if id}}id="{{id}}"{{/if}}>' +
                '{{#if content}}' +
                  '<div class="welcomescreen-content">{{content}}</div>' +
                '{{else}}' +
                  '{{#if picture}}' +
                    '<div class="welcomescreen-picture">{{picture}}</div>' +
                  '{{/if}}' +
                  '{{#if text}}' +
                    '<div class="welcomescreen-text">{{text}}</div>' +
                  '{{/if}}' +
                '{{/if}}' +
              '</div>' +
              '{{/each}}' +
            '</div>' +
            '{{#if options.pagination}}' +
            '<div class="welcomescreen-pagination swiper-pagination"></div>' +
            '{{/if}}' +
          '</div>' +
        '</div>';
    }
    
    /**
     * Sets the options that were required
     *
     * @private
     */
    function applyOptions() {
      var def;
      options = options || {};
      for (def in defaults) {
        if (typeof options[def] === 'undefined') {
          options[def] = defaults[def];
        }
      }
    }
    
    /**
     * Compiles the template
     *
     * @private
     */
    function compileTemplate() {
      if (!options.template) {
        // Cache compiled templates
        if (!app._compiledTemplates.welcomescreen) {
          app._compiledTemplates.welcomescreen = t7.compile(defaultTemplate);
        }
        template = app._compiledTemplates.welcomescreen;
      } else {
        template = t7.compile(options.template);
      }
    }
    
    /**
     * Shows the welcome screen
     *
     * @public
     * @memberof module:Framework7/prototype/plugins/welcomescreen
     */
    self.open = function () {
      container = $$(template({options: options, slides: slides}));
      swiperContainer = container.find('.swiper-container');
      setColors();
      $$('body').append(container);
      initSwiper();
      container[0].f7Welcomescreen = self;
      if (typeof options.onOpened === 'function') { options.onOpened(); }
    };

    /**
     * Hides the welcome screen
     *
     * @public
     * @memberof module:Framework7/prototype/plugins/welcomescreen
     */
    self.close = function () {
      if (swiper) { swiper.destroy(true); }
      if (container) { container.remove(); }
      container = swiperContainer = swiper = undefined;
      if (typeof options.onClosed === 'function') { options.onClosed(); }
    };
    
   /**
     * Shows the next slide
     *
     * @public
     * @memberof module:Framework7/prototype/plugins/welcomescreen
     */
    self.next = function () {
      if (swiper) { swiper.slideNext(); }
    };
    
   /**
     * Shows the previous slide
     *
     * @public
     * @memberof module:Framework7/prototype/plugins/welcomescreen
     */
    self.previous = function () {
      if (swiper) { swiper.slidePrev(); }
    };
    
   /**
     * Goes to the desired slide
     *
     * @param {number} index The slide to show
     * @public
     * @memberof module:Framework7/prototype/plugins/welcomescreen
     */
    self.slideTo = function (index) {
      if (swiper) { swiper.slideTo(index); }
    };
    
    /**
     * Initialize the instance
     *
     * @method init
     */
    (function () {
      defineDefaultTemplate();
      compileTemplate();
      applyOptions();
      
      // Open on init
      if (options.open) {
        self.open();
      }
      
    }());
    
    // Return instance
    return self;
  };
  
  app.welcomescreen = function (slides, options) {
    return new Welcomescreen(slides, options);
  };
  
};;/*global Framework7, Dom7 */
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
	sezzwhoApp.url          		= 'https://sezzwho.com/api/userplus/',
	sezzwhoApp.pageUrl  			= 'pages/android/',
	sezzwhoApp.uploadPath			= 'http://sezzwho.wowfactormedia.ca/wp-content/plugins/mobileAppSezzwho/upload.php',				
	sezzwhoApp.homeUrl				= 'https://sezzwho.com/wp-admin/admin-ajax.php?',
	sezzwhoApp.lostPasswordUrl      = 'http://sezzwho.com/wp-login.php?action=lostpassword',
	sezzwhoApp.isUploading			= false,
	sezzwhoApp.isUploaded			= false,
	sezzwhoApp.postButton 			= false,
	sezzwhoApp.addLocationButton 	= false,
	sezzwhoApp.addReviewButton 	 	= false,
    sezzwhoApp.autoWhatsNew 		= false,
	sezzwhoApp.isStillUploading 	= false,
	sezzwhoApp.uploadToken			= "";
	sezzwhoApp.baseUrl    			= 'https://sezzwho.com/';
	sezzwhoApp.googleServerKey 		= 'AIzaSyBZVeN2VJIqZrM196M1rrlRpoJF9MRN6tQ';
	sezzwhoApp.jsonpcb      		= 'jsonpCallbackSezzWhoApp8513467259';
	sezzwhoApp.notificationsOptions= 'ac_notifier,activity,ditto,refer,follow';
	sezzwhoApp.ziggeoUrl    = 'http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/';
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

;	/*
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
	};;/**
 *   Ajax calling
 */
var sxhr = {
    simpleCall: function(url, callback, data, name) {
        //console.log(userlogin);
        var ajaxurl = url + callback;
        var text;
        $.post(ajaxurl, data, function(response) {
            sezzwhoApp.xhrs.data = response;
            switch (name) {
                case "activities":
                    sezzwhoApp.mainInits.activities(response, false, "activity");
                    sezzwhoApp.homeModules.loadmoreContent(); // Initialize LoadmoreContent Function
                    break;
                case 'loadmoreActivity':
                    sezzwhoApp.mainInits.activities(response, true, "more");
                    console.log("loadmoreActivities");
                    break;
                case 'refreshActivity':
                    sezzwhoApp.mainInits.activities(response, true, "refresh");
                    break;
				case 'login':
                    //  feedbackModule.init();
                    break;
                case 'profile':
                    sezzwhoApp.personalFeeds.getPersonalFeed(response);
                    break;
                case 'personalFeed':
                    sezzwhoApp.personalFeeds.activitiesFeed(response,false);
                   if(sezzwhoApp.checkPersonalRefresh)
				    sezzwhoApp.personalFeeds.loadmoreFeedContent(); // Initialize load more personal content      
                    break;
                case 'loadmoreFeedActivity':
                    sezzwhoApp.personalFeeds.activitiesFeed(response, true);
                    console.log("loadmoreActivities");
                    break;
                case 'detialpageheader':
                    sezzwhoApp.detailpages.getPersonalFeed(response);
                    break;
                case 'detialpagelist':
                    sezzwhoApp.detailpages.activitiesFeed(response);
                    sezzwhoApp.detailpages.loadmoreFeedContent(); // Initialize load more personal content    
                    break;
                case 'loadmoreDetailActivity':
                    sezzwhoApp.detailpages.activitiesFeed(response);
                    break;
				case 'reviewpagelist':
                    sezzwhoApp.reviewpages.activitiesReviewFeed(response);
                    sezzwhoApp.reviewpages.loadmoreFeedContent(); // Initialize load more personal content    
                    break;
                case 'loadmoreReviewActivity':
                    sezzwhoApp.reviewpages.activitiesReviewFeed(response);
                    break;
                case 'postUpdate':
                    sezzwhoApp.personalFeeds.response_post_update(response);
                    break;
                case 'postBusinessReview':
                    sezzwhoApp.addbusiness.doneReview(response);
                    break;
                case 'postComment':
                    sezzwhoApp.comments.doneComments(response);
                    break;
                case 'unreadCount':
                    sezzwhoApp.notifications.displayCount(response);
                    break;
                case 'notification':
                    sezzwhoApp.notifications.displayNotifications(response);
                    break;
                case 'allUpdate':
                    sezzwhoApp.mainInits.allLinkUpdate(response);
                    break;
                case 'comments':
                    sezzwhoApp.comments.displayJsonComments(response, false);
                    sezzwhoApp.comments.loadmoreContent(); // Initialize load more personal content    
                    break;
                case 'comment_edit_delete_activity':
                    sezzwhoApp.comments.displayEditDeleteMessage(response);
                    break;
                case 'loadmoreComment':
                    sezzwhoApp.comments.displayJsonComments(response, true);
                    break;
                case 'searchResult':
                    sezzwhoApp.searchs.displayResult(response);
                    break;
                case 'refer':
                    sezzwhoApp.commonFunc.displayReferResult(response);
                    break;
                case 'follower':
                    sezzwhoApp.commonFunc.displayCountFollower(response);
                    break;
                case 'activityCount':
                    sezzwhoApp.commonFunc.displayCountActivity(response);
                    break;
                case 'notificationCount':
                    sezzwhoApp.commonFunc.displayCountNotification(response)
                    break;
                case 'singlePage':
                    sezzwhoApp.singlePage.displayActivity(response);
                    break;
                case 'activities_edit_delete_activity':
                    sezzwhoApp.commonFunc.displayEditDeleteMessage(response);
                    break;
                case 'notifications_delete':
                    sezzwhoApp.notifications.notifications_delete_message(response);
                    break;
				 case 'notifications_mark':
                    sezzwhoApp.notifications.notifications_mark_message(response);
                    break;
                case 'following_unfollowing_button':

                    break;
                case 'popular_video':
                    sezzwhoApp.popularVideos.displayVideo(response);
                    break;
				case 'changePassword':
					sezzwhoApp.settings.responseUpdatePassword(response);
					break;
                case 'shareCount':
					sezzwhoApp.commonFunc.reponseShareCount(response);
					break;
				case 'followingList':
				    sezzwhoApp.followingList.displayFollowingList(response);
					sezzwhoApp.followingList.loadmore();
				   break;
				case 'followingLoadMore':
				      sezzwhoApp.followingList.displayFollowingList(response);
				   break;   
				case 'followerList':
				    sezzwhoApp.followerList.displayFollowerList(response);
					sezzwhoApp.followerList.loadmore();
				   break;
				case 'followerLoadMore':
				      sezzwhoApp.followerList.displayFollowerList(response);
				   break;   	
				default:
                    console.log("error");
                    break;
            }
        });

        //End Function
    },
    multipleCall: function() {

    }

};

sezzwhoApp.xhrs = sxhr;;var commonFunc = {

    init: function() {
        this.blindEvent();
        this.guesterFunc();
    },	
	ziggeoGetStream : function(res){	 
		 	var id = ".activity-" + sezzwhoApp.shareWidgetId;
        	var url = sezzwhoApp.baseUrl + $$(id).find('.share-link').val(); 
			try
		 	{	
			  	sezzwhoApp.ziggeoStreamsUrl =res.streams[2].token;
				videoUrl = sezzwhoApp.ziggeoUrl + res.token + '/streams/'  + sezzwhoApp.ziggeoStreamsUrl + "/video.mp4";
				console.log(videoUrl);
        		setTimeout(function() {
           		window.plugins.socialsharing.share($$(id).find('.videotitle').text(), "SEZZWHO", videoUrl, url, sezzwhoApp.commonFunc.shareSuccessCallback, sezzwhoApp.commonFunc.SareerrorCallback);
        		}, 300);  
			  
			} catch(e){  
  				videoUrl =  sezzwhoApp.ziggeoUrl + res.token + "/video.mp4";
				window.plugins.socialsharing.share($$(id).find('.videotitle').text(), "SEZZWHO", videoUrl, url, sezzwhoApp.commonFunc.shareSuccessCallback, sezzwhoApp.commonFunc.SareerrorCallback);
              				console.log(videoUrl);

			} 
		 	
	},
    shareWidget: function() {
        sezzwhoApp.showPreloader();
        //console.log($$(this).attr('data-arg'));
        var data = $(this).data('arg');
        var vodeoUrl="";
        sezzwhoApp.shareWidgetId = data.id;
    	
        sezzwhoApp.ZiggeoSdk.Videos.get(data.video, sezzwhoApp.commonFunc.ziggeoGetStream);
		/*
			if (sezzwhoApp.ziggeoStreamsUrl !== '') {
				videoUrl = sezzwhoApp.ziggeoUrl + data.video + '/streams/' + sezzwhoApp.ziggeoStreamsUrl + "/video.mp4";
			} else {
				videoUrl = sezzwhoApp.ziggeoUrl + data.video + "/video.mp4";
			}
        var id = ".activity-" + data.id;
        var url = sezzwhoApp.baseUrl + $$(id).find('.share-link').val();
	   		
        setTimeout(function() {
            window.plugins.socialsharing.share($$(id).find('.videotitle').text(), "SEZZWHO", videoUrl, url, sezzwhoApp.commonFunc.shareSuccessCallback, sezzwhoApp.commonFunc.SareerrorCallback);
        }, 300); */
		
		
    },
    shareActionWidget: function(data) {
        sezzwhoApp.showPreloader();
        var videoUrl="";
        //console.log($$(this).attr('data-arg'));
        sezzwhoApp.shareWidgetId = data.id;
		sezzwhoApp.ZiggeoSdk.Videos.get(data.video, sezzwhoApp.commonFunc.ziggeoGetStream);
    },
    shareCommentWidget: function(event) {
        sezzwhoApp.showPreloader();


        //console.log($(event).data('arg'));
        var data, videoUrl;
        data = $(event).data('arg');
				//sezzwhoApp.shareWidgetId = id;
				if (data.videoCheck){
					sezzwhoApp.ZiggeoSdk.Videos.get(data.video, sezzwhoApp.commonFunc.ziggeoGetStream);
					/*if (sezzwhoApp.ziggeoStreamsUrl !== '') {
					videoUrl = sezzwhoApp.ziggeoUrl + data.video + '/streams/' + sezzwhoApp.ziggeoStreamsUrl + "/video.mp4";
				} else {
					videoUrl = sezzwhoApp.ziggeoUrl + data.video + "/video.mp4";
				}
		        console.log(videoUrl);*/
		}else{
            videoUrl ="file:///android_asset/www/" + data.image;	
			setTimeout(function() {
				window.plugins.socialsharing.share(data.text, "SEZZWHO", videoUrl, sezzwhoApp.baseUrl, sezzwhoApp.commonFunc.shareSuccessCallback, sezzwhoApp.commonFunc.SareerrorCallback);
			}, 300);
		}
        
    },
    shareSuccessCallback: function() {
        //console.log("Success full");
        sezzwhoApp.hidePreloader();
        var el = id = ".activity-" + sezzwhoApp.shareWidgetId;
        //console.log(el);
        $(el).find(".share-count").text(sezzwhoApp.mainInits.countFormat(parseInt($(el).find(".share-count-hidden").val()) + 1)).first().text();
        $(el).find(".share-count-hidden").val(parseInt($(el).find(".share-count-hidden").val()) + 1);
        var count = $(el).find(".share-count-hidden").val();
		sezzwhoApp.ziggeoStreamsUrl ='';
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'activity_id': sezzwhoApp.shareWidgetId,
            //'count': $(el).find(".share-count").text(parseInt($(el).find(".share-count").first().text())+1).first().text()
            'count': count
        };
        // console.log(options);
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sezzwho_share_count, options, "shareCount");
    },
    ShareerrorCallback: function() {
        sezzwhoApp.hidePreloader();
        console.log("Error");
    },
    reponseShareCount: function(response) {
        console.log(response);
    },
    videoPlayer: function() {
        var url = $$(this).attr('data-url');
        VideoPlayer.play(
            url, {
                volume: 0.5,
                scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT
            },
            function(err) {
                console.log(err);
            }
        );
    },
    refreshAll: function() {
        $$('.refreshAll').on('click', function() {
            $$('.fa.fa-refresh').addClass('fa-spin');
            sezzwhoApp.checkPersonalRefresh = false;
            sezzwhoApp.notifications.notifications_unread_count();
            sezzwhoApp.notifications.getNotification();
            sezzwhoApp.homeModules.refreshActivities();
            sezzwhoApp.personalFeeds.getFeedActivities();
            sezzwhoApp.popularVideos.getPopularVideo();
            setTimeout(function() {
                $$('.fa.fa-refresh').removeClass('fa-spin');
            }, 5000);


        });

    },
    activity_like: function() {
        var el = "",
            id = "",
            option = {},
            url = "";

        el = $$(this);
        id = el.attr('data-id');
        options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'activity_id': id

        };
        //alert(id);
        url = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.sz_add_user_ditte;
        id = ".activity-" + id;
        var animId = id + ' span.likes';
        $(animId).each(function() {
            $(this).prop('Counter', 100).animate({
                Counter: 0
            }, {
                duration: 500,
                easing: 'swing',
                step: function(now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });

        $.post(url, options, function(data) {

            if (data.text === 'Ditto') {

                $(id).find('span.ditto').text(data.text);
                console.log(id);
                (typeof(data.response) === 'undefined') ? $(id).find('.likes').text('0'): $(id).find('.likes').text(sezzwhoApp.mainInits.countFormat(data.response));

                $(id).find('.fa.ditto').addClass('fa-thumbs-o-up').removeClass('fa-thumbs-up');
            } else {
                //$(id).find('.ditto-love').show('slow');
                //setTimeout(function(){ $(id).find('.ditto-love').hide('slow'); }, 3000);
                $(id).find('span.ditto').text(data.text);
                (typeof(data.response) === 'undefined') ? $(id).find('.likes').text('0'): $(id).find('.likes').text(sezzwhoApp.mainInits.countFormat(data.response));
                $(id).find('.fa.ditto').addClass('fa-thumbs-up').removeClass('fa-thumbs-o-up');
            }
            console.log(data);
        });


    },
    referActivity: function(arg) {
        //alert(arg);
        //sezzwhoApp.popup('.picker-refer');
        sezzwhoApp.referId = arg;

        // Load about page:
        mainView.router.load({
            url: sezzwhoApp.pageUrl + 'refer.html',
            force: true
        });
        // Initialize search bar and refer button
        setTimeout(function() {
            sezzwhoApp.searchs.searchuser();
            sezzwhoApp.commonFunc.init();
        }, 1000);
    },
    postRefer: function() {

        var options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'refer': $("#autocomplete-user .item-after").text(),
            'activity_id': sezzwhoApp.referId
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.get_refer_user_count, options, "refer");
        //End function
    },
    displayReferResult: function(response) {
        var el = $(".activity-" + sezzwhoApp.referId);
        el.find(".refer").text(sezzwhoApp.mainInits.countFormat(response.count));
        if (response.notification_status == true) {
            myApp.addNotification({
                title: 'Refer',
                hold: 7000,
                subtitle: '',
                message: 'Sorry, you already refered him/her',
                media: '<i class="fa fa-info-circle"></i>'
            });
        }
        mainView.router.back();
        //End function
    },
    deletePost: function(id, aID) {
        if (id == sezzwhoApp.userloginInfo.user.id) {
            var options = {
                'key': sezzwhoApp.jsonpcb,
                'cookie': sezzwhoApp.cookie,
                'activity_id': aID
            };
            sezzwhoApp.deleteActivity = aID;
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_delete_activity, options, "activities_edit_delete_activity");

        } else {
            myApp.addNotification({
                title: 'Un-authorized',
                hold: 7000,
                subtitle: '',
                message: 'Sorry, you are not authorized to delete this video',
                media: '<i class="fa fa-info-circle"></i>'
            });
        }
    },
    editPost: function(id, aID) {
        if (id == sezzwhoApp.userloginInfo.user.id) {
            sezzwhoApp.editID = aID;
            requirejs(["build/editvideo/editvideo"], function(video) {
                video.initEdit();
            });
            myApp.popup('.popup-re-record');
        } else {
            myApp.addNotification({
                title: 'Un-authorized',
                subtitle: '',
                message: 'Sorry, you are not authorized to edit this video',
                media: '<i class="fa fa-info-circle"></i>'
            });
        }
    },
    displayEditDeleteMessage: function(response) {
        var el = "#activity-" + sezzwhoApp.deleteActivity + ", #popular-" + sezzwhoApp.deleteActivity;
        if (response.status === "ok") {
            $$(el).remove();
        }
    },
    followingFollower: function(userID) {
        var options = {

            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'user_id': userID
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following_follower, options, "follower");

    },
    displayCountFollower: function(response) {
        sezzwhoApp.follower = response.follower;
        sezzwhoApp.following = response.following;
        sezzwhoApp.is_follow = response.check;
    },
    guesterFunc: function() {

        /*  requirejs(["js/hammer/hammer"], function(hammer) {
              var myElement = document.getElementById('record-slidedown');

              // create a simple instance
              // by default, it only adds horizontal recognizers
              var mc = new Hammer(myElement);
              mc.add(new Hammer.Pan({
                  direction: Hammer.DIRECTION_ALL,
                  threshold: 200
              }));
              // let the pan gesture support all directions.
              // this will block the vertical scrolling on a touch-device while on the element
              mc.get('pan').set({
                  direction: Hammer.DIRECTION_ALL
              });

              // listen to events...
              mc.on("panleft panright panup pandown tap press", function(ev) {
                  //	myElement.textContent = ev.type +" gesture detected.";
                  if (ev.type === 'pandown' && myElement.getAttribute('class') === "popup popup-record modal-in") {
                      myApp.closeModal('.popup-record')
                  }

              });

          }); */
    },
    lostSezzwhoPassword: function() {

        var url = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.retrieve_password;
        var options = {
            'key': sezzwhoApp.jsonpcb,
            user_login: $("#user_login").val()
        }
        $.post(url, options, function(response) {
            if (jQuery(response).find('#login_error').length == 1) {
                //$(".sezzwho-password-error").html(''); 	
                myApp.addNotification({
                    title: 'Error',
                    hold: 5000,
                    message: '<span class="color-red"><strong>ERROR</strong>: Enter a username or email address.</span>',
                    media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
                });
            } else {
                myApp.addNotification({
                    title: 'Successful',
                    hold: 5000,
                    subtitle: '',
                    message: '<span class="color-lighgreen">Check your email for the confirmation link.</span>',
                    media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
                });
            }
        });

    },
    activitiesCount: function(userid) {

        var options = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': userid,
            'cookie': sezzwhoApp.cookie,
            'type': "activity_update,Member_review",
            'comments': true,
            'limit': 10000
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, options, "activityCount");

    },
    displayCountActivity: function(response) {
        (typeof(response.error) !== 'undefined') ? sezzwhoApp.activityCount = 0: sezzwhoApp.activityCount = response.activities.length;
    },
    displayCountNotification: function(response) {
        var el = $('i.fa.fa-flag span');
        if (response.count == 0) {
            var html = '<div class="none-comment"><i class="fa fa-exclamation-triangle fa-5x"></i><p>No New Notifications</p></div>';
            $(".notification-template").html(html);
            el.text(response.count);
        } else {
            el.text(response.count);
        }
    },
    animateValue: function(id, start, end, duration) {
        var range = end - start;
        var current = start;
        var increment = end > start ? 1 : -1;
        var stepTime = Math.abs(Math.floor(duration / range));
        var obj = document.getElementById(id);
        var timer = setInterval(function() {
            current += increment;
            obj.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    },
    init_action_menu: function() {
        var el, activity_id, user_id, items, arr = [];
        el = $$(this);
        sezzwhoApp.actionMenu = [];
        sezzwhoApp.actionMenu.activity_id = el.attr('data-activityid');
        sezzwhoApp.actionMenu.user_id = el.attr("data-userid");
        items = el.attr('data-items');
        arr = items;
        //console.log(items);
        //console.log(arr.action);
        //strinItem =JSON.stringify(items);
        parseItem = JSON.parse(items);
        //console.log(strinItem.action);
        console.log(parseItem.action);

        //- Two groups
        var buttons1 = [{
                text: 'Sezzwho',
                label: true
            }, {
                text: '<i class="fa fa-minus-square-o"></i> Delete',
                bold: true,
                color: 'red',
                onClick: function() {
                    sezzwhoApp.commonFunc.deletePost(user_id, activity_id);
                }
            },
            /*{
                       text: '<i class="fa fa-share-square-o"></i> Refer',
                       bold: true,
                       color: 'indigo',
                       onClick: function() {
                           sezzwhoApp.commonFunc.referActivity(activity_id);
                       }
                   }, */
            {
                text: '<i class="fa fa-pencil-square-o"></i> Edit',
                bold: true,
                color: 'lightgreen',
                onClick: function() {
                    sezzwhoApp.commonFunc.editPost(user_id, activity_id);

                }
            }, {
                text: '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Report',
                bold: true,
                color: 'orange',
                onClick: function() {
                    cordova.plugins.email.isAvailable(
                        function(isAvailable) {
                            alert('Service is not available'); //unless isAvailable; 
                        }

                    );

                    // Add app alias 
                    cordova.plugins.email.addAlias('gmail', 'com.google.android.gm');

                    // Specify app by name or alias 
                    cordova.plugins.email.open({
                        app: 'gmail',
                        subject: 'Sent from Gmail'
                    });
                }
            }
        ];
        var buttons2 = [{
            text: 'Cancel',
            color: 'red'
        }];
        var buttons3 = [{
            data: parseItem,
            items: true,
            loginUser: sezzwhoApp.userloginInfo.user.id
        }];
        var groups = [buttons1, buttons2, buttons3];
        myApp.actions(groups);

        //End Function
    },
    actionButtons: function(type) {

        if (type === "share") {
            myApp.closeModal();
            var data = $(event.target).data('arg');
            sezzwhoApp.commonFunc.shareActionWidget(data);
        } else if (type === "close") {
            myApp.closeModal();
        } else if (type === "edit") {
            myApp.closeModal();
            sezzwhoApp.commonFunc.editPost(sezzwhoApp.actionMenu.user_id, sezzwhoApp.actionMenu.activity_id);
        } else if (type === "delete") {
            myApp.closeModal();
            sezzwhoApp.commonFunc.deletePost(sezzwhoApp.actionMenu.user_id, sezzwhoApp.actionMenu.activity_id);
        } else if (type === "report") {
            sezzwhoApp.addNotification({
                hold: 5000,
                title: 'Report',
                message: 'Thanks, We will get back to you soon!'
            });
            sezzwhoApp.commonFunc.actionButtons('close');
        } else if ($(type).attr("data-type") === "follow") {
            var e = type;
            var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.add_follow_button;
            var options = {
                'key': sezzwhoApp.jsonpcb,
                'user_id': $(e).attr('data-id'),
                'cookie': sezzwhoApp.cookie,

            };
            var that = e;
            console.log($(e).attr('data-id'));
            if ($(e).find('span').attr('class') === 'startfollow active-state' || $(e).find('span').attr('class') === 'startfollow') {

                $(e).find('span i').attr('class', 'fa fa-spinner fa-spin');

                $.get(ajaxUrl, options, function(res) {
                    if (res.response == true) {
                        $(that).find('span').html('<i class="fa fa-user-times"></i> Following');
                        $(that).find('span').addClass('stopfollow').removeClass('startfollow');
                        myApp.addNotification({
                            hold: 5000,
                            title: 'Follow',
                            message: 'You are following',
                            media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
                        });
                    }

                });


            } else {
                $(this).find('span i').attr('class', 'fa fa-spinner fa-spin');
                options.delete = true;
                $.get(ajaxUrl, options, function(res) {
                    if (res.response == false) {
                        $(that).find('span').html('<i class="fa fa-user-plus"></i> follow');
                        $(that).find('span').addClass('startfollow').removeClass('stopfollow');
                        myApp.addNotification({
                            hold: 5000,
                            title: 'Following',
                            message: 'You are un following',
                            media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
                        });

                    }

                });
            }
        }
    },
    turnOnPost: function() {
        $('#auto-post-business').hide();
        $('#auto-aw-whats-new-submit, #auto-add-business').show();
    },
    switchPostUpdate: function(e) {
        /*
        	if($(".auto-post input").prop("checked")){
        		$('#aw-whats-new-submit, #add-business').show();
        		$('#auto-aw-whats-new-submit').hide();
        		sezzwhoApp.autoWhatsNew = false;
        	}else {
        		$('#aw-whats-new-submit, #add-business').hide();
        		$('#auto-aw-whats-new-submit').show();
        	  	} */
    },
    blindEvent: function() {
        var bindings = [{
                element: '.share-button',
                event: 'click',
                handler: this.shareWidget
            }, {
                element: '.share-button-comment',
                event: 'click',
                handler: this.shareCommentWidget
            },
            {
                element: '.action-menu',
                event: 'click',
                handler: this.init_action_menu
            }, {
                element: '.play-video',
                event: 'click',
                handler: this.videoPlayer
            }, {
                element: '.activity-like',
                event: 'click',
                handler: this.activity_like
            }, {
                element: '#refer-user',
                event: 'click',
                handler: this.postRefer
            }, {
                elemet: "#wp-submit",
                event: 'click',
                handler: this.lostPassword
            }, {
                element: ".open-popup-record",
                event: 'click',
                handler: this.turnOnPost
            },
            {
                element: ".auto-post",
                event: 'click',
                handler: this.switchPostUpdate
            }
        ];
        sezzwhoApp.mainInits.bindEvents(bindings);

    }


};

sezzwhoApp.commonFunc = commonFunc;;var loadmore = false;
var feeds = {

    init: function(userid) {
        this.userProfileHeader(userid);
        //console.log("profile");
        this.bindEvent();
		sezzwhoApp.checkPersonalRefresh= true;
    },
    userProfileHeader: function(userid) {
        var items, bio, output;
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': userid,
            'cookie': sezzwhoApp.cookie,
            'field': 'Bio,Website,Address'
        };
        
        
		var p = new Promise(function(resolve, reject) {
		resolve(sezzwhoApp.commonFunc.followingFollower(sezzwhoApp.userloginInfo.user.id));
		});
		p.then(function(){
			sezzwhoApp.commonFunc.activitiesCount(sezzwhoApp.userloginInfo.user.id);
			}).then(function(){
				sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.xprofile, option, "profile");
				});
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_unread_count, option, "notificationCount");
      
        this.getFeedActivities();
    },
    getPersonalFeed: function(response) {
      	var  bio = response.Bio;
		var  website= response.Website;
		var address = response.Address,
	    
            item = {
                'avatar': sezzwhoApp.mainInits.addhttp(sezzwhoApp.userloginInfo.user.avatar),
                'bio': bio.substring(0, 122),
                'id': sezzwhoApp.userloginInfo.user.id,
                'username': sezzwhoApp.userloginInfo.user.username,
                'follower': response.followers,
                'following': response.following,
                'post_count': response.activityCount,
                'is_follow': response.is_follow,
				'address'	: address,
				'website': sezzwhoApp.mainInits.addhttp(website),
				'follow' : true
            };
           var output = sezzwhoApp.mainInits.renderTpl(userHeaderTemplate, item);

            $(".user-profile-header").html(output);
      
       
	    //End Fucntion 
    },
    getFeedActivities: function() {

        var option = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': sezzwhoApp.userloginInfo.user.id,
            'cookie': sezzwhoApp.cookie,
            'type': "activity_update,Member_review",
            'comments': true,
    		'scope':"just-me,mentions"

        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "personalFeed");
        //End Function
    },
    activitiesFeed: function(response,type) {
             var items = [],
                    item = [],
                    text = [],
					title="",
					html = '<div class="none-comment"><i class="fa fa-newspaper-o  fa-5x"></i><p>No Activities</p></div>';
					//sezzwhoApp.activityFeedData.has_more_items=false;
			if (response.status !== "error") {
               
                for (var i = 0; i < response.activities.length; i++) {
                    text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
                    title = text.title;
					title = title.replace(/\\/g, ''); 
                    sezzwhoApp.activityFeedData = response;
                    // console.log(text);
                    item[i] = {
                        nickname: response.activities[i].user[0].display_name,
                        avatar: sezzwhoApp.mainInits.addhttp(response.activities[i].user[0].avatar),
                        user_id: response.activities[i].user[0].user_id,
                        time: response.activities[i].time_since,
                        title: title,
                        hashtag: text.hashtag,
                        ziggeocode: text.ziggeoCode,
                        type: ((response.activities[i].type == "Member_review" || response.activities[i].type == "activity_update") ? true : false),
                        commentLenght: (typeof(response.activities[i].comments) != "undefined") ? response.activities[i].comments.length : 0,
                        comments: (typeof(response.activities[i].comments) != "undefined") ? true : false,
                        page: response.page,
                        id: response.activities[i].activity_id,
                        action: response.activities[i].action,
                        name: "personal",
                        star: response.activities[i].star,
                        likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
                        like_button: response.activities[i].likes_button,
                        refer_count: response.activities[i].refer_count,
                        web_link: sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
						location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address)  : false ,
						share_count: response.activities[i].share_count,
						is_follow : response.activities[i].followCheck,
						account_type: response.activities[i].user[0].account_type
                    };

                } // End for loop
                items.push({
                    "item": item
                });
                //console.log(JSON.stringify(items));

                var output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
				if(type == true)
				 $('.presonal-content').append(output);
				else
                $('.presonal-content').html(output);
                this.bindEvent();
                myApp.hideIndicator();
                sezzwhoApp.commonFunc.init(); // Blind share event button ;   

            } else {
                $('.presonal-content').html(html);
                sezzwhoApp.activityFeedData = [];
                sezzwhoApp.activityFeedData.has_more_items = false;
                myApp.detachInfiniteScroll($$('.infinite-scroll-personal'));
                // Remove preloader
                $$('.infinite-scroll-preloader-personal-page').remove();
            }

        } //End Function
        ,
    loadmoreFeedContent: function() {

        // Loading flag
        var loading = false;

        // Last loaded index

        // Max items to load
        var maxItems = sezzwhoApp.activityFeedData.has_more_items;

        // Append items per load
        var itemsPerLoad = 10;
        var page = 2;
        loadmore = true;

        // Attach 'infinite' event handler
        $$('.infinite-scroll-personal').on('infinite', function() {

            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;

            // Emulate 1s loading
            setTimeout(function() {
                // Reset loading flag
                loading = false;
                maxItems = sezzwhoApp.activityFeedData.has_more_items;
                if (maxItems == false) {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll-personal'));
                    // Remove preloader
                    $$('.infinite-scroll-preloader-personal-page').remove();
                    return;
                }
                 // Generate new items HTML
                var html = '';

                var option = {
                    'key': sezzwhoApp.jsonpcb,
                    'user_id': sezzwhoApp.userloginInfo.user.id,
                    'cookie': sezzwhoApp.cookie,
                    'page': page,
                    'per_page': itemsPerLoad

                };
                sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "loadmoreFeedActivity");


                //console.log(sezzwhoApp.activityFeedData.has_more_items);
                // Append new items
                //$$('.load-result').append(html);

                // Update last loaded index
                if (sezzwhoApp.activityFeedData.has_more_items == true) {
                    page += 1;
                    maxItems = true;
                } else {
                    maxItems = false;
                }


            }, 1000);
        });



        //End Function
    },
    post_update: function(contentData, rating, weblink) {
        var options = {
            'content': contentData,
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'rating': rating,
            'link': weblink

        };

        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_post_update, options, "postUpdate");



        //End Function
    },
    response_post_update: function(response) {
		console.log(response);
        if (response.status == "ok") {
            myApp.addNotification({
                title: 'Sezzwho',
                subtitle: 'Post Updated',
                message: 'Post updated successfully<a href="#"><span class="color-indigo"> SHARE ME</span></a>',
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">',
				hold : 7000, 
				button:{
				  text: 'close',
				  color: 'red',
				  close: true
				},
				onClick: function() {
					var url = sezzwhoApp.baseUrl+'/members/'+sezzwhoApp.userloginInfo.user.username+'/activity/'+response.activity_id; 
				  window.plugins.socialsharing.share('SEZZWHO is aimed at reviewing the products and services you love.', null,null, url );
				}
            });
            this.getFeedActivities(); // Update personal feed 
			sezzwhoApp.homeModules.refreshActivities(); // refresh following page
       	    sezzwhoApp.popularVideos.getPopularVideo(); // refresh popular page
            //Rest all data
            sezzwhoApp.addbusiness.closePopup();
        } else {
            myApp.addNotification({
                title: 'Sezzwho',
                subtitle: 'Notification subtitle',
                message: response.error,
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
        }

        //End Function
    },
    recordVideo: function(type) {
        sezzwhoApp.recordingType = type;
        captureVideo();
        //end function
    },
    initPostData: function() {

        var contentData,
            videotitle = "",
            videocontent = "",
            rating = "",
            weblink = "",
            hashtag = "";
		($$("#video-title").val()=="") ? $("#video-title").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        ($("#autocomplete-user").val()=="") ? $("#autocomplete-user").addClass('danger-alert'):$("#autocomplete-user").removeClass('danger-alert');
		videotitle = '<div class="videotitle">' + $$("#video-title").val() + '</div>';
        rating = $$("#rating").val();
		if(rating < 3) {
			myApp.alert("please select more than 3 star"); return false; }
		else { } 
        videocontent = $$("#videocontent").val();
        hashtag = $("#autocomplete-user").val().replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
        hashtag = '<div class="hashtags">' + hashtag + '</div>';

        contentData = videotitle + videocontent + hashtag;
        weblink = $$("#autocomplete-website").val();
        if (contentData, rating) {
            sezzwhoApp.personalFeeds.post_update(contentData, rating, weblink);
            //alert(JSON.stringify(storedData));
        } else {
            alert('Opps, Please give a rating / oh, do not  forget a hashtag');
        }
    },
	 initAutoPostData: function() {

        var contentData,
            videotitle 		= "",
            videocontent 	= "",
            rating 			= "",
            weblink 		= "",
            hashtag 		= "";
			sezzwhoApp.postButton 			= true,
			sezzwhoApp.addLocationButton 	= false,
			sezzwhoApp.addReviewButton 		= false;
		($$("#video-title").val()=="") ? $("#video-title").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        ($("#autocomplete-user").val()=="") ? $("#autocomplete-user").addClass('danger-alert'):$("#autocomplete-user").removeClass('danger-alert');
		videotitle = '<div class="videotitle">' + $$("#video-title").val() + '</div>';
        rating = $$("#rating").val();
		if(rating < 3) {
			myApp.alert("please select more than 3 star!"); return false; }
		else { } 
		hashtag =sezzwhoApp.mainInits.getHashTags( $("#autocomplete-user").val());
		if(hashtag ==""){
		    myApp.alert("please enter hash/at sign before word!");
			return false;
		}else{
		 hashtag = $("#autocomplete-user").val().replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
        hashtag = '<div class="hashtags">' + hashtag + '</div>';
		}
		
		if(($("#video-title").val()=="" ||  hashtag =="" ||  rating < 3 ) || !(sezzwhoApp.isUploading)){
		  
		   sezzwhoApp.autoWhatsNew = false;
    	  
		 }
		 else if(sezzwhoApp.isUploaded)
		 { 
 				 sezzwhoApp.autoWhatsNew = false;
				 sezzwhoApp.personalFeeds.initPostData();
				 $("#auto-aw-whats-new-submit i").addClass("fa-spinner fa-spin  fa-fw").removeClass("fa-pencil");
				 setTimeout(function(){  $("#auto-aw-whats-new-submit i").removeClass("fa-spinner fa-spin  fa-fw").addClass("fa-pencil"); }, 3000);
		
		 }else{
		      sezzwhoApp.autoWhatsNew = true;
			   $("#auto-aw-whats-new-submit i").addClass("fa-spinner fa-spin  fa-fw").removeClass("fa-pencil");
			   setTimeout(function(){  $("#auto-aw-whats-new-submit i").removeClass("fa-spinner fa-spin  fa-fw").addClass("fa-pencil"); }, 3000);
			  if ($$('.popup-record.modal-in').length > 0) { 
	    			myApp.closeModal(".popup-record");
					sezzwhoApp.isStillUploading = true;
						myApp.addNotification({
        					title: 'Uploading...',
        					message: 'Stay tuned, uploading....',
							hold:3000
    						});
					
					return false;
			 	}
			
			
		    
		 }
	 },
	  mentionUser: function() {
        var autocompleteDropdownAjax = myApp.autocomplete({
            //input: '#autocomplete-user',
            input: '#autocomplete-user',
            openIn: 'dropdown',
			expandInput: true,
            preloader: true, //enable preloader,
            backOnSelect: true, //go back after we select something
            valueProperty: 'user_id', //object's "value" property name
            textProperty: 'username', //object's "text" property name
            limit: 20, //limit to 20 results
            source: function(autocomplete, query, render) {
                var results = [];
                if (query.length === 0) {
                    render(results);
                    return;
                }
                // Show Preloader
                autocomplete.showPreloader();
                // Do Ajax request to Autocomplete data
                $$.ajax({
                    url: sezzwhoApp.url + "members",
                    method: 'GET',
                    dataType: 'json',
                    //send "query" to server. Useful in case you generate response dynamically
                    data: {
                        search_terms: query,
                        key: sezzwhoApp.jsonpcb
                    },
                    success: function(data) {
                        // Find matched items
                        //console.log(data);
                        for (var i = 0; i < data.members.length; i++) {
                            //if (data.members[i].username.toLowerCase().indexOf(query.toLowerCase()) >= 0) 
                            results.push(data.members[i].username);
                        }
                        // Hide Preoloader
                        autocomplete.hidePreloader();
                        // Render items by passing array with result items
                        render(results);
                    }
                });
            }/*,
            onChange: function(autocomplete, value) {
                // Add item text value to item-after
                $$('#autocomplete-user').find('.item-after').text("@" + value[0]);
                // Add item value to input value
                $$('#autocomplete-user').find('input').val("@" + value[0]);
                $("#refer-user").prop('disabled', false);
            }*/
        });
        //end function
    },
    bindEvent: function() {
        var bindings = [{
            element: '#aw-whats-new-submit',
            event: 'click',
            handler: this.initPostData
        },{
			element: '#auto-aw-whats-new-submit',
            event: 'click',
            handler: this.initAutoPostData
        }
		];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }


}; //End Function
sezzwhoApp.personalFeeds = feeds;;/**
 *            HOME JS    
 *            Get Following Feed 
 *            
 */
var homeModule = {
    init: function(query) {


        mainView.showToolbar();
        this.getActivities(query);
       this.refreshContentFollowing();
        sezzwhoApp.homeModules.blindEvent();
    },
    getActivities: function(query) {

        var option = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': sezzwhoApp.userloginInfo.user.id,
            'cookie': sezzwhoApp.cookie,
            'following': true,
            'type': "activity_update,Member_review",
            'comments': true

        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "activities");


        //End Function
    },
    loadmoreContent: function() {


        // Loading flag
        var loading = false;

        // Last loaded index

        // Max items to load
        var maxItems = sezzwhoApp.activityData.has_more_items;

        // Append items per load
        var itemsPerLoad = 10;
        var page = 2;
        //console.log("step1");

        // Attach 'infinite' event handler
        var el = $$('.infinite-scroll-following').on('infinite', function() {
          //  console.log("step2");
            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;

            // Emulate 1s loading
            setTimeout(function() {
                // Reset loading flag
                loading = false;
                maxItems = sezzwhoApp.activityData.has_more_items;
                if (maxItems == false) {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll-following'));
                   // console.log("step3");
                    // Remove preloader
                    $$('.infinite-scroll-preloader-following').remove();
                    return;
                }
               // console.log("step4");
                // Generate new items HTML
                var html = '';

                var option = {
                    'key': sezzwhoApp.jsonpcb,
                    'user_id': sezzwhoApp.userloginInfo.user.id,
                    'cookie': sezzwhoApp.cookie,
                    'following': true,
                    'page': page,
                    'per_page': itemsPerLoad,
                    'type': "activity_update,Member_review"

                };
                sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "loadmoreActivity");


                //console.log(sezzwhoApp.activityData.has_more_items);
                // Append new items
                //$$('.load-result').append(html);
                //console.log(page);
                // Update last loaded index 
                if (sezzwhoApp.activityData.has_more_items == true) {
                    page += 1;
                    maxItems = true;
                } else {
                    maxItems = false;
                }



            }, 1000);
        });


        //console.log(el);


        //End Function
    },
    refreshActivities: function() {
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': sezzwhoApp.userloginInfo.user.id,
            'cookie': sezzwhoApp.cookie,
            'type': "activity_update,Member_review",
            'comments': true,
			'self_following':true,
            'time': sezzwhoApp.refreshTime

        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.refreshed, options, "refreshActivity");

    },
    refreshContentFollowing: function() {


        // Pull to refresh content
        var ptrContent = $$('.pull-to-refresh-content');

        // Add 'refresh' listener on it
        ptrContent.on('ptr:refresh', function(e) {
            // Emulate 2s loading
            //$('.load-result').html("");
            setTimeout(function() {

                var query;
                sezzwhoApp.homeModules.refreshActivities();
                // When loading done, we need to reset it
				
                 
				 sezzwhoApp.notifications.notifications_unread_count();
				 sezzwhoApp.notifications.getNotification();
                
				myApp.pullToRefreshDone();
            }, 2000);
        });



    },
    refreshTimelineByClick: function() {
        $$('#homeView .refresh-click').find('i').addClass('fa-spin');
        setTimeout(function() {
            $$('#homeView .refresh-click').find('i').removeClass('fa-spin');
        }, 1500);

        $$('#homeView .pull-to-refresh-content').scrollTop(0, 300);

        sezzwhoApp.pullToRefreshTrigger('#homeView .pull-to-refresh-content');
    },
    startStopFollowing: function() {
        var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.add_follow_button;
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': $(this).attr('data-type'),
            'cookie': sezzwhoApp.cookie,

        };
        var that = this;
        console.log($(this).attr('data-type'));
        if ($(this).find('span').attr('class') === 'startfollow active-state' || $(this).find('span').attr('class') === 'startfollow') {

           $(this).find('span i').attr('class','fa fa-spinner fa-spin');

            $.get(ajaxUrl, options, function(res) {
                if (res.response == true) {
                    $(that).find('span').html('<i class="fa fa-user-times"></i> Following');
                    $(that).find('span').addClass('stopfollow').removeClass('startfollow');
                    myApp.addNotification({
						hold:5000,
                        title: 'Follow',
                        message: 'You are following',
                        media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
                    });
                }

            });


        } else {
            $(this).find('span i').attr('class','fa fa-spinner fa-spin');
            options.delete = true;
            $.get(ajaxUrl, options, function(res) {
                if (res.response == false) {
                    $(that).find('span').html('<i class="fa fa-user-plus"></i> follow');
                    $(that).find('span').addClass('startfollow').removeClass('stopfollow');
                    myApp.addNotification({
						hold:5000,
                        title: 'Following',
                        message: 'You are un following',
                        media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
                    });

                }

            });
        }
    },
    responseFollowerFollowing: function() {

    },
    blindEvent: function() {
        var bindings = [{
            element: '.follow-button',
            event: 'click',
            handler: this.startStopFollowing
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);

    }



};


sezzwhoApp.homeModules = homeModule;;
var type= "";
var text_id_status= "";

// Called when capture operation is finished
    //
    function captureSuccess(mediaFiles) {
		
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
        }
    }

    // Called if something bad happens.
    //
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }

    // A button will call this function
    //
    function captureVideo() {
        // Launch device video recording application,
        // allowing user to capture up to 2 video clips
		
		var options = { limit: 1, 
			duration: 30,
			quality : 0
        };
        navigator.device.capture.captureVideo(captureSuccess, captureError, options); 
    }

    // Upload files to server
    function uploadFile(mediaFile) {
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
         progressBar(ft);		// call progress bar 
		
		
		var options      = new FileUploadOptions();
       	options.fileName = name;
   		options.mimeType = 'video/mp4';
		//videoCaptureSuccess(mediaFile);
		/*
		ZiggeoSdk = require("build/ziggeo/index.js")
	              	ZiggeoSdk.init('ddd4366d3fc0baef95c333fa575c53f9', '31a91c9483069a25e8abcd4d46dc8e47', '1bbe8f5b02d9e623889ca4635af76443'); console.log(ZiggeoSdk); 
				  	ZiggeoSdk.Videos.create({
					file: mediaFile.name
					});
			
      */
	   ft.upload(path,
            sezzwhoApp.uploadPath,
            function(result) {
				 sezzwhoApp.progressID.html("Completed");
                console.log('Upload success: ' + result.responseCode);
                var obj= JSON.parse(result.response);
		
				video_code = '<ziggeo ziggeo-width="320" ziggeo-height="240" ziggeo-responsive="true" ziggeo-video="' + obj.ziggeo["token"] + '"></ziggeo>';	
				var el ={};
		 
				el[0] = $$("#videocontent");
		     	if(sezzwhoApp.recordingType === "whats-new"){
				el[1] =  $("#aw-whats-new-submit,#add-business,#post-business");
				el[1].prop("disabled",false);
				}else if(sezzwhoApp.recordingType === "comments"){
				el[1] = $$("#post-comment");
				el[1].prop("disabled",false);
				}else if(sezzwhoApp.recordingType === "whats-record"){
				 var src = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" + obj.ziggeo["token"] + "/video.mp4";
				 var img = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" +	obj.ziggeo["token"]	+ "/image";
					$("#re-change-image").attr('poster', img);
					$("#re-change-video").attr('src', src);
				}
				
				el[2] = $$("#videobusiness")
				el[0].val(video_code);
				el[2].val(obj.ziggeo["token"]);
				
		    
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            options);
    }

/************************* Progress Function ***********************/


function progressBar(ft){
	var container;
	if(sezzwhoApp.recordingType === "whats-new")
	 sezzwhoApp.progressID = $$('.demo-progressbar-load-hide p:first-child');
    else if(sezzwhoApp.recordingType === "comments")
	sezzwhoApp.progressID = $$('.comment-progressbar-load-hide p:first-child');
	else if (sezzwhoApp.recordingType == "whats-record")
	sezzwhoApp.progressID = $$('.record-progressbar-load-hide p:first-child');
     	
ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			
			myApp.showProgressbar(sezzwhoApp.progressID,perc);
			if(perc == 99){
				myApp.showProgressbar(sezzwhoApp.progressID,100);
				
			}
		} else {
			sezzwhoApp.progressID.html("Completed");
		}
	};

}
function getPhoto(source) {
	
	
navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    destinationType: destinationType.FILE_URI,
    mediaType: Camera.MediaType.VIDEO,
    sourceType: source
});
}

function onPhotoURISuccess(imageURI) {
    console.log(imageURI);
}

function onFail(message) {
    console.log(message);
}

function videoCaptureSuccess(mediaFiles) {
    // Wrap this below in a ~100 ms timeout on Android if 
    // you just recorded the video using the capture plugin. 
    // For some reason it is not available immediately in the file system. 
 
    var file = mediaFiles[0];
    var videoFileName = 'video-name-here'; // I suggest a uuid 
 
    VideoEditor.transcodeVideo(
        videoTranscodeSuccess,
        videoTranscodeError,
        {
            fileUri: mediaFiles.fullPath,
            outputFileName: videoFileName,
            outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
            optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
            saveToLibrary: true,
            maintainAspectRatio: true,
            width: 640,
            height: 640,
            videoBitrate: 1000000, // 1 megabit 
            audioChannels: 2,
            audioSampleRate: 44100,
            audioBitrate: 128000, // 128 kilobits 
            progress: function(info) {
                console.log('transcodeVideo progress callback, info: ' + info);
            }
        }
    );
}
function videoTranscodeSuccess(result) {
    // result is the path to the transcoded video on the device 
    console.log('videoTranscodeSuccess, result: ' + result);
}
 
function videoTranscodeError(err) {
    console.log('videoTranscodeError, err: ' + err);
}

function star_rating(){

var jq = jQuery;

        // Make the Read More on the already-rated box have a unique class
        var arm = jq('.already-rated .activity-read-more');
        jq(arm).removeClass('activity-read-more').addClass('already-rated-read-more');

        jq('.star').mouseover( function() {
            var num = jq(this).attr('id').substr( 4, jq(this).attr('id').length );
            for ( var i=1; i<=num; i++ )
                jq('#star' + i ).attr( 'src', "images/star.png" );
        });

        jq('div#review-rating').mouseout( function() {
            for ( var i=1; i<=5; i++ )
                jq('#star' + i ).attr( 'src', "images/star_off.png" );
        });

        jq('.star').click( function() {
            var num = jq(this).attr('id').substr( 4, jq(this).attr('id').length );
            for ( var i=1; i<=5; i++ )
                jq('#star' + i ).attr( 'src', "images/star_off.png" );
            for ( var i=1; i<=num; i++ )
                jq('#star' + i ).attr( 'src', "images/star.png" );

            jq('.star').unbind( 'mouseover' );
            jq('div#review-rating').unbind( 'mouseout' );

            jq('input#rating').attr( 'value', num );
        });

        

        jq('#submit').click(function(){
            if(jq('input#rating').val() == 0){
                alert('Please Rate for This page/post !!!');
                return false;
            }
        });
		
		

};// Let's register Template7 helper so we can pass json string in links change
Template7.registerHelper('json_stringify', function(context) {
    return JSON.stringify(context);
});


var allComments;
var comments = {

    init: function(query) {
        setTimeout(function() {
            sezzwhoApp.comments.bindEvent();
			sezzwhoApp.commonFunc.blindEvent();
        }, 1500);
        //this.getComments(query);
        console.log(query);
        sezzwhoApp.comments.singlePage = true;
        this.getJsonComments(query);
        $$("#comment-id").val(query.id);
        sezzwhoApp.commentsType = [{
            id: query.id,
            type: query.name,
            page: query.page,
			user_id: query.user_id
        }];

    },
    getJsonComments: function(Params) {

        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'type': "activity_comment",
            'sort': 'DESC',
            'primary_id': Params.id,
            'secondary_id': Params.id,
            'comments': false

        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "comments");


    },
    displayJsonComments: function(response, bool) {
        var items = [],
            item = [],
            count;
        var el = $('.loadComments');
        sezzwhoApp.commentsData = response;
        if (response.status !== "error") {
            for (var i = 0; i < response.activities.length; i++) {
                   var string = response.activities[i].content,
    				substring = "<ziggeo",
					text_comment= false,
					text_content="",
					title="";
				(string.indexOf(substring) !== -1)? text_comment = false: text_comment = true;
				
				if(text_comment){
					//console.log(response.activities[i].content);
				 text_content= response.activities[i].content;
				text_content= text_content.replace(/\\/g, '');
				var just_text_content = text_content;
				text_content = sezzwhoApp.mainInits.matchUrl(text_content);

				//console.log(text_content);
	
				}
                text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
                title = text.title;
				title = title.replace(/\\/g, '');
			    item[i] = {
                    nickname: response.activities[i].user[0].username,
                    avatar: sezzwhoApp.mainInits.addhttp(response.activities[i].user[0].avatar),
                    user_id: response.activities[i].user[0].user_id,
                    time: response.activities[i].time_since,
                    title: title,
					text_comment: text_comment,
					text_content:  text_content,
					text_share_content:just_text_content,
                    hashtag: text.hashtag,
                    ziggeocode: text.ziggeoCode,
                    commentLenght: (typeof(response.activities[i].children) != "undefined") ? response.activities[i].children : 0,
                    id: response.activities[i].activity_id,
                    action: response.activities[i].action,
                    likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
                    like_button: response.activities[i].likes_button,
					account_type: response.activities[i].user[0].account_type,
					share_count: response.activities[i].share_count
                };

            } // End for loop
            items.push({
                "item": item
            });
            console.log(i);
            var output = sezzwhoApp.mainInits.renderTpl(commentTemplate, items[0]);
            if(sezzwhoApp.post_comment){
			 el.prepend(output);
			 sezzwhoApp.post_comment= false;
			 setTimeout(function(){ sezzwhoApp.comments.bindEvent(); },1500);
			}
			else{
            el.append(output);
			 setTimeout(function(){ sezzwhoApp.comments.bindEvent(); },1500);
			}
		    if($(".loadComments .none-comment").length ==1) $(".loadComments .none-comment").remove();
			if(response.activities.length == 1){
		 		myApp.detachInfiniteScroll($$('.infinite-scroll-comment'));
                   // Remove preloader
                $$('.infinite-scroll-preloader-comment-page').remove();	 
		 }


        }else if( bool === true){
		 $$('.infinite-scroll-preloader-comment-page').remove();
		}else {
            $$('.infinite-scroll-preloader-comment-page').remove();
            var html = '<div class="none-comment"><i class="fa fa-comments-o fa-5x"></i><p>No one comments</p></div>';
            el.html(html);
        }
        sezzwhoApp.hideIndicator();


    },
    loadmoreContent: function() {



        // Loading flag
        var loading = false;

        // Last loaded index

        // Max items to load
        var maxItems = sezzwhoApp.commentsData.has_more_items;

        // Append items per load
        var itemsPerLoad = 2;
        var page = 2;


        // Attach 'infinite' event handler
        var el = $$('.infinite-scroll').on('infinite', function() {

            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;

            // Emulate 1s loading
            setTimeout(function() {
                // Reset loading flag
                loading = false;
                maxItems = sezzwhoApp.commentsData.has_more_items;
                if (maxItems == false) {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll-comment'));

                    // Remove preloader
                    $$('.infinite-scroll-preloader-comment-page').remove();
                    return;
                }

                // Generate new items HTML
                var html = '';

                var option = {
                    'key': sezzwhoApp.jsonpcb,
                    'cookie': sezzwhoApp.cookie,
                    'type': "activity_comment",
                    'sort': 'DESC',
                    'primary_id': sezzwhoApp.commentsType[0].id,
                    'secondary_id': sezzwhoApp.commentsType[0].id,
                    'page': page,
                    'per_page': itemsPerLoad,
                    'comments': false

                };
				sezzwhoApp.post_comment= false;
                sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "loadmoreComment");


                console.log(sezzwhoApp.commentsData.has_more_items);
                // Append new items
                //$$('.load-result').append(html);
                console.log(page);
                // Update last loaded index 
                if (sezzwhoApp.commentsData.has_more_items == true) {
                    page += 1;
                    maxItems = true;
                } else {
                    maxItems = false;
                }



            }, 1000);
        });




        //End Function
    },
    getComments: function(query) {
        var results = [],
            text, i;
        i = parseInt((query.page - 1) + query.index);
        var el = $('.loadComments');

        switch (query.name) {
            case "following":
                if (query.comment === "true") {
                    results.push(sezzwhoApp.activityData.activities[i]);
                    //this.displayComment(results,el);
                } else {
                    text = "No Comment Yet";
                    el.html(text);
                    myApp.hideIndicator();
                }
                break;
            case "detailpage":

                if (query.comment === "true") {
                    results.push(sezzwhoApp.activityFeedUserDetail.activities[i]);
                    //this.displayComment(results,el);
                } else {
                    text = "No Comment Yet";
                    el.html(text);
                    sezzwhoApp.hideIndicator();

                }
                break;
            case "personal":
                console.log(query.name);
                if (query.comment === "true") {
                    results.push(sezzwhoApp.activityFeedData.activities[i]);
                    //this.displayComment(results,el);
                } else {
                    text = "No Comment Yet";
                    el.html(text);
                    sezzwhoApp.hideIndicator();
                }

                break;
            default:
                console.log("error");
                break;
        } //End switch statement  



        //End function
    },
    displayComment: function(results, el) {
        var items = [],
            item = [],
            count;
        results = results[0].comments;

        for (var i = 0; i < results.length; i++) {
           
            text = sezzwhoApp.mainInits.getsezzwhoContents(results[i].content);
			
            item[i] = {
                nickname: results[i].display_name,
                avatar: results[i].avatar,
                user_id: results[i].user_id,
                time: results[i].time_since,
                title: text.title,
                hashtag: text.hashtag,
                ziggeocode: text.ziggeoCode,
                //commentLenght	: (typeof(results[i].children) != "undefined")? results[i].children : 0,
                id: results[i].activity_id,
                action: results[i].action
            };

        } // End for loop
        items.push({
            "item": item
        });

        var output = sezzwhoApp.mainInits.renderTpl(commentTemplate, items[0]);

        el.html(output);

        sezzwhoApp.hideIndicator();
	
         

        // Ene Function
    },
    closePicker: function() {
        $$(".comment-progressbar-load-hide").html('<p style="height:2px"></p>');
        $$(".record-input").val("");
        $$("#review-rating img").attr('src', 'images/star_off.png');
        $$("#post-comment").attr("disabled", "disabled");
        myApp.closeModal(".picker-1");
    },
    initPost: function() {

        var contentData,
            videotitle = "",
            videocontent = "",
            rating = "",
            hashtag = "";
        /* videotitle 	= '<div class="videotitle">' +$$("#video-title").val()+ '</div>';
        rating 		= $$("#rating").val(); */
        videocontent = $$("#videocontent").val();
        /* hashtag = $("#autocomplete-user").val().replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
					hashtag = '<div class="hashtags">'+ hashtag + '</div>';
*/
        contentData = videocontent;

        if (contentData) {
            sezzwhoApp.comments.post_comment(contentData);
                  sezzwhoApp.showPreloader("Submitting...");

        		setTimeout(function(){
           			 sezzwhoApp.hidePreloader();
            		sezzwhoApp.closeModal('.picker-1');
             
            			//Refresh comment content
       				 },1500);
			
        } else {
            alert('please re-record the video!');
        }

        //End Function	
    },
    post_comment: function(videoContent) {
        var option = {
            'content': videoContent,
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'activity_id': parseInt(sezzwhoApp.commentsType[0].id),
			'receiver_id': parseInt(sezzwhoApp.commentsType[0].user_id)
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_new_comment, option, "postComment");


    },
    doneComments: function(response) {

         sezzwhoApp.post_comment =true;
        var el = ".activity-" + sezzwhoApp.commentsType[0].id;
        el = $$(el);
        var count = parseInt(el.find(".comment-count-hidden").val());
		var hidden_count = count + 1;
        count = sezzwhoApp.mainInits.countFormat(count + 1);
        if (response.status === "ok") {
            el.find(".comment").text(count.toString());

             el.find(".comment-count-hidden").val(hidden_count) ; 

            var option = {
                'key': sezzwhoApp.jsonpcb,
                'cookie': sezzwhoApp.cookie,
                'type': "activity_comment",
                'sort': 'DESC',
                'primary_id': sezzwhoApp.commentsType[0].id,
                'secondary_id': sezzwhoApp.commentsType[0].id,
                'limit': 1,
                'include': response.comment_id,
                'comments': false
            };
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "comments");

            sezzwhoApp.comments.closePicker();

        }
        console.log(response);

        //End function	
    },
    initRecording: function() {
        sezzwhoApp.personalFeeds.recordVideo('comments');
    },
    deleteComment: function() {
        var aID = $(this).attr('data-id');
        var id = $(this).attr('data-userid');
        if (id == sezzwhoApp.userloginInfo.user.id) {
            var options = {
                'key': sezzwhoApp.jsonpcb,
                'cookie': sezzwhoApp.cookie,
                'activity_id': aID
            };
            sezzwhoApp.deleteActivity = aID;
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_delete_activity, options, "comment_edit_delete_activity");
			var el = ".activity-" + sezzwhoApp.commentsType[0].id;
			el = $$(el);
			var count = parseInt(el.find(".comment-count-hidden").val());
			count = count - 1;
			var text_count =sezzwhoApp.mainInits.countFormat(count);
			if(count < 0)
			count = 0;
			el.find(".comment").text(text_count.toString());
			el.find(".comment-count-hidden").val(count) ; 
        } else {
            myApp.addNotification({
                title: 'Un-authorized',
                subtitle: '',
                message: 'Sorry, you are not authorized to delete this video or comment',
                media: '<i class="fa fa-info-circle"></i>'
            });
        }

    },
    displayEditDeleteMessage: function(response) {
        var el = "#comment-" + sezzwhoApp.deleteActivity;
        if (response.status === "ok") {
            $$(el).remove();
            sezzwhoApp.personalFeeds.getFeedActivities(); // Update personal feed 	
        }
    },
    dittoComment: function() {

        var el = "",
            id = "",
            option = {},
            url = "";

        el = $$(this);
        id = el.attr('data-id');
        options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'activity_id': id

        };
        //alert(id);
        url = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.sz_add_user_ditte;
        id = "#comment-" + id;

        $.post(url, options, function(data) {

            if (data.text === 'Ditto') {
                el.find('span').text(data.text);
                console.log(id);
                (typeof(data.response) === 'undefined') ? $(id).find('.likes').text('0'): $(id).find('.likes').text(data.response);

                el.find('.fa').addClass('fa-thumbs-o-up').removeClass('fa-thumbs-o-down');
            } else {
                el.find('span').text(data.text);
                (typeof(data.response) === 'undefined') ? $(id).find('.likes').text('0'): $(id).find('.likes').text(data.response);
                el.find('.fa').addClass('fa-thumbs-o-down').removeClass('fa-thumbs-o-up');
            }
            console.log(data);
        });

    },closeCommentbox: function(){
         sezzwhoApp.comments.closePicker();
    },
	textWidget: function(){
		 myApp.popup('.comment-popup');
	 
	 	$('#post-comment-text').attr('disabled',true);
    	$('#comment-textarea').keyup(function(){
        if($(this).val().length !=0)
            $('#post-comment-text').attr('disabled', false); 
			         
        else
            $('#post-comment-text').attr('disabled',true);
			
    	});
		
	},
	post_text_comment: function(){
		var text = $('#comment-textarea').val();

        if(sezzwhoApp.mainInits.getCharLength(text) < 4){
            sezzwhoApp.alert("Ah, Content is too short");
            return false;
        }else{
		sezzwhoApp.comments.post_comment($("#comment-textarea").val());
		}

        sezzwhoApp.showPreloader("Submitting...");

        setTimeout(function(){
            sezzwhoApp.hidePreloader();
            sezzwhoApp.closeModal('.comment-popup');
             
            //Refresh comment content
        },1500);
	 	
	},
    bindEvent: function() {
        var bindings = [{
            element: '#post-comment',
            event: 'click',
            handler: this.initPost
        }, {
            element: '.record-comment',
            event: 'click',
            handler: this.initRecording
        }, {
            element: '.comment-delete',
            event: 'click',
            handler: this.deleteComment
        }, {
            element: '.comment-ditto',
            event: 'click',
            handler: this.dittoComment
        },{
           element:'.picker-1 .close-picker',
            event: 'click',
            handler:this.closeCommentbox
        },{
		element:"#post-comment-text",
		event: 'click',
		handler: this.post_text_comment
		}];
        sezzwhoApp.mainInits.bindEvents(bindings);

    }


};
sezzwhoApp.comments = comments;;var notification = {
    init: function() {

        this.notifications_unread_count();
        //End Function
        this.getNotification();

    },
    notifications_unread_count: function() {
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie


        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_unread_count, option, "unreadCount");
        //end function
    },
    displayCount: function(response) {
        if (response.count > 0){
            $('i.fa.fa-flag .badge').text(response.count);
		}else{
			$('i.fa.fa-flag .badge').text("0");
			var html = '<div class="none-comment"><i class="fa fa-exclamation-triangle fa-5x"></i><p>No New Notifications</p></div>';
            $(".notification-template").html(html);
		}
		//end function
    },
    getNotification: function() {
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
			'component':sezzwhoApp.notificationsOptions,
            'is_new': true

        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications, option, "notification");
    },
    displayNotifications: function(response) {
        var items = [],
            item = [],
            count,
            i = 0;
        console.log(response);
        if (typeof(response.notifications) !== "undefined") {
            while (i < response.notifications.length) {

                item[i] = {
                    nickname: response.notifications[i].sender_name,
                    avatar: response.notifications[i].sender_avatar,
                    time: response.notifications[i].time_since,
                    content: response.notifications[i].content,
                    href: response.notifications[i].href,
                    componentname: response.notifications[i].component_name,
					account_type: response.notifications[i].account_type,
                    refername: response.notifications[i].sender_name,
                    itemid: response.notifications[i].item_id,
                    senderid: (response.notifications[i].component_name === "follow") ? response.notifications[i].item_id : response.notifications[i].secondary_item_id,
                    userid: response.notifications[i].user_id,
                    notificationId: response.notifications[i].id,
					video_refer_name:response.notifications[i].video_refer_name

                };

                i++;
            }
            items.push({
                "item": item
            });
            var output = sezzwhoApp.mainInits.renderTpl(notificationTemplate, items[0]);
            $('.notification-template').html(output);
        } else {

        }

        setTimeout(function() {
            sezzwhoApp.notifications.blindEvent();
        }, 1000);
    },
    notifications_delete: function() {
        var id = $(this).attr('data-id');
        sezzwhoApp.nDel = id;
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'notification_id': id
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_single_mark, option, "notifications_delete");

    },
    notifications_delete_message: function(response) {
        var el = "#notification-" + sezzwhoApp.nDel;

        if (response.status === "ok") {
             sezzwhoApp.notifications.notifications_unread_count();
            $(el).remove();
        } else {

            myApp.addNotification({
                title: 'Invaild',
                subtitle: '',
                message: response.error,
                media: '<i class="fa fa-info-circle"></i>'
            });
        }


    },
	notifications_single_mark: function(id){
	 // var id = $(this).attr('data-id');
        sezzwhoApp.nMark = id;
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'notification_id': id
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_single_mark, option, "notifications_mark");
	
	},
	notifications_mark_message: function(response) {
        var el = "#notification-" + sezzwhoApp.nMark;

        if (response.status === "ok") {
             sezzwhoApp.notifications.notifications_unread_count();
            $(el).remove();
        } else {

            myApp.addNotification({
                title: 'Invaild',
                subtitle: '',
                message: response.error,
                media: '<i class="fa fa-info-circle"></i>'
            });
        }


    },
    refresh_notification: function(){
		
	}
	,blindEvent: function() {
        var bindings = [{
            element: '.notification-delete',
            event: 'click',
            handler: this.notifications_delete
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);

    },
    registerDeviceAndroid: function() {
     pushNotification = new PushNotification();
        if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    "senderID": "811636483141",
                    "ecb": "onNotification"
                });
        } else if (device.platform == 'blackberry10') {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    invokeTargetId: "replace_with_invoke_target_id",
                    appId: "replace_with_app_id",
                    ppgUrl: "replace_with_ppg_url", //remove for BES pushes
                    ecb: "pushNotificationHandler",
                    simChangeCallback: replace_with_simChange_callback,
                    pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                    launchApplicationOnPush: true
                });
        } else {
            pushNotification.register(
                tokenHandler,
                errorHandler, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onNotificationAPN"
                });
        }

        function successHandler(result) {
            console.log('result = ' + result);
        }

        function errorHandler(error) {
            console.log('error = ' + error);
        }

        function tokenHandler(result) {
            // Your iOS push server needs to know the token before it can push to this device
            // here is where you might want to send it the token for later use.
            console.log('device token = ' + result);
        }


    }, // End Android Notifications 
    registerDeviceIOS: function() {
        push = PushNotification.init({
            android: {
                senderID: "982786196868"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function(data) {
            //alert(data.registrationId);
            console.log(data.registrationId);
            sezzwhoApp.notifications.deviceRegister(data.registrationId, "ios_notification");
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            //alert(data.message);
			sezzwhoApp.notifications.getNotification();
        });

        push.on('error', function(e) {
            // e.message
        });

    },
    unregisterDeviceIos: function() {

        push.unregister(successHandler, errorHandler);


        function successHandler(e) {
            console.log(e);
        }

        function errorHandler(e) {
            console.log(e);
        }
    },
    unregisterDeviceAndroid: function() {
        pushNotification.unregister(successHandler, errorHandler);

        function successHandler(e) {
            console.log(e);
        }

        function errorHandler(e) {
            console.log(e);
        }
    },
    deviceRegister: function(id, type) {
        var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.save_device_id;
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'regID': id,
            'type': type
        };
        $.get(ajaxUrl, options, function(data) {
            console.log("ID register request performed");
        });
    },
	uploadVideoNotification: function(){
	   sezzwhoApp.uploadToken;
	 
	 /*  FCMPlugin.getToken(function(token){
    			 sezzwhoApp.uploadToken=token;
				});           */
	       
		   window.plugins.OneSignal.getIds(function(ids) {
				  var notificationObj = { contents: {en: "Your video is ready to view. You can now watch it."},
										  include_player_ids: [ids.userId]};
				  window.plugins.OneSignal.postNotification(notificationObj,
					function(successResponse) {
					  console.log("Notification Post Success:", successResponse);
					},
					function (failedResponse) {
					  console.log("Notification Post Failed: ", failedResponse);
					  alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
					}
				  );
				});
		   
		}
};

function onNotificationAPN(event) {
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

function onNotification(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                //$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
                sezzwhoApp.notifications.deviceRegister(e.regid, "android_notification");

            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                //$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/" + soundfile);
                my_media.play();
				sezzwhoApp.notifications.getNotification();
            } else { // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
					sezzwhoApp.notifications.getNotification();
                } else {
                    //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                sezzwhoApp.notifications.getNotification();
				}
            }

            //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            //$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
            //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}
sezzwhoApp.notifications = notification;;var loadmore=false;
var detailpage = {
  
	init: function(query){
	  sezzwhoApp.showIndicator();
	  this.blindEvent();
	  this.userProfileHeader(query.id);
	  sezzwhoApp.homeModules.blindEvent();
	  sezzwhoApp.userDetail= query.username;
	  sezzwhoApp.userIDetail = query.id;
	  if(query.accountType === 'Personal'){
		   $('.business-recording, #tab-detial').hide(); 
		   
	 }
	  else{
		$('.business-recording, #auto-post-business, #tab-detial').show();
		$('#auto-aw-whats-new-submit, #auto-add-business').hide();
	  }
	  sezzwhoApp.reviewpages.init();
  },
  userProfileHeader: function(userid){
			  var 	items,
			  		bio,
			  		output;
		//console.log(event);
	  	//if(event=="tab-link userprofile active-state"){
		
		  var option = {
						  'key'         : sezzwhoApp.jsonpcb,
						  'user_id'     : userid,
						  'cookie'      : sezzwhoApp.cookie,
						  'field'       : 'Bio,Website,Address'
					   };
		 sezzwhoApp.leaderid = userid;
		
		         var p = new Promise(function(resolve, reject) { resolve(sezzwhoApp.commonFunc.followingFollower(userid)); console.log("first") });
					p.then(function(){
					sezzwhoApp.commonFunc.activitiesCount(userid);
					console.log("2nd");
					}).then(function(){
						sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.xprofile,option,"detialpageheader");
							console.log("3rd");
					});
		  this.getFeedActivities(userid);
	  //	}
		  
	  
	  },
	     getPersonalFeed: function(response){
			 var elHeader= '.user-profile-header-detail-' + sezzwhoApp.userIDetail;
			 console.log(elHeader);
			 var  bio = response.Bio;
			 var  website= response.Website;
			 var address = response.Address;
			 var follow;
			 (sezzwhoApp.userloginInfo.user.id == sezzwhoApp.userIDetail) ? follow =true : follow= false;
			 item = {
                   'avatar' 	: sezzwhoApp.mainInits.addhttp(response.avatar),
                   'bio'   		: bio,
				   'id'			: sezzwhoApp.leaderid,
                   'username'	: sezzwhoApp.userDetail,
				   'follower' 	: response.followers,
				   'following'	: response.following,
				   'post_count' : response.activityCount,
				   'is_follow'  : response.is_follow,
				   'address'	: address,
				   'website': sezzwhoApp.mainInits.addhttp(website),
				   'follow'		: follow
            };
			 output = sezzwhoApp.mainInits.renderTpl(userHeaderTemplate,item);
          
			 $(elHeader).html(output);
		   
			 //End Fucntion 
		 },
		getFeedActivities: function(userid){
    
     var option = {
              'key'         : sezzwhoApp.jsonpcb,
              'user_id'     : userid,
              'cookie'      : sezzwhoApp.cookie,
			  'type' 		:"activity_update,Member_review",
		   	  'comments'	:true,
  			  'scope'		:"just-me,mentions"

                
            };
       sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.following,option,"detialpagelist");
   
       
      	
    	setTimeout(function(){	sezzwhoApp.homeModules.blindEvent(); },1000);  //follow up button
        
        
             //End Function
    },
	 activitiesFeed : function(response){
         var items=[],item=[];
		 var elLoader='.infinite-scroll-preloader-detail-page-' +  sezzwhoApp.userIDetail;
		 var elContent='.presonal-content-detail-' +  sezzwhoApp.userIDetail;
		 var elScroll = '.infinite-scroll-detail-' + sezzwhoApp.userIDetail;
		 var html = '<div class="none-comment"><i class="fa fa-newspaper-o  fa-5x"></i><p>No Activities</p></div>';
             if(response.status !== "error" || response.error !=="No Activities found.") { 
             for(var i=0; i<response.activities.length;i++){
             text=sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
            
                sezzwhoApp.activityFeedUserDetail = response;
            // console.log(text);
             item[i]={
                    nickname    : response.activities[i].user[0].username,
                    avatar      : sezzwhoApp.mainInits.addhttp(response.activities[i].user[0].avatar),
                    time        : response.activities[i].time_since,
					user_id: response.activities[i].user[0].user_id,
                    title       : text.title,
                    hashtag     : text.hashtag,
                    ziggeocode  : text.ziggeoCode,
                    type        : ((response.activities[i].type =="Member_review"||response.activities[i].type =="activity_update")?true:false),
					commentLenght	: (typeof(response.activities[i].comments) != "undefined")? response.activities[i].comments.length : 0,
					comments 		: (typeof(response.activities[i].comments) != "undefined")? true : false,
					page 			: response.page,
					id				: response.activities[i].activity_id,
					action			: response.activities[i].action,
				    name			: "detailpage",
					likes_count     : (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
					like_button 	: response.activities[i].likes_button,
					refer_count    	: response.activities[i].refer_count,
					share_count 	: response.activities[i].share_count,
					is_follow : response.activities[i].followCheck,
					account_type: response.activities[i].user[0].account_type

                };
               
             } // End for loop
             items.push({"item":item});  
             //console.log(JSON.stringify(items));
             
        		var output = sezzwhoApp.mainInits.renderTpl(activityTemplate,items[0]);
			  	$(elContent).append(output); 
                sezzwhoApp.hideIndicator();
				sezzwhoApp.commonFunc.init();  // Blind share event button ;   
			 }else
			 {
				sezzwhoApp.hideIndicator();
				 myApp.detachInfiniteScroll($$(elScroll));
			   $(elContent).html(html);
			   $$(elLoader).remove();
			 }

        //End Function
    }
	,
     loadmoreFeedContent: function(){
            var elLoader='.infinite-scroll-preloader-detail-page-' +  sezzwhoApp.userIDetail;
			 var elScroll = '.infinite-scroll-detail-' + sezzwhoApp.userIDetail;

			// console.log(elScroll);
			// Loading flag
			var loading = false;
			// Last loaded index
			// Max items to load
			var maxItems = sezzwhoApp.activityFeedUserDetail.has_more_items;
			// Append items per load
			var itemsPerLoad = 10;
			var page =2;
			loadmore = true;		  
			// Attach 'infinite' event handler
			$$(elScroll).on('infinite', function () {
			console.log("step2");
			// Exit, if loading in progress
			if (loading) return;
			// Set loading flag
			loading = true;
			// Emulate 1s loading
			setTimeout(function () {
				// Reset loading flag
				loading = false;
				 maxItems = sezzwhoApp.activityFeedUserDetail.has_more_items;
				if (maxItems == false) {
					console.log("step3");
				  	// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
				  	myApp.detachInfiniteScroll($$(elScroll));
				  	// Remove preloader
				  	$$(elLoader).remove();
				  	return;
			}
			console.log("eer");
			// Generate new items HTML
			var html = '';

			   var option = {
					  'key'         : 	sezzwhoApp.jsonpcb,
					  'user_id'     : 	sezzwhoApp.userIDetail,
					  'cookie'      : 	sezzwhoApp.cookie,
				   	  'type' 		:	"activity_update,Member_review",
					  'page'        :	page,
					  'per_page'    :	itemsPerLoad,
				   	  'comments'	:	true

					};
				 sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.following,option,"loadmoreDetailActivity");
			  
		
                  console.log(sezzwhoApp.activityFeedUserDetail.has_more_items);
			// Append new items
			//$$('.load-result').append(html);
          
			// Update last loaded index
	if(sezzwhoApp.activityFeedUserDetail.has_more_items == true){
			  page +=1;
			  maxItems= true;
	}
				else
		
				{
			   maxItems=false;
				}
		  

				  }, 1000);
		});       


        
        
        
        //End Function
    },
	post_update: function(content){
		var option ={
			content: content
		};
		
		sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.activities_post_update,option,"post_update");
		
		
		
		//End Function
	},
	response_post_update: function(response){
		
		
		//End Function
	},
	recordVideo: function(id){
		captureVideo();
		//end function
	},
	businessPostReview:function(){
	  var contentData,
            videotitle = "",
            videocontent = "",
            rating = "",
            hashtag = "",
			links= "";
			sezzwhoApp.postButton 			= false,
			sezzwhoApp.addLocationButton 	= false,
			sezzwhoApp.addReviewButton 		= true,
			sezzwhoApp.autoWhatsNew 		= false;

		($("#video-title").val()=="") ? $("#video-title").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        ($("#autocomplete-user").val()=="") ? $("#autocomplete-user").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        videotitle = sezzwhoApp.mainInits.matchUrl($$("#video-title").val());
        rating = $$("#rating").val();
		if(rating < 3) {
			myApp.alert("please select more than 3 star"); return false; }
			else { } 
        videocontent = $$("#videocontent").val();
        try {
			hashtag = $("#autocomplete-user").val().replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
		}
		catch(err){
			alert("Please add #/@ front of word");
			return false;
		}
		 if($("#autocomplete-website").val() === "")  { links = true;}
		else { links =$("#autocomplete-website").val();   }  
         
        contentData = {
            'avatar': sezzwhoApp.userloginInfo.user.avatar,
            'username': sezzwhoApp.userloginInfo.user.username,
            'userid': sezzwhoApp.userloginInfo.user.id,
            'videotitle': videotitle,
            'rating': rating,
            'hashtag': hashtag,
            'video': videocontent,
			'link' : links
        };
         contentData.usercheck = sezzwhoApp.userIDetail;
         contentData.usernameR = sezzwhoApp.userDetail;
         sezzwhoApp.reviewContent = contentData;
		  if(sezzwhoApp.isUploaded)
		 
		 { 
		      $("#auto-post-business i").addClass("fa-spinner fa-spin  fa-fw").removeClass("fa-pencil-square-o");
		      setTimeout(function(){  $("#auto-post-business i").removeClass("fa-spinner fa-spin  fa-fw").addClass("fa-pencil-square-o"); }, 3000);
			  sezzwhoApp.reviewContent.video = $$("#videocontent").val();
			  sezzwhoApp.addbusiness.postBusinessReview();
		 }
		 else{
		   sezzwhoApp.autoWhatsNew 		= true;
		    if ($$('.popup-record.modal-in').length > 0) { 
			         
	    			myApp.closeModal(".popup-record");
					sezzwhoApp.isStillUploading = true;
						myApp.addNotification({
        					title: 'Uploading...',
        					message: 'Stay tuned, uploading....',
							hold:3000
    						});
					return false;
			 	}
		 }
	},
	popupRecording:function(){
	  sezzwhoApp.popup('.popup-record');
	  star_rating();
	},
    blindEvent: function() {
        var bindings = [{
		 element:"#auto-post-business",
		 event: 'click',
		 handler: this.businessPostReview
		},{
		 element:'.business-recording',
		 event: 'click',
		 handler: this.popupRecording
		}
		];
        sezzwhoApp.mainInits.bindEvents(bindings);

    }    
  
     
		//End Function
};

sezzwhoApp.detailpages= detailpage;

  ;// JavaScript Document
var review = {
	   init: function() {
        this.getFeedActivities();
    },
	getFeedActivities: function(){
    
     var option = {
              'key'         : sezzwhoApp.jsonpcb,
              'user_id'     : sezzwhoApp.userIDetail,
              'cookie'      : sezzwhoApp.cookie,
			  'type' 		:"activity_update,Member_review",
		   	  'comments'	:true,
			  'review'      :true,
			  'scope'		:'mentions'
                
            };
       sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.following,option,"reviewpagelist");
   
       
      	
    	setTimeout(function(){	sezzwhoApp.homeModules.blindEvent(); },1000);  //follow up button
        
        
             //End Function
    },
	activitiesReviewFeed : function(response){
         var items=[],item=[];
		 var elContent = ".presonal-content-review-" + sezzwhoApp.userIDetail;
		 var elLoader =".infinite-scroll-preloader-review-page-" + sezzwhoApp.userIDetail;
		 var elScroll = ".infinite-scroll-review-" + sezzwhoApp.userIDetail;
		 var html = '<div class="none-comment"><i class="fa fa-newspaper-o  fa-5x"></i><p>No Activities</p></div>';
		 		sezzwhoApp.activityFeedUserReview =[];
				sezzwhoApp.activityFeedUserReview.has_more_items = false;
          
		     if(response.status !== "error" || response.error !=="No Activities found.") { 
             for(var i=0; i<response.activities.length;i++){
             text=sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
            
                sezzwhoApp.activityFeedUserReview = response;
            // console.log(text);
             item[i]={
                    nickname    : response.activities[i].user[0].username,
                    avatar      : sezzwhoApp.mainInits.addhttp(response.activities[i].user[0].avatar),
                    time        : response.activities[i].time_since,
					user_id: response.activities[i].user[0].user_id,
                    title       : text.title,
                    hashtag     : text.hashtag,
                    ziggeocode  : text.ziggeoCode,
                    type        : ((response.activities[i].type =="Member_review"||response.activities[i].type =="activity_update")?true:false),
					commentLenght	: (typeof(response.activities[i].comments) != "undefined")? response.activities[i].comments.length : 0,
					comments 		: (typeof(response.activities[i].comments) != "undefined")? true : false,
					page 			: response.page,
					id				: response.activities[i].activity_id,
					action			: response.activities[i].action,
				    name			: "detailpage",
					likes_count     : (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
					like_button 	: response.activities[i].likes_button,
					refer_count    	: response.activities[i].refer_count,
					share_count 	: response.activities[i].share_count,
					is_follow : response.activities[i].followCheck,
					account_type: response.activities[i].user[0].account_type

                };
               
             } // End for loop
             items.push({"item":item});  
             //console.log(JSON.stringify(items));
             
        		var output = sezzwhoApp.mainInits.renderTpl(activityTemplate,items[0]);
			  	$(elContent).append(output); 
                sezzwhoApp.hideIndicator();
				sezzwhoApp.commonFunc.init();  // Blind share event button ;   
			 }else
			 {
				sezzwhoApp.hideIndicator();
				 myApp.detachInfiniteScroll($$(elScroll));
			   $(elContent).html(html);
			   $$(elLoader).remove();
			 }

        //End Function
    },
     loadmoreFeedContent: function(){
          var elLoader =".infinite-scroll-preloader-review-page-" + sezzwhoApp.userIDetail;
  		 var elScroll = ".infinite-scroll-review-" + sezzwhoApp.userIDetail;

			 console.log("step1");
			// Loading flag
			var loading = false;
			// Last loaded index
			// Max items to load
			var maxItems = sezzwhoApp.activityFeedUserReview.has_more_items;
			// Append items per load
			var itemsPerLoad = 10;
			var page =2;
			loadmore = true;		  
			// Attach 'infinite' event handler
			$$(elScroll).on('infinite', function () {
			console.log("step2");
			// Exit, if loading in progress
			if (loading) return;
			// Set loading flag
			loading = true;
			// Emulate 1s loading
			setTimeout(function () {
				// Reset loading flag
				loading = false;
				 maxItems = sezzwhoApp.activityFeedUserReview.has_more_items;
				if (maxItems == false) {
					console.log("step3");
				  	// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
				  	myApp.detachInfiniteScroll($$(elScroll));
				  	// Remove preloader
				  	$$(elLoader).remove();
				  	return;
			}
			console.log("eer");
			// Generate new items HTML
			var html = '';

			   var option = {
					  'key'         : 	sezzwhoApp.jsonpcb,
					  'user_id'     : 	sezzwhoApp.userIDetail,
					  'cookie'      : 	sezzwhoApp.cookie,
				   	  'type' 		:	"activity_update,Member_review",
					  'page'        :	page,
					  'per_page'    :	itemsPerLoad,
				   	  'comments'	:	true,
					  'review'      :true

					};
				 sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.following,option,"loadmoreReviewActivity");
			  
		
                  console.log(sezzwhoApp.activityFeedUserReview.has_more_items);
			// Append new items
			//$$('.load-result').append(html);
          
			// Update last loaded index
	if(sezzwhoApp.activityFeedUserReview.has_more_items == true){
			  page +=1;
			  maxItems= true;
	}
				else
		
				{
			   maxItems=false;
				}
		  

				  }, 1000);
		});       


        
        
        
        //End Function
    }
	
}
sezzwhoApp.reviewpages= review;
;var searchTimeout, mySearchbar;
var search = {
    init: function() {
        //this.searchuser();
        this.bindEvent();
    },
    searchuser: function() {
        var autocompleteDropdownAjax = myApp.autocomplete({
            //input: '#autocomplete-user',
            opener: $$('#autocomplete-user'),
            openIn: 'popup',
            preloader: true, //enable preloader,
            backOnSelect: true, //go back after we select something
            valueProperty: 'user_id', //object's "value" property name
            textProperty: 'username', //object's "text" property name
            limit: 20, //limit to 20 results
            source: function(autocomplete, query, render) {
                var results = [];
                if (query.length === 0) {
                    render(results);
                    return;
                }
                // Show Preloader
                autocomplete.showPreloader();
                // Do Ajax request to Autocomplete data
                $$.ajax({
                    url: sezzwhoApp.url + "members",
                    method: 'GET',
                    dataType: 'json',
                    //send "query" to server. Useful in case you generate response dynamically
                    data: {
                        search_terms: query,
                        key: sezzwhoApp.jsonpcb
                    },
                    success: function(data) {
                        // Find matched items
                        //console.log(data);
                        for (var i = 0; i < data.members.length; i++) {
                            //if (data.members[i].username.toLowerCase().indexOf(query.toLowerCase()) >= 0) 
                            results.push(data.members[i].username);
                        }
                        // Hide Preoloader
                        autocomplete.hidePreloader();
                        // Render items by passing array with result items
                        render(results);
                    }
                });
            },
            onChange: function(autocomplete, value) {
                // Add item text value to item-after
                $$('#autocomplete-user').find('.item-after').text("@" + value[0]);
                // Add item value to input value
                $$('#autocomplete-user').find('input').val("@" + value[0]);
                $("#refer-user").prop('disabled', false);
            }
        });
        //end function
    },
    initSearchbar: function() {
        mySearchbar = myApp.searchbar('.searchbar.custom-search', {
            customSearch: true,
            onDisable: function(s) {
                $$('.popup-search input[type="search"]')[0].blur();
                myApp.closeModal('.popup-search');
            },
            onSearch: function(s, q) {
                sezzwhoApp.searchs.searchQuery(s.query);
            },
            onClear: function(s) {
                $$('.popup-search .search-results').html('');
                $$('.popup-search .search-results-activity').html('');
            }
        });
        myApp.popup(".popup-search");
        $$('.popup').on('open', function() {
            mySearchbar.enable();
        });
        $$('.popup').on('opened', function() {
            $$('.popup-search input[type="search"]')[0].focus();
        });
        //End Function
    },
    searchQuery: function(s) {
        console.log("step2");
        if (s.trim() === '') {
            $$('.popup-search .search-results-activity').html('');
            $$('.popup-search .search-results').html('');
            return;
        }
        if (searchTimeout) clearTimeout(searchTimeout);
        $$('.popup-search .preloader').show();
        searchTimeout = setTimeout(function() {
            //	sezzwhoApp.searchs.bboss_global_search_ajax(s);
            var option = {
                'key': sezzwhoApp.jsonpcb,
                'cookie': sezzwhoApp.cookie,
                'search_terms': encodeURIComponent(s)
            };
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.members, option, "searchResult");
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "searchResult");
        }, 300);
        //End Function
    },
    bboss_global_search_ajax: function(s) {
        var q = sezzwhoApp.homeUrl + "search_term=" + s + '&nonce=daf1b135ca';
        $.ajax({
            url: sezzwhoApp.homeUrl,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: "bboss_global_search_ajax",
                nonce: "daf1b135ca",
                search_term: s
            },
            success: function(results) {
                var html = '';
                //results = JSON.parse(results);
                console.log(results);
                $$('.popup-search .preloader').hide();
                /*   if (results.query.count > 0) {
                var places = results.query.results.place;
                html = myApp.searchResultsTemplate(places);
            }
            $$('.popup .search-results').html(html);
        */
            }
        });
    },
    displayResult: function(response) {
        var html = '';
        //     results = JSON.parse(results);
        //console.log(results);
        $$('.popup-search .preloader').hide();
        var output;
        if (response.status === "ok" && typeof(response.members) !== "undefined") {
            output = sezzwhoApp.mainInits.renderTpl(searchTemplate, response.members);
            $$('.popup-search .search-results').html(output);
            sezzwhoApp.searchs.init();
        } else {
			if (response.status !== "error") {
				var items = [],
					item = [];
				for (var i = 0; i < response.activities.length; i++) {
					text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
					// console.log(text);
					item[i] = {
						nickname: response.activities[i].user[0].display_name,
						avatar: response.activities[i].user[0].avatar,
						user_id: response.activities[i].user[0].user_id,
						time: response.activities[i].time_since,
						title: text.title,
						hashtag: text.hashtag,
						ziggeocode: text.ziggeoCode,
						type: ((response.activities[i].type == "Member_review" || response.activities[i].type == "activity_update") ? true : false),
						commentLenght: (typeof(response.activities[i].comments) != "undefined") ? response.activities[i].comments.length : 0,
						comments: (typeof(response.activities[i].comments) != "undefined") ? true : false,
						page: response.page,
						id: response.activities[i].activity_id,
						action: response.activities[i].action,
						name: "personal",
						likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
						like_button: response.activities[i].likes_button,
						refer_count: response.activities[i].refer_count,
						web_link: (response.activities[i].web_link === "") ? false : sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
						location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address) : false,
						share_count : response.activities[i].share_count, 
						is_follow : response.activities[i].followCheck,
						account_type: response.activities[i].user[0].account_type
	
					};
				} // End for loop
				items.push({
					"item": item
				});
				output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
				$$('.popup-search .search-results-activity').html(output);
				sezzwhoApp.commonFunc.blindEvent();
			}
        }
        //End Function
    },
    bindEvent: function() {
        var bindings = [{
            element: '#following-search input, #personal-search input,#detail-search input,#follower-search-list input,#following-search-list input',
            event: 'focus',
            handler: this.initSearchbar
        }, {
            element: '.search-follow',
            event: 'click',
            handler: sezzwhoApp.homeModules.startStopFollowing
        }, {
            element: '.sezzwho-searchbar',
            event: 'click',
            handler: this.initSearchbar
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
        //End Function
    }
};
sezzwhoApp.searchs = search;;var obj = [];
var addbusiness = {
    init: function() {
        this.bindEvent();

    },
    businessPage: function() {
        var contentData,
            videotitle 	= "",
            videocontent= "",
            rating 		= "",
            hashtag 	= "",
			links		= "";
			sezzwhoApp.postButton 			= false,
			sezzwhoApp.addLocationButton 	= true,
			sezzwhoApp.addReviewButton 		= false,
			sezzwhoApp.autoWhatsNew 		= false,
			sezzwhoApp.backAddbusiness = true;
		($("#video-title").val()=="") ? $("#video-title").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        ($("#autocomplete-user").val()=="") ? $("#autocomplete-user").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        videotitle = sezzwhoApp.mainInits.matchUrl($$("#video-title").val());
        rating = $$("#rating").val();
		if(rating < 3) {
			myApp.alert("please select more than 3 star"); return false; }
			else { } 
        videocontent = $$("#videocontent").val();
        try{
		hashtag = $("#autocomplete-user").val().replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
       }
		catch(err){
			alert("Please add #/@ front of word");
			return false;
		}
	    if($("#autocomplete-website").val() === "")  { links = true;}
		else { links =$("#autocomplete-website").val();   }  
 
        contentData = {
            'avatar': sezzwhoApp.userloginInfo.user.avatar,
            'username': sezzwhoApp.userloginInfo.user.username,
            'userid': sezzwhoApp.userloginInfo.user.id,
            'videotitle': videotitle,
            'rating': rating,
            'hashtag': hashtag,
            'video': videocontent,
			'link' : links 
        };


        mainView.router.load({
            url: sezzwhoApp.pageUrl + 'addbusiness.html',
            force: true,
            context: contentData
        });
        //myApp.closeModal(); // 
  			 if ($$('.popup-record.modal-in').length > 0) { 
	    			myApp.closeModal(".popup-record");
				return false;
				}
    },
    closePopup: function() {
		sezzwhoApp.embedding.reset();
        $$(".demo-progressbar-load-hide").html('<p style="height:2px"></p>');
        $$(".record-input").val("");
        $$("#review-rating img").attr('src', 'images/star_off.png');
        $$("#post-a-review,#auto-post-a-review").attr("disabled", "disabled");
		$$('input#rating').attr( 'value', 0 );
        $("#auto-add-business,#auto-aw-whats-new-submit,#auto-post-business").prop("disabled", true);
		$(".auto-post input").prop('checked',false);
		sezzwhoApp.autoWhatsNew= false;
		sezzwhoApp.isUploading		= false,
		sezzwhoApp.isUploaded		= false;
     	sezzwhoApp.isStillUploading = false;
	
        if ($$('.popup-record.modal-in').length > 0) { 
	    myApp.closeModal(".popup-record");
		return false;
		}
    },
    initMap: function() {

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -33.8688,
                lng: 151.2195
            },
            zoom: 13
        });
        var input = /** @type {!HTMLInputElement} */ (
            document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }
            marker.setIcon( /** @type {google.maps.Icon} */ ({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
            var radioButton = document.getElementById(id);
            radioButton.addEventListener('click', function() {
                autocomplete.setTypes(types);
            });
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);

    },
    autoComplete: function(content) {
        //alert("auto Complete");
		//console.log(content);
		obj = content;
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?location=54.7226785,-113.7223949&key=AIzaSyBLD3-k-NncJrejPdZsx_82iqY6RN_ZbR4";
        var autocompleteStandaloneAjax = myApp.autocomplete({
            openIn: 'page', //open in page
            opener: $$('#autocomplete-standalone-ajax'), //link that opens autocomplete
            valueProperty: 'id', //object's "value" property name
            multiple: false, //allow multiple values
            textProperty: 'description', //object's "text" property name
            limit: 50,
            backOnSelect: true,
            preloader: true, //enable preloader
            source: function(autocomplete, query, render) {
                var results = [];
                if (query.length === 0) {
                    render(results);
                    return;
                }
                // Show Preloader
                autocomplete.showPreloader();
                // Do Ajax request to Autocomplete data
                $$.ajax({
                    url: url,
                    method: 'GET',
                    dataType: 'json',
                    //send "query" to server. Useful in case you generate response dynamically
                    data: {
                        input: query
                    },
                    success: function(data) {
                        // Find matched items

                        for (var i = 0; i < data['predictions'].length; i++) {
                            results.push(data['predictions'][i]);
                        }
                        // Hide Preoloader
                        autocomplete.hidePreloader();
                        // Render items by passing array with result items
                        render(results);
                    }

                });
            },
            onChange: function(autocomplete, value) {

                // Add item text value to item-after
                $$('#autocomplete-standalone-ajax').find('.item-after').text(value[0].description);
                // Add item value to input value
				//alert("changed");
                $$('#autocomplete-standalone-ajax').find('input').val(value[0].description);
                sezzwhoApp.addbusiness.registerBusiness(value[0].description, content);
            }
        }); // autocomplete

        //End function	
    },
    registerBusiness: function(arg, content) {

        //event.preventDefault();

        //alert("fsd");
        
        txtInput = arg.split(",");


        var username = txtInput[0];

        var business_type = $("#businestype").val();

        console.log(username);

        var location = arg;

        if (!(username == "") && !(location == "")) {

            //code
            sezzwhoApp.showIndicator();


            jQuery.ajax({

                url: sezzwhoApp.homeUrl,

                type: 'POST',

                dataType: 'JSON',

                data: {
                    action: "wow_registration_page",
                    tagbusiness: username,
                    type: business_type,
                    loc: location
                },

                success: function(data) {

                    // var obj = jQuery.parseJSON(data);

                    console.log(data.username);
                    content.usercheck = data.userid;
                    content.usernameR = data.username;
                    sezzwhoApp.reviewContent = content;
                    sezzwhoApp.hideIndicator();
					$("#post-a-review,#auto-post-a-review").attr("disabled", false);	

                    //jQuery("#whats-new-submits").unbind(event.preventDefault());



                }

            });

        } // Check Fields


        //End fucntion
    },
    postBusinessReview: function() {
        console.log(sezzwhoApp.reviewContent);
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'content': sezzwhoApp.reviewContent
        };

        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_post_update_review, option, "postBusinessReview");

    },
	postAutoBusinessReview: function() {
        console.log(sezzwhoApp.reviewContent);
		    
      if(sezzwhoApp.isUploaded)
		 
		 { 
		 
		  $("#auto-post-a-review i").addClass("fa-spinner fa-spin  fa-fw").removeClass("fa-video-camera");
		  setTimeout(function(){  $("#auto-post-a-review i").removeClass("fa-spinner fa-spin  fa-fw").addClass("fa-video-camera"); }, 3000);
		 sezzwhoApp.reviewContent.video = $$("#videocontent").val();
	    var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'content': sezzwhoApp.reviewContent
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_post_update_review, option, "postBusinessReview");
		}else{
		sezzwhoApp.isStillUploading = true;	
	 	sezzwhoApp.autoWhatsNew = true;
        sezzwhoApp.backAddbusiness = false;
		mainView.router.back();
     	myApp.addNotification({
     		title: 'Uploading...',
        	message: 'Stay tuned, uploading....',
			hold:3000
    	});

		}
    },
    doneReview: function(response) {
        if (response.status == "ok") {
            myApp.addNotification({
                title: 'Sezzwho',
                subtitle: 'Post Updated',
				hold : 7000, 
				button:{
				  text: 'close',
				  color: 'red',
				  close: true
				},
                message: 'Post updated successfully',
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
            sezzwhoApp.personalFeeds.getFeedActivities(); // Update personal feed 
           	sezzwhoApp.homeModules.refreshActivities(); // refresh following page
       	    sezzwhoApp.popularVideos.getPopularVideo(); // refresh popular page
			//Rest all data
            //sezzwhoApp.addbusiness.closePopup();
            sezzwhoApp.addbusiness.closePopup();
             if(sezzwhoApp.backAddbusiness)
		    mainView.router.back();
        } else {
            myApp.addNotification({
                title: 'Sezzwho',
                subtitle: 'Notification',
                message: response.error,
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
        }

    },
    bindEvent: function() {
        var bindings = [{
            element: '#add-business',
            event: 'click',
            handler: this.businessPage
        }, {
            element: '#post-a-review',
            event: 'click',
            handler: this.postBusinessReview
        },{
            element: '#auto-add-business',
            event: 'click',
            handler: this.businessPage
        }, {
            element: '#auto-post-a-review',
            event: 'click',
            handler: this.postAutoBusinessReview
        }
		];

        sezzwhoApp.mainInits.bindEvents(bindings);
    }


};

sezzwhoApp.addbusiness = addbusiness;;var ProfileComponent;
var profile = {
    init: function() {
        this.blindEvent();
        this.reactInit();
    },
    profileEdit: function() {

    },
    profileSave: function() {

    },
    reactInit: function() {

        requirejs(["build/profile/profileReact"], function(profileReact) {
            profileReact.initProfile();
        });


    },
    blindEvent: function() {
        var bindings = [{
            element: '.edit',
            event: 'click',
            handler: this.profileEdit
        }, {
            element: '.save',
            event: 'click',
            handler: this.profileSave
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }


}

sezzwhoApp.profiles = profile;;var setting = {
      init : function(){
		if(isAndroid){
		  requirejs(["build/setting/settingReact"],function(setting){ 
	              setting.initSetting();
				});
	  	}else{
	  	requirejs(["build/setting/settingReact-ios"],function(setting){ 
	              setting.initSetting();
				});
		}
	  },
	  updateSetting : function(){
		  
	  },
	  updatePassword : function(){
		  console.log("change password");
		  var options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'password': document.getElementById("confirm_password").value
       		 };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.update_password, options, "changePassword");
	  },
	  responseUpdatePassword : function(response){
		  if(response.status === "ok"){
			   myApp.addNotification({
                title: 'Change Password',
                subtitle: 'Password Updated',
                message: 'Password updated successfully',
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
		  }
	  },
	  initPasswordValidate : function(){
		var password = document.getElementById("password"), 
		confirm_password = document.getElementById("confirm_password"),
		sezzwho_update_password = document.getElementById("sezzwho-update-password");
  
		function validatePassword(){
		  if(password.value != confirm_password.value) {
			confirm_password.style.color='red';
			$("#sezzwho-update-password").attr("disabled", true);
		  } else {
			confirm_password.style.color= 'black';
			$("#sezzwho-update-password").attr("disabled", false);
		  }
		}
		
		password.onchange = validatePassword;
		confirm_password.onkeyup = validatePassword;
	  },
	  bindEvent: function(){
		var bindings =[{
		element	: '#sezzwho-update-setting',
		event 	: 'click',
		handler	: this.updateSetting
		},
		{
		element	: '.sezzwho-update-password',
		event 	: 'click',
		handler	: this.updatePassword
		}
		];
		sezzwhoApp.mainInits.bindEvents(bindings);
	}
	
}
sezzwhoApp.settings = setting;;// JavaScript Document\\
var register = {
    init: function() {
        requirejs(["build/register/registerReact"], function(reg) {
            reg.initRegister();
        });
    },
    registerUser: function() {

    },
    bindEvent: function() {
        var bindings = [{
            element: '#sezzwho-new-user',
            event: 'click',
            handler: this.registerUser
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }

}
sezzwhoApp.registers = register;;/**
*
*   Popular video 
*/

var popularVideo = {
	  init:function(query){
		  this.getPopularVideo();
	  },
	  getPopularVideo: function(){
			var options = {
              'key'         : sezzwhoApp.jsonpcb,
              'user_id'     : 0,
              'cookie'      : sezzwhoApp.cookie,
		   	  'type' 		: "activity_update,Member_review",
		   	  'comments'	: true,
			  'limit'		: 15
                
            };
       sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url,sezzwhoApp.sezzwhoAction.following,options,"popular_video");
	  },
	  displayVideo : function(response){
		    console.log(response);
		  if(response.status !== "error") {
			  	 var items=[],item=[], text =[], title="";
				 for(var i=0; i<response.activities.length;i++){
				 text=sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
				title = text.title;
				title = title.replace(/\\/g, ''); 
	
				 item[i]={
						nickname    : response.activities[i].user[0].display_name,
						avatar      : response.activities[i].user[0].avatar,
						user_id		: response.activities[i].user[0].user_id,
						time        : response.activities[i].time_since,
						title       : title,
						hashtag     : text.hashtag,
						ziggeocode  : text.ziggeoCode,
						type        : ((response.activities[i].type =="Member_review"||response.activities[i].type =="activity_update")?true:false),
						commentLenght	: (typeof(response.activities[i].comments) != "undefined")? response.activities[i].comments.length : 0,
						comments 		: (typeof(response.activities[i].comments) != "undefined")? true : false,
						page 			: response.page,
						id				: response.activities[i].activity_id,
						action			: response.activities[i].action,
						name			: "personal",
						star 			: response.activities[i].star,
						likes_count     : (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
						like_button 	: response.activities[i].likes_button,
						refer_count    	: response.activities[i].refer_count,
						web_link 		: sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
						popular			: true,
						location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address)  : false ,
						share_count : response.activities[i].share_count,
						is_follow : response.activities[i].followCheck,
						account_type: response.activities[i].user[0].account_type

					};
				   
				 } // End for loop
				 items.push({"item":item});  
				 //console.log(JSON.stringify(items));
				 
				//var output = sezzwhoApp.mainInits.renderTpl(popularTemplate,items[0]);
				var output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
				$$("#popular-vidoes").html(output);
			  
				//setTimeout(function(){ sezzwhoApp.popularVideos.initSlider() }, 1000);
		  } else {
			  $("#popular-vidoes").html('');
		  
		  }
	      sezzwhoApp.commonFunc.init(); // Blind share event button ;   
	  },
	  initSlider :function (){  
		var mySwiper3 = myApp.swiper('.swiper-3', {
		  pagination:'.swiper-3 .swiper-pagination',
		  spaceBetween: 10,
		  slidesPerView: 2
		});  
	  },
	  blindEvent : function(){
		var bindings = [{
			element : '',
			event : 'click',
			handler : ''
			}
			];
		sezzwhoApp.mainInits.bindEvents(bindings);
		
	}
	
	
	
	
};

sezzwhoApp.popularVideos = popularVideo;;// JavaScript Document
var videodetail = {
    init: function(q) {
        console.log(q);
        this.videoInit(q);
        sezzwhoApp.comments.singlePage = false;
        this.commentDetail(q);
		sezzwhoApp.comments.bindEvent(); 

    },
    videoInit: function(q) {
		
        var url = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" + q.ziggeocode + "/video.mp4?effect_profile=ba51b5e2f51692f07abe8f49bd4b56c3";
        var imageUrl = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" + q.ziggeocode + "/image?effect_profile=ba51b5e2f51692f07abe8f49bd4b56c3";
		flowplayer.conf = {
		   native_fullscreen: true		   
		};
        flowplayer("#overlay", {
            // configure the AdSense plugin for this player
            ima: {
                // must be set when testing your installation
                adtest: true,
                // make the Google robots crawl the current page
                description_url: location.href,
                // adverts configuration
                ads: [{
                    // mandatory: schedule ad time
                    // here: 3 seconds into the video
                    time: 3,
                    // request an advert of type image or text type
                    ad_type: "image_text"
                }]
            },
            splash: true,
            ratio: 9 / 16,
            rtmp: "rtmp://s3b78u0kbtx79q.cloudfront.net/cfx/st",
            embed: {
                // embed with minimalist skin
                skin: "http://releases.flowplayer.org/7.0.2/skin/minimalist.css"
            },
            clip: {
                sources: [{
                    type: "video/mp4",
                    src: url
                }]
            }
        });
    },
    commentDetail: function(query) {
		 
		 sezzwhoApp.commentsType = [{
            id: query.id,
            type: query.name,
            page: query.page,
			user_id: query.user_id
        }];
		
        sezzwhoApp.comments.getJsonComments(query);
        setTimeout(function() {
            sezzwhoApp.comments.bindEvent();
            $(".preloader").remove();
        }, 3000);
    }
};
sezzwhoApp.videodetails = videodetail;;var singleActivity = {
    init: function(query) {
        var that = this;
        this.blindEvent();
        that.getSingleActivity(query.item);
		 sezzwhoApp.notifications.notifications_single_mark(query.markID);
		setTimeout(function(){ sezzwhoApp.commonFunc.blindEvent(); }, 1000);
    },
    getSingleActivity: function(id) {
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'include': id,
            'cookie': sezzwhoApp.cookie,
            'user_id': sezzwhoApp.userloginInfo.user.id
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_single_activity_post, options, "singlePage");
    },
    displayActivity: function(response) {
        var items = [],
            item = [],
            count,
			html = '<div class="none-comment"><i class="fa fa-newspaper-o  fa-5x"></i><p>Oops! This activity has been deleted.</p></div>';
        var el = $('.single-result');
        sezzwhoApp.singleData = response;
        if (response.status !== "error") {
        for (var i = 0; i < response.activities.length; i++) {
            text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
            item[i] = {
                nickname: response.activities[i].user[0].username,
                avatar: response.activities[i].user[0].avatar,
                user_id: response.activities[i].user[0].user_id,
                time: response.activities[i].time_since,
                title: text.title,
                hashtag: text.hashtag,
                ziggeocode: text.ziggeoCode,
                type: ((response.activities[i].type == "Member_review" || response.activities[i].type == "activity_update") ? true : false),
                commentLenght: (typeof(response.activities[i].comments) !== "undefined") ? response.activities[i].comments.length : 0,
                comments: (typeof(response.activities[i].comments) !== "undefined") ? true : false,
                page: response.page,
                id: response.activities[i].activity_id,
                action: response.activities[i].action,
                name: "Activity",
                likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
                like_button: response.activities[i].likes_button,
                refer_count: response.activities[i].refer_count,
                web_link: sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
				location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address)  : false ,
				share_count: response.activities[i].share_count,
				is_follow : response.activities[i].followCheck,
				account_type: response.activities[i].user[0].account_type
            };
            i++;
        } // while  loop
        items.push({
            "item": item
        });
        //console.log(JSON.stringify(items));
        var output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
        el.html(output);
		}
		else{
			el.html(html);
		}
    },
    blindEvent: function() {
        var bindings = [{
            element: '',
            event: 'click',
            handler: ''
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }
};
sezzwhoApp.singlePage = singleActivity;;var lostPassword = {
  init: function () {
	  this.blindEvent();
	  },
  blindEvent: function () {
    var bindings = [{
      element: "#wp-submit",
      event: 'click',
      handler: sezzwhoApp.commonFunc.lostSezzwhoPassword
    }];
   mainInit.bindEvents(bindings);
  }
};

sezzwhoApp.lostPasswords = lostPassword;;var followingList = {
		init: function(query) {
			this.getFollowingList(query);
		},
		getFollowingList : function(query){
		sezzwhoApp.followingList.user_id = query.id;	
		var options = {
            'key': sezzwhoApp.jsonpcb,
            'user_id':sezzwhoApp.followingList.user_id,
            'cookie': sezzwhoApp.cookie,
            'per_page': 10,
            'page':1
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_following_list, options, "followingList");
        
		},
		displayFollowingList: function(response){
			
			if(response.status !== "error"){
			var index = (response.page-1) * response.per_page,
				limit = (response.page === 1)? response.list.length :((response.page-1) * (Object.keys(response.list).length)+ response.per_page);
			
			   sezzwhoApp.followingList.followingResponse = response;
			  sezzwhoApp.followingList.has_more_items = response.has_more_items;
			 	var items = [],
                    item = []
					i=0;
					for (index; index < limit; index++) {
						item[i] = {
						   'username': response.list[index].data.user_login,
						   'user_id' : response.list[index].data.ID,
						   'user_registered':response.list[index]['data'].user_registered,
						   'avatar':sezzwhoApp.mainInits.addhttp(response.list[index]['data'].avatar),
						   'bio':response.list[index]['data'].bio,
						   'count':response.list[index]['data'].counts,
						   'nickname': response.list[index]['data'].display_name,
						   'account_type':response.list[index]['data'].accountType
						};
						i++;
					}
			   items.push({
                    "item": item
                });
			   var output = sezzwhoApp.mainInits.renderTpl(followingTemplate, items[0]);
                $('.following-list').append(output);
			  	
				if(response.total_limit < 10){
				$$('.infinite-scroll-preloader-following-list').remove();
				}	
			}
			else{
			$('.following-list').html("<span class='no-following-list'>No following</span>");
			$$('.infinite-scroll-preloader-following-list').remove();
			}
			sezzwhoApp.hideIndicator();
		},
		loadmore: function() {

        // Loading flag
        var loading = false;

        // Last loaded index

        // Max items to load
        var maxItems = sezzwhoApp.followingList.has_more_items;

        // Append items per load
        var itemsPerLoad = 10;
        var page = 2;
        loadmore = true;

        // Attach 'infinite' event handler
        $$('.infinite-scroll-following-list').on('infinite', function() {

            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;
             
            // Emulate 1s loading
            setTimeout(function() {
                // Reset loading flag
                loading = false;
                maxItems = sezzwhoApp.followingList.has_more_items;
                if (maxItems == false) {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll-following-list'));
                    // Remove preloader
                    $$('.infinite-scroll-preloader-following-list').remove();
                    return;
                }
               
                // Generate new items HTML
                var html = '';

                var options = {
                    'key': sezzwhoApp.jsonpcb,
                    'user_id': sezzwhoApp.followingList.user_id,
                    'cookie': sezzwhoApp.cookie,
                    'page': page,
                    'per_page': itemsPerLoad

                };
                sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_following_list, options, "followingLoadMore");


                //console.log(sezzwhoApp.activityFeedData.has_more_items);
                // Append new items
                //$$('.load-result').append(html);

                // Update last loaded index
                if (sezzwhoApp.followingList.has_more_items == true) {
                    page += 1;
                    maxItems = true;
                } else {
                    maxItems = false;
                }


            }, 1000);
        });



        //End Function
    }
};

sezzwhoApp.followingList = followingList;;var followerList = {
		init: function(query) {
			this.getFollowerList(query);
		},
		getFollowerList : function(query){
		sezzwhoApp.followerList.user_id = 	query.id;
		var options = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': sezzwhoApp.followerList.user_id,
            'cookie': sezzwhoApp.cookie,
            'per_page': 10,
            'page':1
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_follower_list, options, "followerList");
        
		},
		displayFollowerList: function(response){
			if(response.status !== "error"){
			var index = (response.page-1) * response.per_page,
				limit = (response.page === 1)? response.list.length : ((response.page-1)*(Object.keys(response.list).length) + response.per_page);
			  sezzwhoApp.followerList.followerResponse = response;
			  sezzwhoApp.followerList.has_more_items = response.has_more_items;
			 	var items = [],
                    item = []
					i=0;
					for (index; index < limit; index++) {
						item[i] = {
						   'username': response.list[index].data.user_login,
						   'user_id' : response.list[index].data.ID,
						   'user_registered':response.list[index]['data'].user_registered,
						   'avatar':sezzwhoApp.mainInits.addhttp(response.list[index]['data'].avatar),
						   'bio':response.list[index]['data'].bio,
						   'count':response.list[index]['data'].counts,
						   'nickname': response.list[index]['data'].display_name,
						   'account_type':response.list[index]['data'].accountType
						};
						i++;
					}
			   items.push({
                    "item": item
                });
			   var output = sezzwhoApp.mainInits.renderTpl(followerTemplate, items[0]);
                $('.follower-list').append(output);
				
				if(response.total_limit < 10){
					$$('.infinite-scroll-preloader-follower').remove();
				}
				
			}
			else{
							
               $('.follower-list').html("<span class='no-follower-list'>No follower</span>");
			   $$('.infinite-scroll-preloader-follower').remove();
			}
			sezzwhoApp.hideIndicator();
		},
		loadmore: function() {

        // Loading flag
        var loading = false;

        // Last loaded index

        // Max items to load
        var maxItems = sezzwhoApp.followerList.has_more_items;

        // Append items per load
        var itemsPerLoad = 10;
        var page = 2;
        loadmore = true;

        // Attach 'infinite' event handler
        $$('.infinite-scroll-follower').on('infinite', function() {

            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;
             
            // Emulate 1s loading
            setTimeout(function() {
                // Reset loading flag
                loading = false;
                maxItems = sezzwhoApp.followerList.has_more_items;
                if (maxItems == false) {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll-follower'));
                    // Remove preloader
                    $$('.infinite-scroll-preloader-follower').remove();
                    return;
                }
               
                // Generate new items HTML
                var html = '';

                var options = {
                    'key': sezzwhoApp.jsonpcb,
                    'user_id': sezzwhoApp.followerList.user_id,
                    'cookie': sezzwhoApp.cookie,
                    'page': page,
                    'per_page': itemsPerLoad

                };
                sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_follower_list, options, "followerLoadMore");


                //console.log(sezzwhoApp.activityFeedData.has_more_items);
                // Append new items
                //$$('.load-result').append(html);

                // Update last loaded index
                if (sezzwhoApp.followerList.has_more_items == true) {
                    page += 1;
                    maxItems = true;
                } else {
                    maxItems = false;
                }


            }, 1000);
        });



        //End Function
    }
};

sezzwhoApp.followerList = followerList;;var GlobalLat = null,
    GlobalLong = null;

var geolocation = {
    initGeo: function(){
        $$('#geoInfo').removeClass('show').hide();

        $$('#geoInfo .location>i').removeClass('ios7-location-outline').addClass('preloader');
        $$('#geoInfo .location>span').html(i18n.geo.loading_geo);

        GlobalLat = null;
        GlobalLong = null;
    },

    catchGeoInfo: function(){
        $$('#geoInfo').addClass('show').show();
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(geolocation.showPosition,geolocation.showGeoError);
        }else{
            $$('#geoInfo .location').html(i18n.geo.position_unavailable);
        }
    },

    showPosition: function(position){
        var lat = position.coords.latitude;
        var long = position.coords.longitude;

        $$('#geoInfo .location>i').removeClass('preloader').addClass('ios7-location-outline');
        $$('#geoInfo .location>span').html(( Math.round(lat * 10000)/10000) + '/' + ( Math.round(long * 10000)/10000) );

        GlobalLat = lat;
        GlobalLong = long;
    },

    showGeoError: function(error){
        switch(error.code)
        {
            case error.PERMISSION_DENIED:
                $$('#geoInfo .location').html(i18n.geo.permission_denied);
                break;
            case error.POSITION_UNAVAILABLE:
                $$('#geoInfo .location').html(i18n.geo.position_unavailable);
                break;
            case error.TIMEOUT:
                $$('#geoInfo .location').html(i18n.geo.timeout);
                break;
            case error.UNKNOWN_ERROR:
                $$('#geoInfo .location').html(i18n.error.unknown_error);
                break;
        }
    },

    getGeo: function(){
        return {
            lat:GlobalLat,
            long:GlobalLong
        };
    },

    cleanGeo: function(){
        hiApp.confirm(i18n.geo.confirm_clean_geo,geolocation.initGeo);
    }
};

sezzwhoApp.geolocation = geolocation;;// JavaScript Document

ZiggeoApi.Events.on("uploading", function ( data ) {
    //Your code goes here
	console.log("uploading");
    sezzwhoApp.embedding = ZiggeoApi.Embed.get("ziggeo_replace_me");
	sezzwhoApp.isUploading = true;
	$("#auto-aw-whats-new-submit,#auto-add-business,#auto-post-business").prop("disabled",false);

	if(sezzwhoApp.autoWhatsNew){
		if ($$('.popup-record.modal-in').length > 0) { 
			myApp.closeModal(".popup-record");
			 myApp.addNotification({
						title: 'Uploading...',
						message: 'Stay tuned, uploading....',
						hold:3000
					});
			return false;
		}
	
	}

});

 ZiggeoApi.Events.on("submitted", function ( data ) {
    console.log(data.video.streams[3]);
	sezzwhoApp.isUploaded = true;
	video_code = '<ziggeo ziggeo-width="320" ziggeo-height="240" ziggeo-auto_crop="true" ziggeo-effect_profile="ba51b5e2f51692f07abe8f49bd4b56c3" ziggeo-video_profile="a9068e8d98ff6d36dd3ec66f35986d0c"  ziggeo-responsive="true" ziggeo-video="' +  data.video.token + '"></ziggeo>';	
				var el ={};
		      
				el[0] = $$("#videocontent");
		     	//if(sezzwhoApp.recordingType === "whats-new"){
				el[1] =  $("#aw-whats-new-submit,#add-business,#post-business");
				/* }else if(sezzwhoApp.recordingType === "comments"){
				el[1] = $$("#post-comment");
				el[1].prop("disabled",false);
				}else if(sezzwhoApp.recordingType === "whats-record"){
				 var src = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" +  data.video.token + "/video.mp4";
				 var img = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" +	 data.video.token	+ "/image";
					$("#re-change-image").attr('poster', img);
					$("#re-change-video").attr('src', src);
				}*/
				
			
			    el[2] = $$("#videobusiness")
				el[0].val(video_code);
				el[2].val( data.video.token);
	
	            if(sezzwhoApp.autoWhatsNew && sezzwhoApp.postButton){
					 sezzwhoApp.personalFeeds.initPostData();
					 //sezzwhoApp.notif.init(sezzwhoApp.uploadToken);
				 	sezzwhoApp.notifications.uploadVideoNotification();
				}else if(sezzwhoApp.autoWhatsNew && sezzwhoApp.addLocationButton){
					  sezzwhoApp.reviewContent.video =	video_code;
					  sezzwhoApp.addbusiness.postBusinessReview();
					 // sezzwhoApp.notif.init(sezzwhoApp.uploadToken);
 				 	sezzwhoApp.notifications.uploadVideoNotification();
				}else if(sezzwhoApp.autoWhatsNew && sezzwhoApp.addReviewButton){
					  sezzwhoApp.detailpages.businessPostReview();
  				 	  sezzwhoApp.notifications.uploadVideoNotification();
					//  sezzwhoApp.notif.init(sezzwhoApp.uploadToken);	
				}
				else{
				
				}
});


/*

ZiggeoApi.Events.on("system_ready", function() {

 sezzwhoApp.embedding = ZiggeoApi.V2.Player.findByElement( document.getElementById('ziggeo_replace_me') );
 
 sezzwhoApp.embedding.on("uploading", function () {
    //Your code goes here
	console.log("uploading");
	sezzwhoApp.isUploading = true;
	$("#auto-aw-whats-new-submit,#auto-add-business,#auto-post-business").prop("disabled",false);

	if(sezzwhoApp.autoWhatsNew){
		if ($$('.popup-record.modal-in').length > 0) { 
			myApp.closeModal(".popup-record");
			 myApp.addNotification({
						title: 'Uploading...',
						message: 'Turn Stay, uploading....',
						hold:3000
					});
			return false;
		}
	
	}
	
});

sezzwhoApp.embedding.on("verified", function () {

	sezzwhoApp.isUploaded = true;
	video_code = '<ziggeo ziggeo-width="320" ziggeo-height="240" ziggeo-responsive="true" ziggeo-video="' +  sezzwhoApp.embedding.get('video') + '"></ziggeo>';	
				var el ={};
		      
				el[0] = $$("#videocontent");
				el[1] =  $("#aw-whats-new-submit,#add-business,#post-business");
			
				
				el[2] = $$("#videobusiness")
				el[0].val(video_code);
				el[2].val( sezzwhoApp.embedding.get('video') );
	
	            if(sezzwhoApp.autoWhatsNew && sezzwhoApp.postButton){
					 sezzwhoApp.personalFeeds.initPostData();
				 	sezzwhoApp.notifications.uploadVideoNotification();
				}else if(sezzwhoApp.autoWhatsNew && sezzwhoApp.addLocationButton){
					  sezzwhoApp.reviewContent.video =	video_code;
					  sezzwhoApp.addbusiness.postBusinessReview();
 				 	sezzwhoApp.notifications.uploadVideoNotification();
				}else if(sezzwhoApp.autoWhatsNew && sezzwhoApp.addReviewButton){
					  sezzwhoApp.detailpages.businessPostReview();
  				 	  sezzwhoApp.notifications.uploadVideoNotification();
				}
				else{
				
				}
	
	
});
 
 

});


*/