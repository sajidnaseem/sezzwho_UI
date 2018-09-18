  <script type="text/template" id="">
	  
	  {{#each ../item}}
			 <div class="card facebook-card comment-{{id}}" id="comment-{{id}}">
			  <div class="card-header">
				<div class="facebook-avatar">
				<a href="pages/android/detailpage.html?id={{user_id}}&username={{nickname}}&accountType={{account_type}}" data-context='{"accountType":"{{account_type}}","id":"{{user_id}}"}'><img src="{{avatar}}" width="34" height="34"></a>
		  		</div>
				<div class="facebook-name">{{action}}</div>
				<div class="facebook-date">{{time}}</div>
			  </div>
			  <div class="card-content">
				<div class="card-content-inner">
				{{#if text_comment}}
				<p class="fisrt-letter">{{text_content}}</p>
				{{else}}
				<video width="100%" height="300" poster="http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/{{ziggeocode}}/image" controls>
            		<source src="http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/{{ziggeocode}}/video.mp4" type="video/mp4">
            	</video> 
				{{/if}}
				      
				  	<p class="color-gray">Ditto: <span class="likes badge bg-lightgreen">{{likes_count}}</span>   
				    <!--	Reply: <span class="comment badge bg-lightgreen">{{commentLenght}}</span> -->
					</p>
				</div>
			  </div>
			  <div class="card-footer">
				 <a href="#" class="link comment-ditto" data-userid="{{user_id}}" data-id="{{id}}">{{#if like_button}}<i class="fa fa-thumbs-o-down"></i><span> Unditto </span>{{else}} <i class="fa fa-thumbs-o-up"></i><span> Ditto </span>{{/if}} </a>
			<!--	<a href="#" class="link">Reply</a> -->
			   {{#js_compare "this.user_id !== sezzwhoApp.userloginInfo.user.id"}}
			   
			   {{#if text_comment}}
			    <a href="#" class="tab-link share-button-comments color-indigo"  onclick="sezzwhoApp.commonFunc.shareCommentWidget(this)"    data-arg='{"id":"{{id}}","text":"{{text_content}}","image":"http://sezzwho.com/wp-content/uploads/avatars/113/c9a86d7569e4fe9147c88f1df9caf079-bpfull.jpg","videoCheck":false}'>
				{{else}}
				 <a href="#" class="tab-link share-button-comments color-indigo"  onclick="sezzwhoApp.commonFunc.shareCommentWidget(this)"  data-arg='{"id":"{{id}}","text":"Check out this","video":"{{ziggeocode}}","videoCheck":true}'>
				 {{/if}}
								<i class="icon fa fa-share-alt fa-lg"><input type="hidden" class="share-count-hidden" value="{{share_count}}"><!--<span class="badge bg-indigo share-count">{{js "sezzwhoApp.mainInits.countFormat(this.share_count)"}}</span>--></i>
								<span class="color-indigo"> SHARE</span>
							</a>
			  {{else}}
				<a href="#" class="link comment-delete" data-userid="{{user_id}}" data-id="{{id}}"><i class="fa fa-minus-square-o"></i> Delete</a>
			  {{/js_compare}}
			  </div>
			</div>  
			{{/each}}
	  </script>
	  