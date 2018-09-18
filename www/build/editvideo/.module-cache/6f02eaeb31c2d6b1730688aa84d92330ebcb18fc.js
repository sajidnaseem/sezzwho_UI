define(function(){
	return {
	init: function (){
var  VidoeComponent = React.createClass({displayName: "VidoeComponent",
  getInitialState: function() {
    return {
      	avatar		: sezzwhoApp.userloginInfo.user.avatar,
      	title		: '',
	  	hashtag		: '',
    	id			: sezzwhoApp.editID
    };
  },
  componentDidMount: function() {
	  var options = {
					'key'         	: sezzwhoApp.jsonpcb,
					'cookie'      	: sezzwhoApp.cookie,
					'include'  		: sezzwhoApp.editID
					};
					
	var	sezzwhoUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.sz_single_activity_post		
	  
    this.serverRequest = $.get(sezzwhoUrl, options, function (response) {
	 text=sezzwhoApp.mainInits.getsezzwhoContents(response.activities[0].content);
	 console.log(response);
      this.setState({
			title       : text.title,
			hashtag     : text.hashtag,
			ziggeocode  : text.ziggeoCode
      });
    }.bind(this));
  },	
  handleRecord : function (){
	sezzwhoApp.personalFeeds.recordVideo('whats-record');  
  },
   handleChangeTitle: function(event) {
    this.setState({title: event.target.value});
  },
  handleChangeHashtag: function(event) {
    this.setState({hashtag: event.target.value});
  },
  handleSave : function(){
	   			var contentData  	=	"",
					 videotitle 	=	"",
					 videocontent	=	"",
					 hashtag		=	"";	
					 hashtag 		= this.state.hashtag.replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
	   				 videocontent 	= (typeof(sezzwhoApp.ziggeoCode) == "undefined") ? this.state.ziggeocode : sezzwhoApp.ziggeocode;
					 contentData 	= '<div class="videotitle">' + this.state.title + '</div>' +
					 				  '<ziggeo ziggeo-width="320" ziggeo-height="240" ziggeo-responsive="true" ziggeo-video="' + videocontent + '"></ziggeo>' +
									  '<div class="hashtags">' + hashtag + '</div>';
	   var options ={
						  'key'         : sezzwhoApp.jsonpcb,
						  'user_id'     : sezzwhoApp.userloginInfo.user.id,
						  'cookie'      : sezzwhoApp.cookie,
						  'content'     : contentData 
					  };
	   var ajaxurl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.activities_post_update;
	   this.serverRequest =  $.post(ajaxurl, options, function(response) { 
        var lastGist = response;
		   
		   sezzwhoApp.personalFeeds.getFeedActivities();
		   
			myApp.addNotification({
				title: 'Post',
				message: 'updated successfully'
				});
	   });  
  },
  render: function() {
    return (
		  React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-100"}, 
                            React.createElement("div", {className: "recording-userinfo"}, 
                                React.createElement("div", {className: "card-header no-border"}, 
                                React.createElement("div", {className: "recored-facebook-avatar"}, React.createElement("img", {src: this.state.avatar, width: "34", height: "34"})), 
                                React.createElement("div", {className: "whats-new-info"})
                                )
                            )
    
                        ), 
                    React.createElement("div", {className: "col-100"}, 
                        React.createElement("center", null, 
                         React.createElement("i", {onClick: this.handleRecord, id: "re-record", className: "fa fa-video-camera fa-4x"}), 
                                React.createElement("p", null, 
								React.createElement("video", {width: "100%", height: "267", preload: "none", id: "re-change-image", poster: "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/"+(this.state.ziggeocode)+"/image", controls: true}, 
					React.createElement("source", {id: "re-change-video", src: "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" + (this.state.ziggeocode) + "/video.mp4", type: "video/mp4"}), " "), "  "), 
								React.createElement("p", {className: "tabbar-label"}, "RE-SEZZME")
    
                        ), 
                        React.createElement("input", {type: "hidden", id: "re-videocontent"}), 
                        React.createElement("div", {className: "record-progressbar-load-hide"}, 
                        React.createElement("p", {style: {height:'2px'}})
                        )
                    ), 
                    React.createElement("div", {className: "col-100"}, 
                        React.createElement("div", {className: "item-input"}, 
                         React.createElement("input", {type: "text", placeholder: "Video Title", id: "re-video-title", value: this.state.title.replace(/^<div[^>]*>|<\/div>$/g, ''), className: "record-input", onChange: this.handleChangeTitle})
                        )
                    ), 
                    React.createElement("div", {className: "col-100"}, 
                        React.createElement("div", {className: "item-input"}, 
                            React.createElement("input", {type: "text", placeholder: "Hashtag", id: "re-autocomplete-user", value: this.state.hashtag.replace(/^<div[^>]*>|<\/div>$/g, ''), className: "record-input", onChange: this.handleChangeHashtag})
                        )
                   
    
                    ), 
                    React.createElement("input", {type: "hidden", id: "re-rating"}), 
                    React.createElement("input", {type: "hidden", id: "re-videobusiness"}), 
                    React.createElement("div", {className: "col-50"}
                    ), 
                     React.createElement("div", {className: "col-50"}, 
                        React.createElement("button", {id: "re-aw-whats-new-submit", onClick: this.handleSave, className: "button button-fill lightgreen", style: {width:'100%'}}, React.createElement("i", {className: "fa fa-pencil"}), "Edit Post")
                     )	
                )  
		
		);
  }
});

ReactDOM.render(React.createElement(VidoeComponent, null),document.getElementById('sezzwho-re-record'));  
	}
	};
});