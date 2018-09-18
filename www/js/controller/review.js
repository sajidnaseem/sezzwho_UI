// JavaScript Document
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
