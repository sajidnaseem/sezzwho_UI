var commonFunc = {

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

sezzwhoApp.commonFunc = commonFunc;