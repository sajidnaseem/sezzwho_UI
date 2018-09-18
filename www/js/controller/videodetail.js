// JavaScript Document
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
sezzwhoApp.videodetails = videodetail;