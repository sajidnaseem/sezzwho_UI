<div class="demo-card-header-pic">
  <div style="background-image:url({{avatar}}); min-height:229px; background-size:cover;background-position:center center;" valign="bottom" class="card-header color-white no-border">
  {{#if this.follow}}<a href="pages/android/profile.html" ><i class="fa fa-camera fa-3x color-red" aria-hidden="true"></i></a> {{else}}
				<div class="follow follow-button" data-type="{{id}}" ontouchstart="sezzwhoApp.homeModules.blindEvent()"> <div class="icon-twitter"></div> {{#if is_follow}} <span data-type="unfollow-{{id}}"  class="stopfollow"><i class="fa fa-user-times"></i> Following </span> {{else}} <span data-type="follow-{{id}}" class="startfollow"><i class="fa fa-user-plus"></i> Follow </span> {{/if}}</div>
				 {{/if}}
  
  </div>
  <div class="sezzwho-header-content">
  <div class="card-content">
    <div class="card-content-inner">
      	<!-- <img src="{{avatar}}" alt="avatar" class="" width="48" height="48"> -->
       <!--<i class="fa fa-user fa-4x color-lightgreen" aria-hidden="true"></i> -->
	   <p class="profile-username">@{{username}}</p>
	   <div class="clearfix"></div>
		
		<div class="row  no-gutter">
			<div class="col-50">
				<p><i class="fa fa-television" aria-hidden="true"></i>{{#js_compare "this.website==='http://'"}}<a href="https://sezzwho.com/" class="external"> {{else}}<a href="{{website}}" class="external">{{/js_compare}} Go to Website </a> </p>
				<p>{{#js_compare "this.address===''"}} {{else}}<i class="fa fa-map-marker" aria-hidden="true"></i>  {{address}} {{/js_compare}}</p>
			</div>
			<div class="col-50"><p>{{#js_compare "this.bio ===''"}} Short description of yourself upto 50 words or less {{else}} {{bio}}{{/js_compare}}</p></div>
		</div>
		
	</div>
	
  </div>
  
  <div class="sezzwho-card-footer">
    <div class="row">
    <!-- Each "cell" has col-[widht in percents] class -->
    <div class="col-33"><a href="#" class="button button-fill color-orange button-raised">POSTS <input type="hidden" class="post-count-hidden" value="{{post_count}}"><span class="profile-counter">{{js "sezzwhoApp.mainInits.countFormat(this.post_count)"}}</span></a></div>
    <div class="col-33"><a href="pages/android/followerlist.html?id={{id}}" data-context='{"avatar":"{{avatar}}","username":"{{username}}","follower":"{{follower}}"}'  class="button button-fill color-lightgreen button-raised">FOLLOWERS <input type="hidden" class="follower-count-hidden" value="{{follower}}"><span class="profile-counter">{{js "sezzwhoApp.mainInits.countFormat(this.follower)"}}</span></a></div>
    <div class="col-33"><a href="pages/android/followinglist.html?id={{id}}" data-context='{"avatar":"{{avatar}}","username":"{{username}}","following":"{{following}}"}' class="button button-fill color-indigo button-raised">FOLLOWING <input type="hidden" class="following-count-hidden" value="{{following}}"><span class="profile-counter">{{js "sezzwhoApp.mainInits.countFormat(this.following)"}}</span></a></div>
</div>
  </div>
  </div>
</div>
	  