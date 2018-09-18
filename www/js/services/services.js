/**
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

sezzwhoApp.xhrs = sxhr;