var notification = {
    init: function() {

        this.notifications_unread_count();
        //End Function
        this.getNotification();

    },
    notifications_unread_count: function() {
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie


        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_unread_count, option, "unreadCount");
        //end function
    },
    displayCount: function(response) {
        if (response.count > 0){
            $('i.fa.fa-flag .badge').text(response.count);
		}else{
			$('i.fa.fa-flag .badge').text("0");
			var html = '<div class="none-comment"><i class="fa fa-exclamation-triangle fa-5x"></i><p>No New Notifications</p></div>';
            $(".notification-template").html(html);
		}
		//end function
    },
    getNotification: function() {
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
			'component':sezzwhoApp.notificationsOptions,
            'is_new': true

        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications, option, "notification");
    },
    displayNotifications: function(response) {
        var items = [],
            item = [],
            count,
            i = 0;
        console.log(response);
        if (typeof(response.notifications) !== "undefined") {
            while (i < response.notifications.length) {

                item[i] = {
                    nickname: response.notifications[i].sender_name,
                    avatar: response.notifications[i].sender_avatar,
                    time: response.notifications[i].time_since,
                    content: response.notifications[i].content,
                    href: response.notifications[i].href,
                    componentname: response.notifications[i].component_name,
					account_type: response.notifications[i].account_type,
                    refername: response.notifications[i].sender_name,
                    itemid: response.notifications[i].item_id,
                    senderid: (response.notifications[i].component_name === "follow") ? response.notifications[i].item_id : response.notifications[i].secondary_item_id,
                    userid: response.notifications[i].user_id,
                    notificationId: response.notifications[i].id,
					video_refer_name:response.notifications[i].video_refer_name

                };

                i++;
            }
            items.push({
                "item": item
            });
            var output = sezzwhoApp.mainInits.renderTpl(notificationTemplate, items[0]);
            $('.notification-template').html(output);
        } else {

        }

        setTimeout(function() {
            sezzwhoApp.notifications.blindEvent();
        }, 1000);
    },
    notifications_delete: function() {
        var id = $(this).attr('data-id');
        sezzwhoApp.nDel = id;
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'notification_id': id
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_single_mark, option, "notifications_delete");

    },
    notifications_delete_message: function(response) {
        var el = "#notification-" + sezzwhoApp.nDel;

        if (response.status === "ok") {
             sezzwhoApp.notifications.notifications_unread_count();
            $(el).remove();
        } else {

            myApp.addNotification({
                title: 'Invaild',
                subtitle: '',
                message: response.error,
                media: '<i class="fa fa-info-circle"></i>'
            });
        }


    },
	notifications_single_mark: function(id){
	 // var id = $(this).attr('data-id');
        sezzwhoApp.nMark = id;
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'notification_id': id
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.notifications_single_mark, option, "notifications_mark");
	
	},
	notifications_mark_message: function(response) {
        var el = "#notification-" + sezzwhoApp.nMark;

        if (response.status === "ok") {
             sezzwhoApp.notifications.notifications_unread_count();
            $(el).remove();
        } else {

            myApp.addNotification({
                title: 'Invaild',
                subtitle: '',
                message: response.error,
                media: '<i class="fa fa-info-circle"></i>'
            });
        }


    },
    refresh_notification: function(){
		
	}
	,blindEvent: function() {
        var bindings = [{
            element: '.notification-delete',
            event: 'click',
            handler: this.notifications_delete
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);

    },
    registerDeviceAndroid: function() {
     pushNotification = new PushNotification();
        if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    "senderID": "811636483141",
                    "ecb": "onNotification"
                });
        } else if (device.platform == 'blackberry10') {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    invokeTargetId: "replace_with_invoke_target_id",
                    appId: "replace_with_app_id",
                    ppgUrl: "replace_with_ppg_url", //remove for BES pushes
                    ecb: "pushNotificationHandler",
                    simChangeCallback: replace_with_simChange_callback,
                    pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                    launchApplicationOnPush: true
                });
        } else {
            pushNotification.register(
                tokenHandler,
                errorHandler, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onNotificationAPN"
                });
        }

        function successHandler(result) {
            console.log('result = ' + result);
        }

        function errorHandler(error) {
            console.log('error = ' + error);
        }

        function tokenHandler(result) {
            // Your iOS push server needs to know the token before it can push to this device
            // here is where you might want to send it the token for later use.
            console.log('device token = ' + result);
        }


    }, // End Android Notifications 
    registerDeviceIOS: function() {
        push = PushNotification.init({
            android: {
                senderID: "982786196868"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function(data) {
            //alert(data.registrationId);
            console.log(data.registrationId);
            sezzwhoApp.notifications.deviceRegister(data.registrationId, "ios_notification");
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            //alert(data.message);
			sezzwhoApp.notifications.getNotification();
        });

        push.on('error', function(e) {
            // e.message
        });

    },
    unregisterDeviceIos: function() {

        push.unregister(successHandler, errorHandler);


        function successHandler(e) {
            console.log(e);
        }

        function errorHandler(e) {
            console.log(e);
        }
    },
    unregisterDeviceAndroid: function() {
        pushNotification.unregister(successHandler, errorHandler);

        function successHandler(e) {
            console.log(e);
        }

        function errorHandler(e) {
            console.log(e);
        }
    },
    deviceRegister: function(id, type) {
        var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.save_device_id;
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'regID': id,
            'type': type
        };
        $.get(ajaxUrl, options, function(data) {
            console.log("ID register request performed");
        });
    },
	uploadVideoNotification: function(){
	   sezzwhoApp.uploadToken;
	 
	 /*  FCMPlugin.getToken(function(token){
    			 sezzwhoApp.uploadToken=token;
				});           */
	       
		   window.plugins.OneSignal.getIds(function(ids) {
				  var notificationObj = { contents: {en: "Your video is ready to view. You can now watch it."},
										  include_player_ids: [ids.userId]};
				  window.plugins.OneSignal.postNotification(notificationObj,
					function(successResponse) {
					  console.log("Notification Post Success:", successResponse);
					},
					function (failedResponse) {
					  console.log("Notification Post Failed: ", failedResponse);
					  alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
					}
				  );
				});
		   
		}
};

function onNotificationAPN(event) {
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

function onNotification(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                //$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
                sezzwhoApp.notifications.deviceRegister(e.regid, "android_notification");

            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                //$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/" + soundfile);
                my_media.play();
				sezzwhoApp.notifications.getNotification();
            } else { // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
					sezzwhoApp.notifications.getNotification();
                } else {
                    //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                sezzwhoApp.notifications.getNotification();
				}
            }

            //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            //$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
            //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}
sezzwhoApp.notifications = notification;