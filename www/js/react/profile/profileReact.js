define(function() {
    return {
        initProfile: function() {
			
            var ProfileComponent = React.createClass({
                getInitialState: function() {
                    return {
                        name: '',
                        accountType: '',
                        bio: '',
                        ids: '',
                        avatar: ''
                    };
                },
                componentDidMount: function() {
					document.getElementById('sezzwho-profile').setAttribute('id','sezzwho-profile-old');
                    var options = {
                        user_id: sezzwhoApp.userloginInfo.user.id,
                        field: 'name,bio,Account Type,Profile Video Link,website,address',
						key: sezzwhoApp.jsonpcb
                    };
                    myApp.showIndicator();
					var sourceUrl= sezzwhoApp.url + "xprofile/?";
                    this.serverRequest = $.get(sourceUrl, options, function(result) {
                        var lastGist = result;
                        myApp.hideIndicator();
                        console.log(lastGist);
                        this.setState({
                            name: lastGist.name,
                            accountType: lastGist['Account Type'],
                            bio: lastGist.bio,
                            avatar: lastGist.avatar,
                            video: lastGist['Profile Video Link'],
                            website: lastGist.website,
                            address: lastGist.address,
                            display: (lastGist['Account Type'] === "Business") ? {
                                display: "block"
                            } : {
                                display: "block"
                            }
                        });
                    }.bind(this));
                },
                handleChange: function(event) {
                    if (event.target.id === "sezzwhoname") {
                        this.setState({
                            ids: 'sezzwhonames'
                        });
                        setTimeout(function() {
                            $("#sezzwhonames").show();
                        }, 100);
                    } else if (event.target.id === "sezzwhobio") {
                        this.setState({
                            ids: 'sezzwhobios'
                        });
                        setTimeout(function() {
                            $("#sezzwhobios").show();
                        }, 100);
                    }
                },
                handleChange1: function(e) {
                    if (e.target.id === "sezzwhonames") {
                        this.setState({
                            name: e.target.value
                        });
                    } else if (e.target.id === "sezzwhobios") {
                        this.setState({
                            bio: e.target.value
                        });
                    } else if (e.target.id === "sezzwhoselect") {
                        this.setState({
                            accountType: e.target.value
                        });
                    } else if (e.target.id === "sezzwhowebsite") {
                        this.setState({
                            website: e.target.value
                        });
                    } else if (e.target.id === "sezzwhoaddress") {
                        this.setState({
                            address: e.target.value
                        });
                    } else if (e.target.id === "sezzwhovideo") {
                        this.setState({
                            video: e.target.value
                        });
                    }
                },
					setContributor: function (event) {
					//If the contributor input field were directly within this
					//this component, we could use this.refs.contributor.value
					//Instead, we want to save the data for when the form is submitted
					this.setState({
					  contributor: event.target.value
					});
  				},
                saveProfile: function() {
					 
                    var options = {
                        'key': sezzwhoApp.jsonpcb,
                        'user_id': sezzwhoApp.userloginInfo.user.id,
                        'cookie': sezzwhoApp.cookie,
                        'bio': this.state.bio,
                        'name': this.state.name,
                        'Account Type': this.state.accountType,
                        'address': this.state.address,
                        'website': this.state.website,
                        'Profile Video Link': this.state.video,
                    };
                    var ajaxurl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.xprofile_update;
                    this.serverRequest = $.post(ajaxurl, options, function(response) {
                        var lastGist = response;
                        myApp.addNotification({
                            title: 'profile',
                            message: 'updated successfully'
                        });
                        sezzwhoApp.personalFeeds.userProfileHeader(sezzwhoApp.userloginInfo.user.id); // Update personal feed
						sezzwhoApp.personalFeeds.getFeedActivities(); 
                    });
                },
                uploadPicture: function() {
                    getImage();
                    var srcImage = '',
                        $status = $('#cam_status');

                    function getImage() {
                        // Retrieve image file location from specified source
                        window.navigator.camera.getPicture(uploadPhoto, function(message) {
                            alert('get picture failed');
                        }, {
                            quality: 75,
                            destinationType: window.navigator.camera.DestinationType.FILE_URI,
                            sourceType: window.navigator.camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: true
                        });
                    }

                    function uploadPhoto(imageURI) {
                        var isGallery = true;
						var imagenew = '';
                        var image = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                        var name = image.split("?")[0];
                        var number = image.split("?")[1];
                        srcImage = imageURI;
						var time = Math.floor( Date.now() / 1000 );
						number = (typeof number === 'undefined') ? time - 1 : number;
						imagenew = time + '-' + name;
                        if ('Android' === device.platform && isGallery) {
                            imagenew = number + time + '.jpg';
                        }
                        console.log(imagenew);
                        var options = new FileUploadOptions();
                        options.fileKey = "avatar";
                        options.fileName = imageURI ? imagenew : '';
                        options.mimeType = "image/jpeg";
                        var params = new Object();
                        params.value1 = "test";
                        params.value2 = "param";
                        params.key = sezzwhoApp.jsonpcb;
                        params.cookie = sezzwhoApp.cookie;
                        params.full = 'BP_AVATAR_FULL_WIDTH';
                        options.params = params;
                        options.chunkedMode = false;
                        var ajaxurl = sezzwhoApp.url + sezzwhoApp.sezzwhoAction.avatar_upload;
                        var ft = new FileTransfer();
                        ft.upload(imageURI, ajaxurl, win, fail, options);
                        ft.onprogress = function(progressEvent) {
                            console.log(progressEvent);
                            if (progressEvent.lengthComputable) {
                                //appcamera.statusProgress().innerHTML = '<progress id="progress" value="1" max="100"></progress>';
                                jQuery('#cam-progress').css('visibility', 'visible');
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                document.getElementById('progress').value = perc;
                                console.log(perc);
                            } else {
                                if (statusDom().innerHTML === '') {
                                    statusDom().innerHTML = 'loading';
                                } else {
                                    statusDom().innerHTML += '.';
                                }
                            }
                        };
                    }
                    statusDom = function() {
                        statusDomEl = statusDomEl ? statusDomEl : document.getElementById('cam-status');
                        return statusDomEl;
                    };

                    function win(r) {
                        console.log("Code = " + r.responseCode);
                        console.log("Response = " + r.response);
                        console.log("Sent = " + r.bytesSent);
                        var image = document.getElementById('myImage-full');
                        var  response = JSON.parse(r.response);
					    image.src = response.full;
                        sezzwhoApp.userloginInfo.user.avatar = response.full;
					
                    }

                    function fail(error) {
                        alert("An error has occurred: Code = " + error.code);
                    }
                },
                render: function() {
                    return (<div className="profiles">
					<div className="content-block-title"> <i className="fa fa-user" aria-hidden="true"></i> Profile : {this.state.name} </div>
					<div className="list-block inputs-list">
				      <center><div className="sezzwho-profile-user two" > <img id="myImage-full" src={this.state.avatar} />
					  <i className="fa fa-camera fa-3x pro-adj" onClick={this.uploadPicture} aria-hidden="true"></i></div>
					  <div id="cam-progress" style={{visibility:'hidden'}}>
						<progress id="progress" value="1" max="100"></progress>
						</div>
							<div id="cam-status"></div>		  
					  </center>
                      <ul>
                        <li>
                          <div className="item-content">
                            <div className="item-media"><i className="fa fa-user fa-lg color-lightgreen" aria-hidden="true"></i></div>
                            <div className="item-inner">
							<div className="item-title label">Name</div>
							<div className="item-input item-input-field">
							<input type="text" id="sezzwhonames" placeholder="Please don't leave empty" required={true} value={this.state.name} onChange={this.handleChange1}/>
							</div>
							</div>
                          </div>
                        </li>
                        <li>
                          <div className="item-content">
                            <div className="item-media"><i className="fa fa-university fa-lg color-deeporange" aria-hidden="true"></i></div>
                            <div className="item-inner">
							<div className="item-title label">Account Type</div>
							<div className="item-input item-input-field">
							<select id="sezzwhoselect" value={this.state.accountType} onChange={this.handleChange1}>
							<option value="Personal">Personal</option>
							<option value="Business">Business</option>
							</select>							
							</div>
							</div>
                          </div>
                        </li>
                      	<li>
                          <div className="item-content">
                            <div className="item-media"><i className="fa fa-comment fa-lg color-indigo" aria-hidden="true"></i></div>
                            <div className="item-inner">
							<div className="item-title label">Bio</div>
							<div className="item-input item-input-field">
							<input type="text" id="sezzwhobios" required={true}
        					value={this.state.bio} placeholder="150 characters or less"
        					onChange={this.handleChange1}
      						/>
							</div>
							</div>
                          </div>
                        </li>
                        <li className="sezzwho-video-link">
                          <div className="item-content">
                            <div className="item-media"><i className="fa fa-external-link-square fa-lg color-orange" aria-hidden="true"></i></div>
                            <div className="item-inner">
							<div className="item-title label">Profile Video Link</div>
							<div className="item-input item-input-field">
							<input type="text" id="sezzwhovideo"
        					value={this.state.video}
        					onChange={this.handleChange1}
      						/>
							</div>
							</div>
                          </div>
                        </li>
						<li style={this.state.display}>
                          <div className="item-content">
                            <div className="item-media"><i className="fa fa-globe fa-lg color-gray" aria-hidden="true"></i></div>
                            <div className="item-inner">
							<div className="item-title label">Website</div>
							<div className="item-input item-input-field">
							<input type="text" id="sezzwhowebsite" 
        					value={this.state.website}
        					onChange={this.handleChange1}
      						/>
							</div>
							</div>
                          </div>
                        </li>
						<li style={this.state.display}>
                          <div className="item-content">
                            <div className="item-media"><i className="fa fa-map-marker fa-lg color-teal" aria-hidden="true"></i></div>
                            <div className="item-inner">
							<div className="item-title label">Address</div>
							<div className="item-input item-input-field">
							<input type="text" id="sezzwhoaddress" required={true} placeholder="City/Town, State/Province, Country"
        					value={this.state.address}
        					onChange={this.handleChange1}
      						/>
							</div>
							</div>
                          </div>
                        </li>
                      </ul>
					   <div className="content-block"><a href="#" className="button button-fill" onClick={this.saveProfile}>Update</a></div>
                    </div>
					</div>);
                }
            });
			
             ReactDOM.render(<ProfileComponent />, document.getElementById('sezzwho-profile'));
			//ReactDOM.render(<ProfileComponent  source="API LINK?" />, document.getElementsByClassName('sezzwho-profile'));
        }
    };
});