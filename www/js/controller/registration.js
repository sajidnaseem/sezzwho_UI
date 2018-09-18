// JavaScript Document\\
var register = {
    init: function() {
        requirejs(["build/register/registerReact"], function(reg) {
            reg.initRegister();
        });
    },
    registerUser: function() {

    },
    bindEvent: function() {
        var bindings = [{
            element: '#sezzwho-new-user',
            event: 'click',
            handler: this.registerUser
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }

}
sezzwhoApp.registers = register;