   {{#each ../item}}
	  <div class="list-block notification-{{notificationId}}" id="notification-{{notificationId}}" >
	   <ul>
        <li class="item-content" >
        
          <!--<div class="item-inner">
            <div class="item-title">Item title</div>
            <div class="item-after">Label</div>
          </div> -->
        
			  <div class="wrapper">
			 <a href="pages/android/detailpage.html?id={{senderid}}&username={{nickname}}&accountType={{account_type}}" data-context='{"accountType":"{{account_type}}","id":"{{senderid}}"}'><img src="{{avatar}}" alt="" onError="this.onerror=null;this.src='images/gravatar.png';"></a>
			  <article>
				<h2><a href="pages/android/detailpage.html?id={{senderid}}&username={{nickname}}" data-context='{"accountType":"{{account_type}}","id":"{{senderid}}"}' target="_blank" >@{{nickname}}</a></h2>
				<p>
				{{#js_compare "this.componentname === 'refer'"}}
				<i class="fa fa-heart"></i><strong> @{{refername}} </strong>recommended<strong> @{{video_refer_name}}</strong> <i class="fa fa-video-camera"></i> video to you. <a href="pages/android/singlepage.html?item={{itemid}}&markID={{notificationId}}"><i class="fa fa-bars fa-2x"></i> View</a>
               				
				{{else}}
					{{#js_compare "this.componentname === 'ditto'"}}
					<i class="fa fa-heart"></i> {{refername}} dittod your <i class="fa fa-video-camera"></i> video. <a href="pages/android/singlepage.html?item={{itemid}}&markID={{notificationId}}"><i class="fa fa-bars"></i> View</a>
						{{else}}		
					 {{content}}
						<a href="pages/android/singlepage.html?item={{itemid}}&markID={{notificationId}}"><i class="fa fa-bars"></i> View</a>                 				
					{{/js_compare}}
				{{/js_compare}}
				</p>
			  </article>
			  <nav>
				<ul>
				  <li class="time"><i class="fa fa-clock-o"></i> {{time}}</li>
				  <li><a href="#" data-id="{{notificationId}}" class="fa fa-trash fa-fg theme-red notification-delete"></a></li>
				
				</ul>
			  </nav>
			</div>
			</li>
			</ul>
		</div>
          
      {{/each}}
