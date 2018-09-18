// JavaScript Document

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