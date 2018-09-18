define(function(){
	return {
		init: function (){
			
			var RegisterComponent = React.createClass({displayName: "RegisterComponent",
			getInitialState: function() {
				return {
					checkEmail		: '',
					checkUser		: '',
					bio				: '',
					ids				:''
				};
			  },	
			 handleSignup : function(){	
			 
			 },
			  checkFuncEmail : function(event){
				  console.log('email');
				  var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.email_exists;
				  var options= {
					  key: sezzwhoApp.jsonpcb,
					  email : event.target.value
				  };
				  $.get(ajaxUrl, options, function(res){
				   console.log(res);
				  
				  });
				  
				  
			  },render: function() {
				return (
				     React.createElement("div", {className: "content-block"}, 
					 React.createElement("div", {className: "list-block"}, 
                      React.createElement("ul", null, 
                        React.createElement("li", null, 
                          React.createElement("div", {className: "item-content"}, 
                            React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "icon icon-form-name"})), 
                            React.createElement("div", {className: "item-inner"}, 
                              React.createElement("div", {className: "item-title label"}, "User Name"), 
                              React.createElement("div", {className: "item-input"}, 
                                React.createElement("input", {type: "text", placeholder: "Your name", onChange: this.checkFuncEmail}), 
								React.createElement("div", {class: "help-block with-errors"}, this.state.checkUser)
                              )
                            )
                          )
                        ), 
                        React.createElement("li", null, 
                          React.createElement("div", {className: "item-content"}, 
                            React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "icon icon-form-email"})), 
                            React.createElement("div", {className: "item-inner"}, 
                              React.createElement("div", {className: "item-title label"}, "E-mail"), 
                              React.createElement("div", {className: "item-input"}, 
                                React.createElement("input", {type: "email", ref: "checkEmails", value: this.props.checkEmail, placeholder: "E-mail", onChange: this.checkFuncEmail}), 
								React.createElement("div", {class: "help-block with-errors"}, this.state.checkEmail)
                              )
                            )
                          )
                        ), 
                         React.createElement("li", null, 
                          React.createElement("div", {className: "item-content"}, 
                            React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "icon icon-form-password"})), 
                            React.createElement("div", {className: "item-inner"}, 
                              React.createElement("div", {className: "item-title label"}, "Password"), 
                              React.createElement("div", {className: "item-input"}, 
                                React.createElement("input", {type: "password", placeholder: "Password"})
                              )
                            )
                          )
                        ), 
                         React.createElement("li", null, 
                          React.createElement("div", {className: "item-content"}, 
                            React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "icon icon-form-comment"})), 
                            React.createElement("div", {className: "item-inner"}, 
                              React.createElement("div", {className: "item-title label"}, "Bio"), 
                              React.createElement("div", {className: "item-input"}, 
                                React.createElement("input", {type: "text", placeholder: "Bio"})
                              )
                            )
                          )
                        ), 
                         React.createElement("li", null, 
                          React.createElement("div", {className: "item-content"}, 
                            React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "icon icon-form-toggle"})), 
                            React.createElement("div", {className: "item-inner"}, 
                              React.createElement("div", {className: "item-title label"}, "Account Tyoe"), 
                              React.createElement("div", {className: "item-input"}, 
                                React.createElement("select", null, 
                                  React.createElement("option", null, "Personal"), 
                                  React.createElement("option", null, "Business")
                                )
                              )
                            )
                          )
                        )
                      )
                ), 
                 
                React.createElement("p", {className: "buttons-row"}, 
                  React.createElement("a", {href: "#", className: "button button-fill button-raised button-big color-green back link"}, "Sign in"), 
                  React.createElement("a", {href: "#", className: "button button-fill button-raised button-big color-indigo", onClick: this.handleSignup}, "Sign up")
                )
                )
				
				);
			  }
			});
	ReactDOM.render(React.createElement(RegisterComponent, {source: "http://sezzwhodev.wowfactormedia.ca/api/userplus/register/?key=jsonpCallbackSezzWhoApp8513467259"}), document.getElementById('registrationComponent'));

		}
	};
});