var singleActivity = {
    init: function(query) {
        var that = this;
        this.blindEvent();
        that.getSingleActivity(query.item);
		 sezzwhoApp.notifications.notifications_single_mark(query.markID);
		setTimeout(function(){ sezzwhoApp.commonFunc.blindEvent(); }, 1000);
    },
    getSingleActivity: function(id) {
        var options = {
            'key': sezzwhoApp.jsonpcb,
            'include': id,
            'cookie': sezzwhoApp.cookie,
            'user_id': sezzwhoApp.userloginInfo.user.id
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_single_activity_post, options, "singlePage");
    },
    displayActivity: function(response) {
        var items = [],
            item = [],
            count,
			html = '<div class="none-comment"><i class="fa fa-newspaper-o  fa-5x"></i><p>Oops! This activity has been deleted.</p></div>';
        var el = $('.single-result');
        sezzwhoApp.singleData = response;
        if (response.status !== "error") {
        for (var i = 0; i < response.activities.length; i++) {
            text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
            item[i] = {
                nickname: response.activities[i].user[0].username,
                avatar: response.activities[i].user[0].avatar,
                user_id: response.activities[i].user[0].user_id,
                time: response.activities[i].time_since,
                title: text.title,
                hashtag: text.hashtag,
                ziggeocode: text.ziggeoCode,
                type: ((response.activities[i].type == "Member_review" || response.activities[i].type == "activity_update") ? true : false),
                commentLenght: (typeof(response.activities[i].comments) !== "undefined") ? response.activities[i].comments.length : 0,
                comments: (typeof(response.activities[i].comments) !== "undefined") ? true : false,
                page: response.page,
                id: response.activities[i].activity_id,
                action: response.activities[i].action,
                name: "Activity",
                likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
                like_button: response.activities[i].likes_button,
                refer_count: response.activities[i].refer_count,
                web_link: sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
				location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address)  : false ,
				share_count: response.activities[i].share_count,
				is_follow : response.activities[i].followCheck,
				account_type: response.activities[i].user[0].account_type
            };
            i++;
        } // while  loop
        items.push({
            "item": item
        });
        //console.log(JSON.stringify(items));
        var output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
        el.html(output);
		}
		else{
			el.html(html);
		}
    },
    blindEvent: function() {
        var bindings = [{
            element: '',
            event: 'click',
            handler: ''
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }
};
sezzwhoApp.singlePage = singleActivity;