var searchTimeout, mySearchbar;
var search = {
    init: function() {
        //this.searchuser();
        this.bindEvent();
    },
    searchuser: function() {
        var autocompleteDropdownAjax = myApp.autocomplete({
            //input: '#autocomplete-user',
            opener: $$('#autocomplete-user'),
            openIn: 'popup',
            preloader: true, //enable preloader,
            backOnSelect: true, //go back after we select something
            valueProperty: 'user_id', //object's "value" property name
            textProperty: 'username', //object's "text" property name
            limit: 20, //limit to 20 results
            source: function(autocomplete, query, render) {
                var results = [];
                if (query.length === 0) {
                    render(results);
                    return;
                }
                // Show Preloader
                autocomplete.showPreloader();
                // Do Ajax request to Autocomplete data
                $$.ajax({
                    url: sezzwhoApp.url + "members",
                    method: 'GET',
                    dataType: 'json',
                    //send "query" to server. Useful in case you generate response dynamically
                    data: {
                        search_terms: query,
                        key: sezzwhoApp.jsonpcb
                    },
                    success: function(data) {
                        // Find matched items
                        //console.log(data);
                        for (var i = 0; i < data.members.length; i++) {
                            //if (data.members[i].username.toLowerCase().indexOf(query.toLowerCase()) >= 0) 
                            results.push(data.members[i].username);
                        }
                        // Hide Preoloader
                        autocomplete.hidePreloader();
                        // Render items by passing array with result items
                        render(results);
                    }
                });
            },
            onChange: function(autocomplete, value) {
                // Add item text value to item-after
                $$('#autocomplete-user').find('.item-after').text("@" + value[0]);
                // Add item value to input value
                $$('#autocomplete-user').find('input').val("@" + value[0]);
                $("#refer-user").prop('disabled', false);
            }
        });
        //end function
    },
    initSearchbar: function() {
        mySearchbar = myApp.searchbar('.searchbar.custom-search', {
            customSearch: true,
            onDisable: function(s) {
                $$('.popup-search input[type="search"]')[0].blur();
                myApp.closeModal('.popup-search');
            },
            onSearch: function(s, q) {
                sezzwhoApp.searchs.searchQuery(s.query);
            },
            onClear: function(s) {
                $$('.popup-search .search-results').html('');
                $$('.popup-search .search-results-activity').html('');
            }
        });
        myApp.popup(".popup-search");
        $$('.popup').on('open', function() {
            mySearchbar.enable();
        });
        $$('.popup').on('opened', function() {
            $$('.popup-search input[type="search"]')[0].focus();
        });
        //End Function
    },
    searchQuery: function(s) {
        console.log("step2");
        if (s.trim() === '') {
            $$('.popup-search .search-results-activity').html('');
            $$('.popup-search .search-results').html('');
            return;
        }
        if (searchTimeout) clearTimeout(searchTimeout);
        $$('.popup-search .preloader').show();
        searchTimeout = setTimeout(function() {
            //	sezzwhoApp.searchs.bboss_global_search_ajax(s);
            var option = {
                'key': sezzwhoApp.jsonpcb,
                'cookie': sezzwhoApp.cookie,
                'search_terms': encodeURIComponent(s)
            };
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.members, option, "searchResult");
            sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.following, option, "searchResult");
        }, 300);
        //End Function
    },
    bboss_global_search_ajax: function(s) {
        var q = sezzwhoApp.homeUrl + "search_term=" + s + '&nonce=daf1b135ca';
        $.ajax({
            url: sezzwhoApp.homeUrl,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: "bboss_global_search_ajax",
                nonce: "daf1b135ca",
                search_term: s
            },
            success: function(results) {
                var html = '';
                //results = JSON.parse(results);
                console.log(results);
                $$('.popup-search .preloader').hide();
                /*   if (results.query.count > 0) {
                var places = results.query.results.place;
                html = myApp.searchResultsTemplate(places);
            }
            $$('.popup .search-results').html(html);
        */
            }
        });
    },
    displayResult: function(response) {
        var html = '';
        //     results = JSON.parse(results);
        //console.log(results);
        $$('.popup-search .preloader').hide();
        var output;
        if (response.status === "ok" && typeof(response.members) !== "undefined") {
            output = sezzwhoApp.mainInits.renderTpl(searchTemplate, response.members);
            $$('.popup-search .search-results').html(output);
            sezzwhoApp.searchs.init();
        } else {
			if (response.status !== "error") {
				var items = [],
					item = [];
				for (var i = 0; i < response.activities.length; i++) {
					text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[i].content);
					// console.log(text);
					item[i] = {
						nickname: response.activities[i].user[0].display_name,
						avatar: response.activities[i].user[0].avatar,
						user_id: response.activities[i].user[0].user_id,
						time: response.activities[i].time_since,
						title: text.title,
						hashtag: text.hashtag,
						ziggeocode: text.ziggeoCode,
						type: ((response.activities[i].type == "Member_review" || response.activities[i].type == "activity_update") ? true : false),
						commentLenght: (typeof(response.activities[i].comments) != "undefined") ? response.activities[i].comments.length : 0,
						comments: (typeof(response.activities[i].comments) != "undefined") ? true : false,
						page: response.page,
						id: response.activities[i].activity_id,
						action: response.activities[i].action,
						name: "personal",
						likes_count: (typeof(response.activities[i].likes_count) === "string") ? 0 : Object.keys(response.activities[i].likes_count).length,
						like_button: response.activities[i].likes_button,
						refer_count: response.activities[i].refer_count,
						web_link: (response.activities[i].web_link === "") ? false : sezzwhoApp.mainInits.matchUrl(response.activities[i].web_link),
						location: (response.activities[i].location === true)? sezzwhoApp.mainInits.mapUrl(response.activities[i].address) : false,
						share_count : response.activities[i].share_count, 
						is_follow : response.activities[i].followCheck,
						account_type: response.activities[i].user[0].account_type
	
					};
				} // End for loop
				items.push({
					"item": item
				});
				output = sezzwhoApp.mainInits.renderTpl(activityTemplate, items[0]);
				$$('.popup-search .search-results-activity').html(output);
				sezzwhoApp.commonFunc.blindEvent();
			}
        }
        //End Function
    },
    bindEvent: function() {
        var bindings = [{
            element: '#following-search input, #personal-search input,#detail-search input,#follower-search-list input,#following-search-list input',
            event: 'focus',
            handler: this.initSearchbar
        }, {
            element: '.search-follow',
            event: 'click',
            handler: sezzwhoApp.homeModules.startStopFollowing
        }, {
            element: '.sezzwho-searchbar',
            event: 'click',
            handler: this.initSearchbar
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
        //End Function
    }
};
sezzwhoApp.searchs = search;