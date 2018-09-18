   {{#each ../item}}
   {{#if type}}
   <div class="card facebook-card activity-{{id}}" {{#if popular}}  id="popular-{{id}}"  {{else}} id="activity-{{id}}" {{/if}} >
       	<div class="card-header no-border">
            <div class="facebook-avatar">
			<a href="pages/android/detailpage.html?id={{user_id}}&username={{nickname}}&accountType={{account_type}}" data-context='{"accountType":"{{account_type}}","id":"{{user_id}}"}' class="close-popup"><img src="{{avatar}}" width="34" height="34" onError="this.onerror=null;this.src='images/gravatar.png';"></a>
	   		</div>
            <div class="facebook-name">{{action}}</div>
            <div class="facebook-date">{{time}}</div>
     	</div>
            <div class="card-content">
            {{title}}
			 
		 
		  <div id="sezzwho-image-backgrounds"><a href="pages/android/videodetails.html" data-context='{"page":"{{page}}","name":"{{name}}","ziggeocode":"{{ziggeocode}}","id":"{{id}}","user_id":"{{user_id}}","avatar":"{{avatar}}","action":"{{action}}","time":"{{time}}"}' class="link close-popup"><img class="stretch lazy" data-url="http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/{{ziggeocode}}/video.mp4"  src="http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/{{ziggeocode}}/image"  onError="this.onerror=null;this.src='images/error_video.jpg" class="play-video1 stretch"> </a></div>
         

			
        	{{hashtag}}
			{{#unless web_link}} {{else}}<center class="web-link"><i class="fa fa-external-link" aria-hidden="true"></i> {{web_link}}</center> {{/unless}}
			{{#unless location}}  {{else}} <center class="web-link"><i class="fa fa-map-marker" aria-hidden="true"></i> {{location}} </center> {{/unless}}
			 <center><span class="rating-static rating-{{star}}"></span></center>
            <p class="color-gray">
			    
				<span class="action-menu link"  data-activityid="{{id}}" data-userid="{{user_id}}" data-items='{"id":"{{id}}","is_follow":{{is_follow}},"user_id":"{{user_id}}","username":"{{nickname}}","accountType":"{{account_type}}","action":"{{action}}","title":"{{time}}","avatar":"{{avatar}}"}'><i class="fa fa-ellipsis-v fa-2x"></i></span> 
			 </p>
            </div>
            <div class="card-footer no-border">
			 <!-- Data-popover links removed from A Href  data-popover=".popover-links" and Class 'open-popover' -->
                <input type="hidden" class="share-link" value="/members/{{nickname}}/activity/{{id}}">
               		<div class="tabbar-labels">
						<div class="toolbar-inner">
							<a href="#" class="tab-link active activity-like" data-id="{{id}}"><input type="hidden" class="ditto-count-hidden" value="{{likes_count}}">
								{{#if like_button}}<i class="icon fa fa-thumbs-up ditto fa-lg">{{else}}<i class="icon ditto fa fa-thumbs-o-up fa-lg">{{/if}}<span class="badge bg-orange likes">{{js "sezzwhoApp.mainInits.countFormat(this.likes_count)"}}</span></i>
								{{#if like_button}}<span class="tabbar-label ditto">Unditto</span> {{else}}<span class="tabbar-label ditto">Ditto</span> {{/if}}
							</a>
							<a href="pages/android/comment.html?id={{id}}&comment={{comments}}&index={{@index}}&page={{page}}&name={{name}}&user_id={{user_id}}" data-context='{}' class="tab-link-comment close-popup">
								<i class="icon fa fa-comment-o fa-lg color-purple"><input type="hidden" class="comment-count-hidden" value="{{commentLenght}}"><span class="badge bg-purple comment">{{js "sezzwhoApp.mainInits.countFormat(this.commentLenght)"}}</span></i>
								<span class="tabbar-label color-purple">Comments</span>
							</a>
							<a href="#" class="tab-link" onClick="sezzwhoApp.commonFunc.referActivity({{id}})">
								<i class="icon fa fa-share-alt-square fa-lg color-lightgreen"><input type="hidden" class="refer-count-hidden" value="{{refer_count}}"><span class="badge bg-lightgreen refer">{{js "sezzwhoApp.mainInits.countFormat(this.refer_count)"}}</span></i>
								<span class="tabbar-label color-lightgreen"> Recommends</span>
							</a>
							<a href="#" class="tab-link share-button"  data-arg='{"id":"{{id}}","text":"Check out this","video":"{{ziggeocode}}","videoCheck":true}'>
								<i class="icon fa fa-share-square fa-lg"><input type="hidden" class="share-count-hidden" value="{{share_count}}"><span class="badge bg-indigo share-count">{{js "sezzwhoApp.mainInits.countFormat(this.share_count)"}}</span></i>
								<span class="tabbar-label">Share</span>
							</a>
						</div>
					</div>
            </div>
       </div>
       {{/if}}
       {{/each}}
      