<script type="text/template" id="">

            <!-- This template equalt to default layout -->
            <div class="actions-modal custom-action-model">
              <!-- this is a single group -->
              {{#each this}}
                <div class="actions-modal-group">
                  <!-- now this represents a single button -->
                  {{#each this}}
                      {{#if label}}
                       <!-- <span class="actions-modal-label"> {{text}}</span> -->
                      {{else}}
                        <!-- <div class="actions-modal-button {{#if color}}color-{{color}}{{/if}} {{#if bold}}actions-modal-button-bold{{/if}}">{{text}}</div> -->
                      {{/if}}
                 
              {{#if items}}
			  <div class="row content-block header-action">
			    <div class="col-80"><strong>What would you like to do?</strong></div> <div class="col-20" onclick="sezzwhoApp.commonFunc.actionButtons('close')"><i class="fa fa-times-circle fa-3x color-lightgreen" aria-hidden="true"></i></div>
				 <div class="col-100 facebook-card">
				 <div class="card-header no-border">
						<div class="facebook-avatar">
						<a href="pages/android/detailpage.html?id={{this.data.user_id}}&username={{this.data.username}}&accountType={{this.data.accountType}}" data-context='{"accountType":"{{this.data.accountType}}","id":"{{this.data.user_id}}"}' class="close-popup"><img src="{{this.data.avatar}}" width="34" height="34" onerror="this.onerror=null;this.src='images/gravatar.png';"></a>
						</div>
						<div class="facebook-name">{{this.data.action}}</div>
						<div class="facebook-date">{{this.data.title}}</div>
					</div>
				 
				 </div>
			  </div>
			   <hr>
				  <div class="row content-block content-action">
				   	{{#js_compare "this.data.user_id==this.loginUser"}}
						<div class="col-33"  onclick="sezzwhoApp.commonFunc.actionButtons('edit')"><p><a href="#" class="button button-fill button-raised color-lightgreen">Edit</a></p></div>
					{{else}}
						<div class="col-33" ><p><a href="#" data-id="{{this.data.user_id}}" data-type="follow" onclick="sezzwhoApp.commonFunc.actionButtons(this)" class="button button-fill button-raised color-lightgreen"> {{#if this.data.is_follow}} <span data-type="unfollow-{{this.data.user_id}}"  class="stopfollow"><i class="fa fa-user-times"></i> Unfollow </span> {{else}} <span data-type="follow-{{this.data.user_id}}" class="startfollow"><i class="fa fa-user-plus"></i> Follow </span> {{/if}}</a></p></div>
			 
					{{/js_compare}}
						<div class="col-33" data-arg="{{id}}" onclick="sezzwhoApp.commonFunc.actionButtons('share')"><p><a href="#" class="button button-fill button-raised color-indigo">Share Post</a></p></div>
					{{#js_compare "this.data.user_id==this.loginUser"}}
						<div class="col-33"  onclick="sezzwhoApp.commonFunc.actionButtons('delete')"><p><a href="#" class="button button-fill button-raised color-red">Delete</a></p></div>
					{{else}}	
						<div class="col-33" onclick="sezzwhoApp.commonFunc.actionButtons('profile')"><p><a href="pages/android/detailpage.html?id={{this.data.user_id}}&username={{this.data.username}}&accountType={{this.data.accountType}}" data-context='{"accountType":"{{this.data.accountType}}","id":"{{this.data.user_id}}"}' class="button button-fill button-raised color-orange">Visit User Profile</a></p></div>
					{{/js_compare}}	
				  </div>
				  <hr>
				  <div class="row content-block footer-action">
				  <div class="col-100" onclick="sezzwhoApp.commonFunc.actionButtons('report')"> <p><a href="#" class="button button-fill button-raised color-red"><i class="fa fa-info-circle" aria-hidden="true"></i> REPORT VIDEO</a></p> </div>
                </div>
				{{/if}}
				 {{/each}}
                </div>
				  {{/each}}
				  
            </div>            
      </script>