
var type= "";
var text_id_status= "";

// Called when capture operation is finished
    //
    function captureSuccess(mediaFiles) {
		
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
        }
    }

    // Called if something bad happens.
    //
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }

    // A button will call this function
    //
    function captureVideo() {
        // Launch device video recording application,
        // allowing user to capture up to 2 video clips
		
		var options = { limit: 1, 
			duration: 30,
			quality : 0
        };
        navigator.device.capture.captureVideo(captureSuccess, captureError, options); 
    }

    // Upload files to server
    function uploadFile(mediaFile) {
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
         progressBar(ft);		// call progress bar 
		
		
		var options      = new FileUploadOptions();
       	options.fileName = name;
   		options.mimeType = 'video/mp4';
		//videoCaptureSuccess(mediaFile);
		/*
		ZiggeoSdk = require("build/ziggeo/index.js")
	              	ZiggeoSdk.init('ddd4366d3fc0baef95c333fa575c53f9', '31a91c9483069a25e8abcd4d46dc8e47', '1bbe8f5b02d9e623889ca4635af76443'); console.log(ZiggeoSdk); 
				  	ZiggeoSdk.Videos.create({
					file: mediaFile.name
					});
			
      */
	   ft.upload(path,
            sezzwhoApp.uploadPath,
            function(result) {
				 sezzwhoApp.progressID.html("Completed");
                console.log('Upload success: ' + result.responseCode);
                var obj= JSON.parse(result.response);
		
				video_code = '<ziggeo ziggeo-width="320" ziggeo-height="240" ziggeo-responsive="true" ziggeo-video="' + obj.ziggeo["token"] + '"></ziggeo>';	
				var el ={};
		 
				el[0] = $$("#videocontent");
		     	if(sezzwhoApp.recordingType === "whats-new"){
				el[1] =  $("#aw-whats-new-submit,#add-business,#post-business");
				el[1].prop("disabled",false);
				}else if(sezzwhoApp.recordingType === "comments"){
				el[1] = $$("#post-comment");
				el[1].prop("disabled",false);
				}else if(sezzwhoApp.recordingType === "whats-record"){
				 var src = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" + obj.ziggeo["token"] + "/video.mp4";
				 var img = "http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/" +	obj.ziggeo["token"]	+ "/image";
					$("#re-change-image").attr('poster', img);
					$("#re-change-video").attr('src', src);
				}
				
				el[2] = $$("#videobusiness")
				el[0].val(video_code);
				el[2].val(obj.ziggeo["token"]);
				
		    
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            options);
    }

/************************* Progress Function ***********************/


function progressBar(ft){
	var container;
	if(sezzwhoApp.recordingType === "whats-new")
	 sezzwhoApp.progressID = $$('.demo-progressbar-load-hide p:first-child');
    else if(sezzwhoApp.recordingType === "comments")
	sezzwhoApp.progressID = $$('.comment-progressbar-load-hide p:first-child');
	else if (sezzwhoApp.recordingType == "whats-record")
	sezzwhoApp.progressID = $$('.record-progressbar-load-hide p:first-child');
     	
ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			
			myApp.showProgressbar(sezzwhoApp.progressID,perc);
			if(perc == 99){
				myApp.showProgressbar(sezzwhoApp.progressID,100);
				
			}
		} else {
			sezzwhoApp.progressID.html("Completed");
		}
	};

}
function getPhoto(source) {
	
	
navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    destinationType: destinationType.FILE_URI,
    mediaType: Camera.MediaType.VIDEO,
    sourceType: source
});
}

function onPhotoURISuccess(imageURI) {
    console.log(imageURI);
}

function onFail(message) {
    console.log(message);
}

function videoCaptureSuccess(mediaFiles) {
    // Wrap this below in a ~100 ms timeout on Android if 
    // you just recorded the video using the capture plugin. 
    // For some reason it is not available immediately in the file system. 
 
    var file = mediaFiles[0];
    var videoFileName = 'video-name-here'; // I suggest a uuid 
 
    VideoEditor.transcodeVideo(
        videoTranscodeSuccess,
        videoTranscodeError,
        {
            fileUri: mediaFiles.fullPath,
            outputFileName: videoFileName,
            outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
            optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
            saveToLibrary: true,
            maintainAspectRatio: true,
            width: 640,
            height: 640,
            videoBitrate: 1000000, // 1 megabit 
            audioChannels: 2,
            audioSampleRate: 44100,
            audioBitrate: 128000, // 128 kilobits 
            progress: function(info) {
                console.log('transcodeVideo progress callback, info: ' + info);
            }
        }
    );
}
function videoTranscodeSuccess(result) {
    // result is the path to the transcoded video on the device 
    console.log('videoTranscodeSuccess, result: ' + result);
}
 
function videoTranscodeError(err) {
    console.log('videoTranscodeError, err: ' + err);
}

function star_rating(){

var jq = jQuery;

        // Make the Read More on the already-rated box have a unique class
        var arm = jq('.already-rated .activity-read-more');
        jq(arm).removeClass('activity-read-more').addClass('already-rated-read-more');

        jq('.star').mouseover( function() {
            var num = jq(this).attr('id').substr( 4, jq(this).attr('id').length );
            for ( var i=1; i<=num; i++ )
                jq('#star' + i ).attr( 'src', "images/star.png" );
        });

        jq('div#review-rating').mouseout( function() {
            for ( var i=1; i<=5; i++ )
                jq('#star' + i ).attr( 'src', "images/star_off.png" );
        });

        jq('.star').click( function() {
            var num = jq(this).attr('id').substr( 4, jq(this).attr('id').length );
            for ( var i=1; i<=5; i++ )
                jq('#star' + i ).attr( 'src', "images/star_off.png" );
            for ( var i=1; i<=num; i++ )
                jq('#star' + i ).attr( 'src', "images/star.png" );

            jq('.star').unbind( 'mouseover' );
            jq('div#review-rating').unbind( 'mouseout' );

            jq('input#rating').attr( 'value', num );
        });

        

        jq('#submit').click(function(){
            if(jq('input#rating').val() == 0){
                alert('Please Rate for This page/post !!!');
                return false;
            }
        });
		
		

}