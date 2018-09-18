var loadmore = false;
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
sezzwhoApp.personalFeeds = feeds;