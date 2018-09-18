var followerList = {
		init: function(query) {
			this.getFollowerList(query);
		},
		getFollowerList : function(query){
		sezzwhoApp.followerList.user_id = 	query.id;
		var options = {
            'key': sezzwhoApp.jsonpcb,
            'user_id': sezzwhoApp.followerList.user_id,
            'cookie': sezzwhoApp.cookie,
            'per_page': 10,
            'page':1
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_follower_list, options, "followerList");
        
		},
		displayFollowerList: function(response){
			if(response.status !== "error"){
			var index = (response.page-1) * response.per_page,
				limit = (response.page === 1)? response.list.length : ((response.page-1)*(Object.keys(response.list).length) + response.per_page);
			  sezzwhoApp.followerList.followerResponse = response;
			  sezzwhoApp.followerList.has_more_items = response.has_more_items;
			 	var items = [],
                    item = []
					i=0;
					for (index; index < limit; index++) {
						item[i] = {
						   'username': response.list[index].data.user_login,
						   'user_id' : response.list[index].data.ID,
						   'user_registered':response.list[index]['data'].user_registered,
						   'avatar':sezzwhoApp.mainInits.addhttp(response.list[index]['data'].avatar),
						   'bio':response.list[index]['data'].bio,
						   'count':response.list[index]['data'].counts,
						   'nickname': response.list[index]['data'].display_name,
						   'account_type':response.list[index]['data'].accountType
						};
						i++;
					}
			   items.push({
                    "item": item
                });
			   var output = sezzwhoApp.mainInits.renderTpl(followerTemplate, items[0]);
                $('.follower-list').append(output);
				
				if(response.total_limit < 10){
					$$('.infinite-scroll-preloader-follower').remove();
				}
				
			}
			else{
							
               $('.follower-list').html("<span class='no-follower-list'>No follower</span>");
			   $$('.infinite-scroll-preloader-follower').remove();
			}
			sezzwhoApp.hideIndicator();
		},
		loadmore: function() {

        // Loading flag
        var loading = false;

        // Last loaded index

        // Max items to load
        var maxItems = sezzwhoApp.followerList.has_more_items;

        // Append items per load
        var itemsPerLoad = 10;
        var page = 2;
        loadmore = true;

        // Attach 'infinite' event handler
        $$('.infinite-scroll-follower').on('infinite', function() {

            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;
             
            // Emulate 1s loading
            setTimeout(function() {
                // Reset loading flag
                loading = false;
                maxItems = sezzwhoApp.followerList.has_more_items;
                if (maxItems == false) {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll-follower'));
                    // Remove preloader
                    $$('.infinite-scroll-preloader-follower').remove();
                    return;
                }
               
                // Generate new items HTML
                var html = '';

                var options = {
                    'key': sezzwhoApp.jsonpcb,
                    'user_id': sezzwhoApp.followerList.user_id,
                    'cookie': sezzwhoApp.cookie,
                    'page': page,
                    'per_page': itemsPerLoad

                };
                sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.sz_follower_list, options, "followerLoadMore");


                //console.log(sezzwhoApp.activityFeedData.has_more_items);
                // Append new items
                //$$('.load-result').append(html);

                // Update last loaded index
                if (sezzwhoApp.followerList.has_more_items == true) {
                    page += 1;
                    maxItems = true;
                } else {
                    maxItems = false;
                }


            }, 1000);
        });



        //End Function
    }
};

sezzwhoApp.followerList = followerList;