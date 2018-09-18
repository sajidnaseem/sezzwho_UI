
var ZiggeoCall= {
	init: function(){
	var	ZiggeoSdk = require('ziggeo'); 
     sezzwhoApp.ZiggeoSdk =ZiggeoSdk;
	 sezzwhoApp.ZiggeoSdk.init('ddd4366d3fc0baef95c333fa575c53f9','31a91c9483069a25e8abcd4d46dc8e47','1bbe8f5b02d9e623889ca4635af76443');
	}
}
	 
sezzwhoApp.ziggeo = ZiggeoCall;
