define(function(){
		
	return {
	initRegister: function (){	
		
			var RegisterComponent = React.createClass({displayName: "RegisterComponent",
				
				getInitialState: function() {
								return {
									email			: '',
									username		: '',
									bio				: '',
									ids				: '',
									password		: '',
									diplay_name		: '',
									error 			: '',
									isChecked		: false,
									isTerms			: false,
									dob				:'yyyy-mm-dd',
									accountType		: '?',
													  options	: [
														{ value: null, name: 'SELECT' },
														{ value: 'Personal', name: 'Personal' },
														{ value: 'Business', name: 'Business' }
													  ],
									country		: '?',
													  optionsCountry	: [
														{ value: null, name: 'SELECT' },
														{ value: 'Canada', name: 'Canada' },
														{ value: 'USA', name: 'USA' }
													  ],
									region 		: '?',
													optionsState	: [
														{ value: null, name: 'SELECT' },
														{ value: 'Alberta', name: 'Alberta' },
														{ value: 'British Columbia', name: 'British Columbia' },
														{ value: 'Manitoba', name: 'Manitoba' },
														{ value: 'New Brunswick', name: 'New Brunswick' },
														{ value: 'Newfoundland and Labrador', name: 'Newfoundland and Labrador' },
														{ value: 'Nova Scotia', name: 'Nova Scotia' },
														{ value: 'Ontario', name: 'Ontario' },
														{ value: 'Prince Edward Island', name: 'Prince Edward Island' },
														{ value: 'Quebec', name: 'Quebec' },
														{ value: 'Saskatchewan', name: 'Saskatchewan' },
														{ value: 'Northwest Territories', name: 'Northwest Territories' },
														{ value: 'Nunavut', name: 'Nunavut' },
														{ value: 'Yukon', name: 'Yukon' }
													  ]				  
													  			  
								};
							  },
				validationForm : function(){			  
						
							
							// User validation 
							if(this.state.username !==""){
								for (var i=0, len = this.state.username.length; i<len; ++i) {
									if (this.state.username.charAt(i) === ' ') {
										myApp.addNotification({
												   	hold: 3000,
													title: 'Username',
													subtitle: '',
													message: '<span  class="color-red">should not be blank or contain blank space in username field!!</span>',
													media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
												});
												return false;
									}
								}
							}
                      
					 //  navigator.notification.confirm("Are you legal drinking age?",this.checkAge,'Age Verification',['Yes','No']);
						
						
						
						if(this.state.isChecked === false){
							   myApp.addNotification({
												   	hold: 3000,
													title: 'Age Verification',
													subtitle: '',
													message: '<span  class="color-red">For sign up, you must be 18 years of age or older</span>',
													media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
												});
							return false;
							}
							
						 
						if(this.state.isTerms === false){
							   myApp.addNotification({
												   	hold: 3000,
													title: 'Terms & Conditions',
													subtitle: '',
													message: '<span  class="color-red">Please, agree terms & conditions</span>',
													media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
												});
							return false;
							}	
							
						return true; 
						
				
				},
				handleSignup : function(){	
							var ajaxUrl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.register;
								   if(this.validationForm()){
									   		myApp.showIndicator();
									   		var bio 	= this.state.bio,
												type 	= this.state.accountType,
												country = this.state.country,
												state  	= this.state.region,
												dob  	= this.state.dob;
												localStorage.pass = this.state.password;
												localStorage.usrname = this.state.username; 	
											var options	= {
															key				: sezzwhoApp.jsonpcb,
															email 			: this.state.email,
															username		: this.state.username,
															display_name 	: this.state.username,
															password		: this.state.password,
															user_pass		: this.state.password
															};
											$.get(ajaxUrl, options, function(res){
												                console.log(res);
																if(res.status === 'error'){
																	myApp.addNotification({
																	hold: 5000,
																	title: 'Error',
																	message:'<span  class="color-red">'+ res.error + '</span>'
																	});
																	myApp.hideIndicator();   
																}
																else{ 
																	var ajaxUrl =sezzwhoApp.url + sezzwhoApp.sezzwhoAction.xprofile_update;
																	var options ={
																	 key			: sezzwhoApp.jsonpcb,
																	 cookie 		: res.cookie,
																	 user_id 		: res.user_id,
																	 'Bio' 			: "Short Description of yourself up to 50 words or less",
																	 'Account Type'	: "Personal"
																	}
																	$.get(ajaxUrl, options, function(res){   
																		myApp.addNotification({
																		title: 'Successfull',
																		hold: 9000,
																		message: 'Success! Your account has been created and for activite your account, please click on activitation link in your email'
																		}); 
																		myApp.hideIndicator();
																	});
																	$('#remember_me').attr('checked', 'checked');
																	$('.sezzwho-username').val(localStorage.usrname);
																	$('.sezzwho-password').val(localStorage.pass);
																	b_init.click();
																} 
															});
								   }
							
							 },
				checkFuncEmail : function(event){ 
								 this.setState({email: event.target.value});			  
							  },
				checkFuncUser : function(event){
								this.setState({username: event.target.value});
							  },
				checkFuncPassword : function(event){
								 this.setState({password: event.target.value});
							  },
				checkFuncBio : function(event){
					console.log(event.target.value);
								this.setState({bio: event.target.value});
							  },
				checkFuncAccountType : function(event){
								  this.setState({accountType: event.target.value});
							  },
				checkFuncCountry : function(event){
					             if(event.target.value === "Canada") {
								 $(".register-region").show();
								 }else{
								 $(".register-region").hide();
								 }
								  this.setState({country: event.target.value});
							  },
				checkFuncState : function(event){
								  this.setState({region: event.target.value});
							  },
				checkFuncDOB : function(event) {
					          
					          	this.setState({dob: event.target.value});
							 },
				checkFuncAge: function(event) {
					var val = ($(".ageChk").prop("checked")) ? false : true;
					this.setState({
						isChecked: val
					});
				},
				checkFuncTerms: function(event) {
					var val = ($(".termsChk").prop("checked")) ? false : true;
					this.setState({
						isTerms: val
					});
				},			 
				render: function() {
						var createItem = function (item, key) {
						return React.createElement("option", {key: key, value: item.value}, item.name);
								};
						var createItemCountry = function (item, key) {
						return React.createElement("option", {key: key, value: item.value}, item.name);
								};
						var createItemState = function (item, key) {
						return React.createElement("option", {key: key, value: item.value}, item.name);
								};
								return (
									 React.createElement("div", {className: "content-blocks"}, 
									 React.createElement("div", {className: "list-block inputs-list"}, 
									  React.createElement("ul", null, 
										React.createElement("li", null, 
										  React.createElement("div", {className: "item-content"}, 
											React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-user fa-lg color-lightgreen", "aria-hidden": "true"})), 
											React.createElement("div", {className: "item-inner"}, 
											  React.createElement("div", {className: "item-title label"}, "User Name"), 
											  React.createElement("div", {className: "item-input item-input-field"}, 
												React.createElement("input", {type: "text", value: this.state.checkUser, placeholder: "Your name", onChange: this.checkFuncUser}), 
												React.createElement("div", {class: "help-block with-errors"})
											  )
											)
										  )
										), 
										React.createElement("li", null, 
										  React.createElement("div", {className: "item-content"}, 
											React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-envelope-o fa-lg color-indigo", "aria-hidden": "true"})), 
											React.createElement("div", {className: "item-inner"}, 
											  React.createElement("div", {className: "item-title label"}, "E-mail"), 
											  React.createElement("div", {className: "item-input item-input-field"}, 
												React.createElement("input", {type: "email", ref: "checkEmails", value: this.state.email, placeholder: "E-mail", onChange: this.checkFuncEmail}), 
												React.createElement("div", {class: "help-block with-errors"}, this.state.checkEmail)
											  )
											)
										  )
										), 
										React.createElement("li", null, 
										  React.createElement("div", {className: "item-content"}, 
											React.createElement("div", {className: "item-media"}, React.createElement("i", {className: "fa fa-key fa-lg color-deeporange", "aria-hidden": "true"})), 
											React.createElement("div", {className: "item-inner"}, 
											  React.createElement("div", {className: "item-title label"}, "Password"), 
											  React.createElement("div", {className: "item-input item-input-field"}, 
												React.createElement("input", {type: "password", value: this.state.password, placeholder: "Password", onChange: this.checkFuncPassword})
											  )
											)
										  )
										), 
										React.createElement("li", {onClick: this.checkFuncAge}, 
												  React.createElement("label", {className: "item-content label-checkbox"}, 
													 React.createElement("input", {id: "ageChk", className: "ageChk", type: "checkbox"}), 
													React.createElement("div", {className: "item-media mention-icon"}, React.createElement("i", {className: "icon icon-form-checkbox"})), 
													React.createElement("div", {className: "item-inner", style: {'padding-top': '21px'}}, 
													  React.createElement("div", {className: "item-title-row"}
													  ), 
													  	React.createElement("div", {className: "item-text"}, 
														  "Are you legal drinking age?"
													  	)
													)
												  )
										), 
										React.createElement("li", {onClick: this.checkFuncTerms}, 
											React.createElement("label", {className: "item-content label-checkbox"}, 
												React.createElement("input", {id: "termsChk", className: "termsChk", type: "checkbox"}), 
												React.createElement("div", {className: "item-media mention-icon"}, React.createElement("i", {className: "icon icon-form-checkbox"})), 
												React.createElement("div", {className: "item-inner", style: {'padding-top': '21px'}}, 
													React.createElement("div", {className: "item-title-row"}
													), 
													React.createElement("div", {className: "item-text"}, 
														"I agree with terms and conditions"
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
			    
				ReactDOM.render(React.createElement(RegisterComponent, null), document.getElementById('registrationComponent'));

				//ReactDOM.render(<RegisterComponent source="http://sezzwhodev.wowfactormedia.ca/api/userplus/register/?key=jsonpCallbackSezzWhoApp8513467259" />, document.getElementById('registrationComponent'));

		
		}
	};
});