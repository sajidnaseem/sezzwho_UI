 
	    
			  {{#each ../item}}
                <li> <a href="pages/android/detailpage.html?id={{user_id}}&username={{nickname}}&accountType={{account_type}}&backRoute=yes" data-context='{"accountType":"{{account_type}}","id":"{{user_id}}"}'>
                  <div class="item-content">
                    <div class="item-media"><img src="{{avatar}}" width="44"></div>
                    <div class="item-inner">
                      <div class="item-title-row">
                        <div class="item-title">{{username}}</div>
						<div class="item-after"><input type="hidden" class="post-hidden-count" value="{{count}}"><span>{{js "sezzwhoApp.mainInits.countFormat(this.count)"}} POSTS</span></div>
                      </div>
                      <div class="item-subtitle">{{bio}}</div>
                    </div>
                  </div></a>
                </li>
				{{/each}}
