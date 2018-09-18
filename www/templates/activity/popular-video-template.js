      			<div class="content-block-title">Most Popular Videos</div>
                  <div class="swiper-container swiper-3">
                    <div class="swiper-pagination"></div>
                    <div class="swiper-wrapper">
                     {{#each ../item}}
					  
				      <div class="swiper-slide"><span> <video width="100%" height="128" poster="http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/{{ziggeocode}}/image" controls>
            <source src="http://embed.ziggeo.com/v1/applications/ddd4366d3fc0baef95c333fa575c53f9/videos/{{ziggeocode}}/video.mp4" type="video/mp4"> </video></span></div>
					  {{/each}}
                    </div>
                 </div>
      
