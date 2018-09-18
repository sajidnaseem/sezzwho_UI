// Let's register Template7 helper so we can pass json string in links change
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
sezzwhoApp.comments = comments;