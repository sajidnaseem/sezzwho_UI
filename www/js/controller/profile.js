var ProfileComponent;
var profile = {
    init: function() {
        this.blindEvent();
        this.reactInit();
    },
    profileEdit: function() {

    },
    profileSave: function() {

    },
    reactInit: function() {

        requirejs(["build/profile/profileReact"], function(profileReact) {
            profileReact.initProfile();
        });


    },
    blindEvent: function() {
        var bindings = [{
            element: '.edit',
            event: 'click',
            handler: this.profileEdit
        }, {
            element: '.save',
            event: 'click',
            handler: this.profileSave
        }];
        sezzwhoApp.mainInits.bindEvents(bindings);
    }


}

sezzwhoApp.profiles = profile;