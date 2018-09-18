var setting = {
      init : function(){
		if(isAndroid){
		  requirejs(["build/setting/settingReact"],function(setting){ 
	              setting.initSetting();
				});
	  	}else{
	  	requirejs(["build/setting/settingReact-ios"],function(setting){ 
	              setting.initSetting();
				});
		}
	  },
	  updateSetting : function(){
		  
	  },
	  updatePassword : function(){
		  console.log("change password");
		  var options = {
            'key': sezzwhoApp.jsonpcb,
            'cookie': sezzwhoApp.cookie,
            'password': document.getElementById("confirm_password").value
       		 };
        sezzwhoApp.xhrs.simpleCall(sezzwhoApp.url, sezzwhoApp.sezzwhoAction.update_password, options, "changePassword");
	  },
	  responseUpdatePassword : function(response){
		  if(response.status === "ok"){
			   myApp.addNotification({
                title: 'Change Password',
                subtitle: 'Password Updated',
                message: 'Password updated successfully',
                media: '<img width="44" height="44" style="border-radius:100%" src="images/sezz-bar-logo.png">'
            });
		  }
	  },
	  initPasswordValidate : function(){
		var password = document.getElementById("password"), 
		confirm_password = document.getElementById("confirm_password"),
		sezzwho_update_password = document.getElementById("sezzwho-update-password");
  
		function validatePassword(){
		  if(password.value != confirm_password.value) {
			confirm_password.style.color='red';
			$("#sezzwho-update-password").attr("disabled", true);
		  } else {
			confirm_password.style.color= 'black';
			$("#sezzwho-update-password").attr("disabled", false);
		  }
		}
		
		password.onchange = validatePassword;
		confirm_password.onkeyup = validatePassword;
	  },
	  bindEvent: function(){
		var bindings =[{
		element	: '#sezzwho-update-setting',
		event 	: 'click',
		handler	: this.updateSetting
		},
		{
		element	: '.sezzwho-update-password',
		event 	: 'click',
		handler	: this.updatePassword
		}
		];
		sezzwhoApp.mainInits.bindEvents(bindings);
	}
	
}
sezzwhoApp.settings = setting;