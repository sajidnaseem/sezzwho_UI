define(function(){
	return {
		init: function (){
			
			var RegisterComponent = React.createClass({displayName: "RegisterComponent",
			  render: function() {
				return (
				     React.createElement("div", {className: "list-block"}, 
                      React.createElement("ul", null, 
                        React.createElement("li", null, 
                          React.createElement("div", {className: "item-content"}, 
                            React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "icon icon-form-name"})), 
                            React.createElement("div", {className: "item-inner"}, 
                              React.createElement("div", {className: "item-title label"}, "User Name"), 
                              React.createElement("div", {className: "item-input"}, 
                                React.createElement("input", {type: "text", placeholder: "Your name"})
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
                                React.createElement("input", {type: "email", placeholder: "E-mail"})
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
                )
                
				
				);
			  }
			});
	ReactDOM.render(React.createElement(RegisterComponent, {source: "http://sezzwhodev.wowfactormedia.ca/api/userplus/register/?key=jsonpCallbackSezzWhoApp8513467259"}), document.getElementById('registrationComponent'));

		}
	};
});