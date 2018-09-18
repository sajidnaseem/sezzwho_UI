define(function() {
    return {
        initEdit: function() {
            var VidoeComponent = React.createClass({
                getInitialState: function() {
                    return {
                        avatar: sezzwhoApp.userloginInfo.user.avatar,
                        title: '',
                        hashtag: '',
                        id: sezzwhoApp.editID
                    };
                },
                componentDidMount: function() {
					sezzwhoApp.showIndicator();
                    var options = {
                        'key': sezzwhoApp.jsonpcb,
                        'cookie': sezzwhoApp.cookie,
                        'include': sezzwhoApp.editID
                    };
                    var sezzwhoUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.sz_single_activity_post
                    this.serverRequest = $.get(sezzwhoUrl, options, function(response) {
                        text = sezzwhoApp.mainInits.getsezzwhoContents(response.activities[0].content);
                        //console.log(response);
						sezzwhoApp.hideIndicator();
                        this.setState({
                            title: text.title.replace(/^<div[^>]*>|<\/div>$/g, ''),
                            hashtag: text.hashtag.replace(/^<div[^>]*>|<\/div>$/g, ''),
                            ziggeocode: text.ziggeoCode
                        });
                    }.bind(this));
                },
                handleRecord: function() {
                    sezzwhoApp.personalFeeds.recordVideo('whats-record');
                },
                handleChangeTitle: function(event) {
                    this.setState({
                        title: event.target.value
                    });
                },
                handleChangeHashtag: function(event) {
                    this.setState({
                        hashtag: event.target.value
                    });
                },
                handleSave: function() {
                    var contentData = "",
                        videotitle = "",
                        videocontent = "",
                        hashtag = "";
                    hashtag = this.state.hashtag.replace(/["~!$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\-]+/g, '').match(/(?:\#(\w+))|(?:\@(\w+))/g).toString().replace(/,/g, ' ');
                    videocontent = (typeof(sezzwhoApp.ziggeoCode) == "undefined") ? this.state.ziggeocode : sezzwhoApp.ziggeocode;
                    contentData = '<div class="videotitle">' + this.state.title + '</div>' + '<ziggeo ziggeo-width="320" ziggeo-height="240" ziggeo-responsive="true" ziggeo-video="' + videocontent + '"></ziggeo>' + '<div class="hashtags">' + hashtag + '</div>';
                    
					var el=".activity-" + this.state.id;
					var img = "http://embed.ziggeo.com/v1/applications/KeyREQUIRED/videos/"+videocontent+"/image";
					var videolink ="http://embed.ziggeo.com/v1/applications/KeyREQUIRED/videos/"+videocontent+"/video.mp4";
					console.log(el);
					$(el).find(".stretch").attr("src",img);
					$(el).find(".stretch").attr("data-url",videolink);
					$(el).find(".facebook-date").text("1 sec ago");
					$(el).find(".videotitle").text(this.state.title);
					$(el).find(".hashtags").text(hashtag);
					var options = {
                        'key': sezzwhoApp.jsonpcb,
                        'user_id': sezzwhoApp.userloginInfo.user.id,
                        'cookie': sezzwhoApp.cookie,
                        'content': contentData,
                        'edit': true,
                        'activity_id': this.state.id
                    };
                    var ajaxurl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.activities_post_update;
                    this.serverRequest = $.post(ajaxurl, options, function(response) {
                        var lastGist = response;
                        sezzwhoApp.personalFeeds.getFeedActivities();
                        myApp.closeModal(".popup-re-record");
                        myApp.addNotification({
                            title: 'Post',
                            message: 'updated successfully'
                        });
                    });
                },
                render: function() {
                    return (<div className="row">
                    <div className="col-100">
                            <div className="recording-userinfo">
                                <div className="card-header no-border">
                                <div className="recored-facebook-avatar"><img src={this.state.avatar} width="34" height="34" /></div>
                                <div className="whats-new-info"></div>
                                </div>
                            </div>
    
                        </div>
                    <div className="col-100" >
                        <center>
                         <i onClick={this.handleRecord} id="re-record" className="fa fa-video-camera fa-4x"></i>
                                <p>
								<video width="100%" height="267"  preload="none" id="re-change-image" poster={"http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/"+(this.state.ziggeocode)+"/image" } controls> 
					<source id="re-change-video" src={"http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" + (this.state.ziggeocode) + "/video.mp4" } type="video/mp4" /> </video>  </p>
								<p className="tabbar-label">Re-shot</p>
    
                        </center> 
                        <input type="hidden" id="re-videocontent" />
                        <div className="record-progressbar-load-hide">
                        <p style={{height:'2px'}}></p>
                        </div>
                    </div>
                    <div className="col-100">
                        <div className="item-input">
                         <input type="text" placeholder="Video Title" id="re-video-title" value={this.state.title} className="record-input" onChange={this.handleChangeTitle} />
                        </div>
                    </div> 
                    <div className="col-100">
                        <div className="item-input">
                            <input type="text" placeholder="Hashtag" id="re-autocomplete-user" value={this.state.hashtag} className="record-input" onChange={this.handleChangeHashtag} />
                        </div>
                   
    
                    </div>
                    <input type="hidden" id="re-rating" />
                    <input type="hidden" id="re-videobusiness" />
                    <div className="col-50">
                    </div>
                     <div className="col-50">
                        <button id="re-aw-whats-new-submit" onClick={this.handleSave} className="button button-fill lightgreen" style={{width:'100%'}} ><i className="fa fa-pencil"></i>Edit Post</button>
                     </div>	
                </div>);
                }
            });
            ReactDOM.render(<VidoeComponent />, document.getElementById('sezzwho-re-record'));
        }
    };
});