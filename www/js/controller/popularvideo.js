/**
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

sezzwhoApp.popularVideos = popularVideo;