/**
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


sezzwhoApp.homeModules = homeModule;