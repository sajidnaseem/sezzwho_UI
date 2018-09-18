define(function() {
	return {
		initSetting: function() {
			var SettingComponent = React.createClass({
				getInitialState: function() {
					return {
						email: '',
						mention: '',
						reply: '',
						follow: '',
						like: '',
						refer: '',
						error: ''
					};
				},
				componentDidMount: function() {
					document.getElementById('sezzwho-setting').setAttribute('id', 'sezzwho-setting-old');
					myApp.showIndicator();
					var sourceUrl=sezzwhoApp.url + "settings_get_notifications/?";
					var options = {
						user_id: sezzwhoApp.userloginInfo.user.id,
						cookie: sezzwhoApp.cookie,
						key: sezzwhoApp.jsonpcb
					};
					this.serverRequest = $.get(sourceUrl, options, function(result) {
						//console.log(result);
						myApp.hideIndicator();
						if (result.settings.notification_activity_new_mention === "yes") {
							$(".mentionChk").prop("checked", true);
						}
						if (result.settings.notification_activity_new_reply === "yes") {
							$(".repChk").prop("checked", true);
						}
						if (result.settings.notification_starts_following === "yes") {
							$(".followChk").prop("checked", true);
						}
						if (result.settings.notification_starts_like === "yes") {
							$(".likeChk").prop("checked", true);
						}
						if (result.settings.notification_starts_refer === "yes") {
							$(".notifChk").prop("checked", true);
						}
						this.setState({
							mention: result.settings.notification_activity_new_mention,
							reply: result.settings.notification_activity_new_reply,
							follow: result.settings.notification_starts_following,
							like: result.settings.notification_starts_like,
							refer: result.settings.notification_starts_refer
						});
					}.bind(this));
				},
				handleSave: function() {
					var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.settings_update_notifications;
					var options = {
						key: sezzwhoApp.jsonpcb,
						cookie: sezzwhoApp.cookie,
						notification_activity_new_mention: this.state.mention,
						notification_activity_new_reply: this.state.reply,
						notification_starts_following: this.state.follow,
						notification_starts_like: this.state.like,
						notification_starts_refer: this.state.refer
					};
					$.get(ajaxUrl, options, function(res) {
						if (res.status === 'error') {
							myApp.addNotification({
								hold:7000,
								title: 'Error',
								message: res.error
							});
						} else {
							myApp.addNotification({
								hold:7000,
								title: 'Successfull',
								message: 'Successfully! updated'
							});
						}
					});
				},
				checkFuncMention: function(event) {
					var val = ($(".mentionChk").prop("checked")) ? "no" : "yes";
					this.setState({
						mention: val
					});
				},
				checkFuncRep: function(event) {
					var val = ($(".repChk").prop("checked")) ? "no" : "yes";
					this.setState({
						reply: val
					});
				},
				checkFuncFollow: function(event) {
					var val = ($(".followChk").prop("checked")) ? "no" : "yes";
					this.setState({
						follow: val
					});
				},
				checkFuncLike: function(event) {
					var val = ($(".likeChk").prop("checked")) ? "no" : "yes";
					this.setState({
						like: val
					});
				},
				checkFuncRefer: function(event) {
					var val = ($(".notifChk").prop("checked")) ? "no" : "yes";
					console.log(val);
					this.setState({
						refer: val
					});
				},
				render: function() {
					return (<div className="list-block inputs-list">
											<ul>
												<li>
												  <div className="item-content">
													<div className="item-media mention-icon">@</div>
													<div className="item-inner">
													  <div className="item-title label">A member mentions you in an update using "@username"</div>
													  <div className="item-input">
														<label className="label-switch">
														  <input id="mentionChk" className="mentionChk" type="checkbox"  />
														  <div className="checkbox" onClick={this.checkFuncMention} ></div>
														</label>
													  </div>
													</div>
												  </div>
												</li>
												<li>
												  <div className="item-content">
													<div className="item-media"><i className="fa fa-comments-o fa-lg color-lightgreen"></i></div>
													<div className="item-inner">
													  <div className="item-title label">A member replied to a video you have posted</div>
													  <div className="item-input">
														<label className="label-switch">
														  <input id="repChk" className="repChk" type="checkbox" />
														  <div className="checkbox"  onClick={this.checkFuncRep}></div>
														</label>
													  </div>
													</div>
												  </div>
												</li>
												<li>
												  <div className="item-content">
													<div className="item-media"><i className="fa fa-user-plus fa-lg color-blue"></i></div>
													<div className="item-inner">
													  <div className="item-title label">A member starts following your activity</div>
													  <div className="item-input">
														<label className="label-switch">
														  <input id="followChk" className="followChk" type="checkbox" />
														  <div className="checkbox" onClick={this.checkFuncFollow}></div>
														</label>
													  </div>
													</div>
												  </div>
												</li>
												  <li>
												  <div className="item-content">
													<div className="item-media"><i className="fa fa-thumbs-o-up fa-lg color-orange"></i></div>
													<div className="item-inner">
													  <div className="item-title label">A member likes your activity</div>
													  <div className="item-input">
														<label className="label-switch">
														  <input id="likeChk" className="likeChk" type="checkbox" />
														  <div className="checkbox" onClick={this.checkFuncLike}></div>
														</label>
													  </div>
													</div>
												  </div>
												</li>
												  <li>
												  <div className="item-content">
													<div className="item-media"><i className="fa fa-share-square-o fa-lg color-gray"></i></div>
													<div className="item-inner">
													  <div className="item-title label">A member recommended something to you</div>
													  <div className="item-input">
														<label className="label-switch" >
														  <input id="notifChk" className="notifChk" type="checkbox" />
														  <div className="checkbox" onClick={this.checkFuncRefer}></div>
														</label>
													  </div>
													</div>
												  </div>
												</li>
											  </ul>
											  <div className="content-block"><a href="#" onClick={this.handleSave} className="button form-from-json button-fill">Save</a></div>   
										   </div>);
				}
			});
		
			ReactDOM.render(<SettingComponent  />, document.getElementById('sezzwho-setting'));
			//ReactDOM.render(<SettingComponent source="API LINK?" />, document.getElementById('sezzwho-setting'));
		}
	};
});