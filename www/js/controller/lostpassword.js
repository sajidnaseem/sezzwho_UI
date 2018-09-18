var lostPassword = {
  init: function () {
	  this.blindEvent();
	  },
  blindEvent: function () {
    var bindings = [{
      element: "#wp-submit",
      event: 'click',
      handler: sezzwhoApp.commonFunc.lostSezzwhoPassword
    }];
   mainInit.bindEvents(bindings);
  }
};

sezzwhoApp.lostPasswords = lostPassword;