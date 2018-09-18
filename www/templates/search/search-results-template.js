      {{#each this}}
      		  <li data-woeid="{{user_id}}" data-user="{{username}}" >
				<div class="item-content">
				 <div class="item-media"><a href="pages/android/detailpage.html?id={{user_id}}&username={{display_name}}&accountType={{account_type}}" data-context='{"accountType":"{{account_type}}","id":"{{user_id}}" }' class="close-popup"><img src="{{avatar}}" width="44" onError="this.onerror=null;this.src='images/gravatar.png';"></a></div>
					<div class="item-inner">
					  <div class="item-title-row">
						<div class="item-title">@{{username}}</div>
					  </div>
					  <div class="item-subtitle">
							<div class="follow search-follow"  data-type="{{user_id}}">{{#if is_follow}} <span data-type="unfollow-{{user_id}}"  class="stopfollow"><i class="fa fa-user-times"></i> Following </span> {{else}} <span data-type="follow-{{user_id}}" class="startfollow"><i class="fa fa-user-plus"></i> Follow </span> {{/if}}</div>
					</div>
					</div>
				  </div>
			  </li>
      {{/each}}
              