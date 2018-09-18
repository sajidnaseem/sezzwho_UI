var  reRecordVideo = React.createClass({displayName: "reRecordVideo",
  render: function() {
    return (
		  React.createElement("div", {class: "row"}, 
                    React.createElement("div", {class: "col-100"}, 
                            React.createElement("div", {class: "recording-userinfo"}, 
                                React.createElement("div", {class: "card-header no-border"}, 
                                React.createElement("div", {class: "recored-facebook-avatar"}, React.createElement("img", {src: "", width: "34", height: "34"})), 
                                React.createElement("div", {class: "whats-new-info"})
                                )
                            )
    
                        ), 
                    React.createElement("div", {class: "col-100"}, 
                        React.createElement("center", null, 
                         React.createElement("i", {onclick: "sezzwhoApp.personalFeeds.recordVideo('whats-new')", id: "re-record", class: "fa fa-video-camera fa-4x"}), 
                                React.createElement("p", {class: "tabbar-label"}, "RE-SEZZME")
    
                        ), 
                        React.createElement("input", {type: "hidden", id: "re-videocontent"}), 
                        React.createElement("div", {class: "demo-progressbar-load-hide"}, 
                        React.createElement("p", {style: "height:2px"})
                        )
                    ), 
                    React.createElement("div", {class: "col-100"}, 
                        React.createElement("div", {class: "item-input"}, 
                         React.createElement("input", {type: "text", placeholder: "Video Title", id: "re-video-title", class: "record-input"})
                        )
                    ), 
                    React.createElement("div", {class: "col-100"}, 
                        React.createElement("div", {class: "item-input"}, 
                            React.createElement("input", {type: "text", placeholder: "Hashtag", id: "re-autocomplete-user", class: "record-input"})
                        ), 
                        React.createElement("div", {id: "re-review-rating"}, 
                            "Rate it: ", React.createElement("img", {src: "images/star_off.png", class: "star", id: "star1"}), 
                            React.createElement("img", {src: "images/star_off.png", class: "star", id: "star2"}), 
                            React.createElement("img", {src: "images/star_off.png", class: "star", id: "star3"}), 
                            React.createElement("img", {src: "images/star_off.png", class: "star", id: "star4"}), 
                            React.createElement("img", {src: "images/star_off.png", class: "star", id: "star5"})
                        )
    
                    ), 
                    React.createElement("input", {type: "hidden", id: "re-rating"}), 
                    React.createElement("input", {type: "hidden", id: "re-videobusiness"}), 
                    React.createElement("div", {class: "col-50"}
                    ), 
                     React.createElement("div", {class: "col-50"}, 
                        React.createElement("button", {id: "re-aw-whats-new-submit", class: "button button-fill lightgreen", style: "width:100%;", disabled: true}, React.createElement("i", {class: "fa fa-pencil"}), "Edit Post")
                     )	
                )  
		
		);
  }
});

ReactDOM.render(React.createElement("reRecordVideo", null),document.getElementById('sezzhwo-re-record'));  
   