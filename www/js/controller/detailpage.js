var loadmore=false;
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

  