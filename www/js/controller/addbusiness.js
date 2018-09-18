var obj = [];
var addbusiness = {
    init: function() {
        this.bindEvent();

    },
    businessPage: function() {
        var contentData,
            videotitle 	= "",
            videocontent= "",
            rating 		= "",
            hashtag 	= "",
			links		= "";
			sezzwhoApp.postButton 			= false,
			sezzwhoApp.addLocationButton 	= true,
			sezzwhoApp.addReviewButton 		= false,
			sezzwhoApp.autoWhatsNew 		= false,
			sezzwhoApp.backAddbusiness = true;
		($("#video-title").val()=="") ? $("#video-title").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        ($("#autocomplete-user").val()=="") ? $("#autocomplete-user").addClass('danger-alert'):$("#video-title").removeClass('danger-alert');
        videotitle = sezzwhoApp.mainInits.matchUrl($$("#video-title").val());
        rating = $$("#rating").val();
		if(rating < 3) {
			myApp.alert("please select more than 3 star"); return false; }
			else { } 
        videocontent = $$("#videocontent").val();
        try{
		hashtag = $("#autocomplete-user").val().replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
       }
		catch(err){
			alert("Please add #/@ front of word");
			return false;
		}
	    if($("#autocomplete-website").val() === "")  { links = true;}
		else { links =$("#autocomplete-website").val();   }  
 
        contentData = {
            'avatar': sezzwhoApp.userloginInfo.user.avatar,
            'username': sezzwhoApp.userloginInfo.user.username,
            'userid': sezzwhoApp.userloginInfo.user.id,
            'videotitle': videotitle,
            'rating': rating,
            'hashtag': hashtag,
            'video': videocontent,
			'link' : links 
        };


        mainView.router.load({
            url: sezzwhoApp.pageUrl + 'addbusiness.html',
            force: true,
            context: contentData
        });
        //myApp.closeModal(); // 
  			 if ($$('.popup-record.modal-in').length > 0) { 
	    			myApp.closeModal(".popup-record");
				return false;
				}
    },
    closePopup: function() {
		sezzwhoApp.embedding.reset();
        $$(".demo-progressbar-load-hide").html('<p style="height:2px"></p>');
        $$(".record-input").val("");
        $$("#review-rating img").attr('src', 'images/star_off.png');
        $$("#post-a-review,#auto-post-a-review").attr("disabled", "disabled");
		$$('input#rating').attr( 'value', 0 );
        $("#auto-add-business,#auto-aw-whats-new-submit,#auto-post-business").prop("disabled", true);
		$(".auto-post input").prop('checked',false);
		sezzwhoApp.autoWhatsNew= false;
		sezzwhoApp.isUploading		= false,
		sezzwhoApp.isUploaded		= false;
     	sezzwhoApp.isStillUploading = false;
	
        if ($$('.popup-record.modal-in').length > 0) { 
	    myApp.closeModal(".popup-record");
		return false;
		}
    },
    initMap: function() {

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -33.8688,
                lng: 151.2195
            },
            zoom: 13
        });
        var input = /** @type {!HTMLInputElement} */ (
            document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }
            marker.setIcon( /** @type {google.maps.Icon} */ ({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
            var radioButton = document.getElementById(id);
            radioButton.addEventListener('click', function() {
                autocomplete.setTypes(types);
            });
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);

    },
    autoComplete: function(content) {
        //alert("auto Complete");
		//console.log(content);
		obj = content;
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?location=54.7226785,-113.7223949&key=AIzaSyBLD3-k-NncJrejPdZsx_82iqY6RN_ZbR4";
        var autocompleteStandaloneAjax = myApp.autocomplete({
            openIn: 'page', //open in page
            opener: $$('#autocomplete-standalone-ajax'), //link that opens autocomplete
            valueProperty: 'id', //object's "value" property name
            multiple: false, //allow multiple values
            textProperty: 'description', //object's "text" property name
            limit: 50,
            backOnSelect: true,
            preloader: true, //enable preloader
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
                    url: url,
                    method: 'GET',
                    dataType: 'json',
                    //send "query" to server. Useful in case you generate response dynamically
                    data: {
                        input: query
                    },
                    success: function(data) {
                        // Find matched items

                        for (var i = 0; i < data['predictions'].length; i++) {
                            results.push(data['predictions'][i]);
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
                $$('#autocomplete-standalone-ajax').find('.item-after').text(value[0].description);
                // Add item value to input value
				//alert("changed");
                $$('#autocomplete-standalone-ajax').find('input').val(value[0].description);
                sezzwhoApp.addbusiness.registerBusiness(value[0].description, content);
            }
        }); // autocomplete

        //End function	
    },
    registerBusiness: function(arg, content) {

        //event.preventDefault();

        //alert("fsd");
        
        txtInput = arg.split(",");


        var username = txtInput[0];

        var business_type = $("#businestype").val();

        console.log(username);

        var location = arg;

        if (!(username == "") && !(location == "")) {

            //code
            sezzwhoApp.showIndicator();


            jQuery.ajax({

                url: sezzwhoApp.homeUrl,

                type: 'POST',

                dataType: 'JSON',

                data: {
                    action: "wow_registration_page",
                    tagbusiness: username,
                    type: business_type,
                    loc: location
                },

                success: function(data) {

                    // var obj = jQuery.parseJSON(data);

                    console.log(data.username);
                    content.usercheck = data.userid;
                    content.usernameR = data.username;
                    sezzwhoApp.reviewContent = content;
                    sezzwhoApp.hideIndicator();
					$("#post-a-review,#auto-post-a-review").attr("disabled", false);	

                    //jQuery("#whats-new-submits").unbind(event.preventDefault());



                }

            });

        } // Check Fields


        //End fucntion
    },
    postBusinessReview: function() {
        console.log(sezzwhoApp.reviewContent);
        var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'content': sezzwhoApp.reviewContent
        };

        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_post_update_review, option, "postBusinessReview");

    },
	postAutoBusinessReview: function() {
        console.log(sezzwhoApp.reviewContent);
		    
      if(sezzwhoApp.isUploaded)
		 
		 { 
		 
		  $("#auto-post-a-review i").addClass("fa-spinner fa-spin  fa-fw").removeClass("fa-video-camera");
		  setTimeout(function(){  $("#auto-post-a-review i").removeClass("fa-spinner fa-spin  fa-fw").addClass("fa-video-camera"); }, 3000);
		 sezzwhoApp.reviewContent.video = $$("#videocontent").val();
	    var option = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'content': sezzwhoApp.reviewContent
        };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.activities_post_update_review, option, "postBusinessReview");
		}else{
		sezzwhoApp.isStillUploading = true;	
	 	sezzwhoApp.autoWhatsNew = true;
        sezzwhoApp.backAddbusiness = false;
		mainView.router.back();
     	myApp.addNotification({
     		title: 'Uploading...',
        	message: 'Stay tuned, uploading....',
			hold:3000
    	});

		}
    },
    doneReview: function(response) {
        if (response.status == "ok") {
            myApp.addNotification({
                title: 'Sezzwho',
                subtitle: 'Post Updated',
				hold : 7000, 
				button:{
				  text: 'close',
				  color: 'red',
				  close: true
				},
                message: 'Post updated successfully',
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
            sezzwhoApp.personalFeeds.getFeedActivities(); // Update personal feed 
           	sezzwhoApp.homeModules.refreshActivities(); // refresh following page
       	    sezzwhoApp.popularVideos.getPopularVideo(); // refresh popular page
			//Rest all data
            //sezzwhoApp.addbusiness.closePopup();
            sezzwhoApp.addbusiness.closePopup();
             if(sezzwhoApp.backAddbusiness)
		    mainView.router.back();
        } else {
            myApp.addNotification({
                title: 'Sezzwho',
                subtitle: 'Notification',
                message: response.error,
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
        }

    },
    bindEvent: function() {
        var bindings = [{
            element: '#add-business',
            event: 'click',
            handler: this.businessPage
        }, {
            element: '#post-a-review',
            event: 'click',
            handler: this.postBusinessReview
        },{
            element: '#auto-add-business',
            event: 'click',
            handler: this.businessPage
        }, {
            element: '#auto-post-a-review',
            event: 'click',
            handler: this.postAutoBusinessReview
        }
		];

        sezzwhoApp.mainInits.bindEvents(bindings);
    }


};

sezzwhoApp.addbusiness = addbusiness;