define(function() {
	return {
		initSetting: function() {
			var SettingComponent = React.createClass({displayName: "SettingComponent",
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
					return (React.createElement("div", {className: "list-block inputs-list"}, 
											React.createElement("ul", null, 
												React.createElement("li", null, 
												  React.createElement("div", {className: "item-content"}, 
													React.createElement("div", {className: "item-media mention-icon"}, "@"), 
													React.createElement("div", {className: "item-inner"}, 
													  React.createElement("div", {className: "item-title label"}, "A member mentions you in an update using \"@username\""), 
													  React.createElement("div", {className: "item-input"}, 
														React.createElement("label", {className: "label-switch"}, 
														  React.createElement("input", {id: "mentionChk", className: "mentionChk", type: "checkbox"}), 
														  React.createElement("div", {className: "checkbox", onClick: this.checkFuncMention})
														)
													  )
													)
												  )
												), 
												React.createElement("li", null, 
												  React.createElement("div", {className: "item-content"}, 
													React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-comments-o fa-lg color-lightgreen"})), 
													React.createElement("div", {className: "item-inner"}, 
													  React.createElement("div", {className: "item-title label"}, "A member replied to a video you have posted"), 
													  React.createElement("div", {className: "item-input"}, 
														React.createElement("label", {className: "label-switch"}, 
														  React.createElement("input", {id: "repChk", className: "repChk", type: "checkbox"}), 
														  React.createElement("div", {className: "checkbox", onClick: this.checkFuncRep})
														)
													  )
													)
												  )
												), 
												React.createElement("li", null, 
												  React.createElement("div", {className: "item-content"}, 
													React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-user-plus fa-lg color-blue"})), 
													React.createElement("div", {className: "item-inner"}, 
													  React.createElement("div", {className: "item-title label"}, "A member starts following your activity"), 
													  React.createElement("div", {className: "item-input"}, 
														React.createElement("label", {className: "label-switch"}, 
														  React.createElement("input", {id: "followChk", className: "followChk", type: "checkbox"}), 
														  React.createElement("div", {className: "checkbox", onClick: this.checkFuncFollow})
														)
													  )
													)
												  )
												), 
												  React.createElement("li", null, 
												  React.createElement("div", {className: "item-content"}, 
													React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-thumbs-o-up fa-lg color-orange"})), 
													React.createElement("div", {className: "item-inner"}, 
													  React.createElement("div", {className: "item-title label"}, "A member likes your activity"), 
													  React.createElement("div", {className: "item-input"}, 
														React.createElement("label", {className: "label-switch"}, 
														  React.createElement("input", {id: "likeChk", className: "likeChk", type: "checkbox"}), 
														  React.createElement("div", {className: "checkbox", onClick: this.checkFuncLike})
														)
													  )
													)
												  )
												), 
												  React.createElement("li", null, 
												  React.createElement("div", {className: "item-content"}, 
													React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-share-square-o fa-lg color-gray"})), 
													React.createElement("div", {className: "item-inner"}, 
													  React.createElement("div", {className: "item-title label"}, "A member recommended something to you"), 
													  React.createElement("div", {className: "item-input"}, 
														React.createElement("label", {className: "label-switch"}, 
														  React.createElement("input", {id: "notifChk", className: "notifChk", type: "checkbox"}), 
														  React.createElement("div", {className: "checkbox", onClick: this.checkFuncRefer})
														)
													  )
													)
												  )
												)
											  ), 
											  React.createElement("div", {className: "content-block"}, React.createElement("a", {href: "#", onClick: this.handleSave, className: "button form-from-json button-fill"}, "Save"))
										   ));
				}
			});
		
			ReactDOM.render(React.createElement(SettingComponent, null), document.getElementById('sezzwho-setting'));
			//ReactDOM.render(<SettingComponent source="http://sezzwhodev.wowfactormedia.ca/api/userplus/settings_get_notifications/?" />, document.getElementById('sezzwho-setting'));
		}
	};
});