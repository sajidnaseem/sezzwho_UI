var  VidoeComponent = React.createClass({displayName: "VidoeComponent",
  getInitialState: function() {
    return {
      	avatar		: sezzwhoApp.userloginInfo.user.avatar,
      	title		: '',
	  	hashtag		: '',
    	id			:''
    };
  },	
  handleRecord : function (){
	sezzwhoApp.personalFeeds.recordVideo('whats-new');  
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
                                React.createElement("p", {className: "tabbar-label"}, "RE-SEZZME")
    
                        ), 
                        React.createElement("input", {type: "hidden", id: "re-videocontent"}), 
                        React.createElement("div", {className: "demo-progressbar-load-hide"}, 
                        React.createElement("p", {style: {height:'2px'}})
                        )
                    ), 
                    React.createElement("div", {className: "col-100"}, 
                        React.createElement("div", {className: "item-input"}, 
                         React.createElement("input", {type: "text", placeholder: "Video Title", id: "re-video-title", className: "record-input"})
                        )
                    ), 
                    React.createElement("div", {className: "col-100"}, 
                        React.createElement("div", {className: "item-input"}, 
                            React.createElement("input", {type: "text", placeholder: "Hashtag", id: "re-autocomplete-user", className: "record-input"})
                        ), 
                        React.createElement("div", {id: "re-review-rating"}, 
                            "Rate it: ", React.createElement("img", {src: "images/star_off.png", className: "star", id: "star1"}), 
                            React.createElement("img", {src: "images/star_off.png", className: "star", id: "star2"}), 
                            React.createElement("img", {src: "images/star_off.png", className: "star", id: "star3"}), 
                            React.createElement("img", {src: "images/star_off.png", className: "star", id: "star4"}), 
                            React.createElement("img", {src: "images/star_off.png", className: "star", id: "star5"})
                        )
    
                    ), 
                    React.createElement("input", {type: "hidden", id: "re-rating"}), 
                    React.createElement("input", {type: "hidden", id: "re-videobusiness"}), 
                    React.createElement("div", {className: "col-50"}
                    ), 
                     React.createElement("div", {className: "col-50"}, 
                        React.createElement("button", {id: "re-aw-whats-new-submit", className: "button button-fill lightgreen", style: {width:'100%'}, disabled: true}, React.createElement("i", {className: "fa fa-pencil"}), "Edit Post")
                     )	
                )  
		
		);
  }
});

ReactDOM.render(React.createElement(VidoeComponent, null),document.getElementById('sezzwho-re-record'));  
   