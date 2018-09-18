// JavaScript Document
var path = require('path');
var debug= process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = function(grunt) {
  // Do grunt-related things in here
// Project configuration. 
grunt.initConfig({
  concat: {
    options: {
      separator: ';',
    },
    js: {
      src: [
	  'js/lang/en-us.js',
	  'js/welcome/welcomescreen.js',
	  'framework7/my-app.js', 
	  'js/app.js', 
	  'js/services/services.js',
	  'js/controller/common.js',
	  'js/controller/feed.js',
	  'js/controller/following.js',
	  'js/controller/sezzwhovideo.js',
	  'js/controller/comment.js',
	  'js/controller/notification.js',
	  'js/controller/detailpage.js',
  	  'js/controller/review.js',
	  'js/controller/search.js',
	  'js/controller/addbusiness.js',
	  'js/controller/profile.js',
	  'js/controller/setting.js',
	  'js/controller/registration.js',
	  'js/controller/appp-camera.js',
	  'js/controller/popularvideo.js',
	  'js/controller/videodetail.js',
	  'js/controller/single.js',
	  'js/controller/lostpassword.js',
	  'js/controller/followinglist.js',
	  'js/controller/followerlist.js',
	  'js/controller/fcm-notification.js',
	  'js/components/geolocation.js',
	  'js/components/ziggeo_recording.js'

	  ],
      dest: 'dist/js/script.js',
    },
	 css: {
      src: [
	  		'css/welcomescreen.css',
	  		'css/app.css',
			'css/notification/style.css'
			
	  ],
      dest: 'dist/css/style.css',
    },
  },
  jshint: {
    all: ['Gruntfile.js']
  },
  uglify: {
    options: {
      mangle: true
    },
    my_target: {
      files: {
        'lib/script.min.js': ['dist/js/script.js']
      }
    }
  },
  watch: {
  js: {
    files: ['js/**/*.js','framework7/*.js'],
    tasks: ['concat'],
    options: {
      spawn: false,
    },
  },
  css:{
    files: ['css/**/*.css'],
    tasks: ['concat'],
    options: {
      spawn: false,
    },
  },
},

  cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: 'dist/css',
      src: ['*.css', '!*.min.css'],
      dest: 'lib/css',
      ext: '.min.css'
    }]
  }
},
react: {
    single_file_output: {
      files:[ {
        'build/editvideo/editvideo.js': 'js/react/editvideo/editvideo.js'
      },
	  {
		'build/profile/profileReact.js': 'js/react/profile/profileReact.js'
	  },
	  {
		'build/register/registerReact.js': 'js/react/register/registerReact.js'
	  },
	  {
		'build/setting/settingReact.js': 'js/react/setting/settingReact.js'
	  },
	  {
		'build/setting/settingReact-ios.js': 'js/react/setting/settingReact-ios.js'

	  }
	  ]
	  
    },
    combined_file_output: {
      files: {
        'lib/combined.js': [
          'js/react/editvideo/editvideo.js',
          'js/react/profile/profileReact.js'
        ]
      }
    },
    dynamic_mappings: {
      files: [
        {
          expand: true,
          cwd: 'path/to/jsx/templates/dir',
          src: ['**/*.jsx'],
          dest: 'path/to/output/dir',
          ext: '.js'
        }
      ]
    }
  },
jsx: {
        client: {
          src: 'js/react/editvideo/editvideo.js',
          dest: 'build/editvideo/editvideo.js',
        }
	},
	sass: {                              // Task 
    dist: {                            // Target 
      options: {                       // Target options 
        style: 'expanded'
      },
      files: {                         // Dictionary of files 
        'lib/scss/foundation/main.css': 'scss/foundation.scss',       // 'destination': 'source' 
        'widgets.css': 'widgets.scss'
      }
    }
  },
  requirejs: {
    compile: {
      options: {
        baseUrl: "../www",
        mainConfigFile: "js/require/config.js",
        name: "js/vendor/firebase",
	    out: "lib/optimized.js"
      }
    }
  },
	webpack: {
		 productionWebpack: {
			context:__dirname + "js",
			  entry:path.resolve("js/controller/ziggeo.js"),
			 devtool:  null, // inlines SourceMap into orginal file
			  debug: false,
			  node: {
			  fs: "empty"	
				},
			  module: {	
			  loaders:[
				{
				  test:/\.js?$/,
				  exclude:/(node_modules | bower_components)/,	
					loader: 'babel-loader',
					// the loader which should be applied, it'll be resolve relative to the context
					// -loader suffix is no longer optional in Webpack 2 for clarity reasons
					// see webpack 1 upgrade guide
			
					query: {
					  presets: ['babel-preset-es2015','babel-preset-react','babel-preset-stage-0'].map(require.resolve)
					}
					// options for the loader
				  },
				  { 
					test: /\.css$/, 
					loader: "style-loader!css-loader" ,
						options: {
							modules: true
						}
					},
					{ test: /\.png$/, loader: "url-loader?limit=100000" },
					{ test: /\.jpg$/, loader: "file-loader" }
				]	  
			  },
			   output: {
				path:__dirname + "/lib",
				filename: "optimized.min.js"
			  },
			  plugins: [
						
						new webpack.optimize.DedupePlugin(),
						new webpack.optimize.OccurenceOrderPlugin(),
						new webpack.optimize.UglifyJsPlugin({mangel:false, soucemap:false})
			
					]
		 
		  },
		  devlopementWebpack: {
			  
			  context:__dirname + "/js",
			  entry:path.resolve("js/controller/ziggeo.js"),
			  devtool: "inline-source-map", // inlines SourceMap into orginal file
			  debug: true,
			  resolveLoader: {
				  root: path.join(__dirname, 'node_modules')
			},
			node: {
			  fs: "empty"	
			},
			resolve: {
   				 modules: [path.resolve(__dirname, "src"), "node_modules"]
				
			},
			  module: {	
			  loaders:[
				{
				  test:/\.js?$/,
				  
				    exclude:/(node_modules | bower_components)/,	
					loader: 'babel-loader',
					// the loader which should be applied, it'll be resolve relative to the context
					// -loader suffix is no longer optional in Webpack 2 for clarity reasons
					// see webpack 1 upgrade guide
			
					query: {
					  presets: ['babel-preset-es2015','babel-preset-react','babel-preset-stage-0'].map(require.resolve)
					
					}
					// options for the loader
				  },
				  { 
					test: /\.css$/, 
					loader: "style-loader!css-loader" ,
						options: {
							modules: true
						}
					},
					{ test: /\.png$/, loader: "url-loader?limit=100000" },
					{ test: /\.jpg$/, loader: "file-loader" }
				]	  
			  },
			   output: {
				path:__dirname + "/lib",
				filename: "optimized.js"
			  },
			  plugins: []
			  
			  }
}
  
});
	  grunt.loadNpmTasks('grunt-contrib-concat');
	  grunt.loadNpmTasks('grunt-contrib-watch');
	  grunt.loadNpmTasks('grunt-contrib-jshint');
	  grunt.loadNpmTasks('grunt-contrib-uglify');
	  grunt.loadNpmTasks('grunt-contrib-cssmin');
	  grunt.loadNpmTasks('grunt-processhtml');
	  grunt.loadNpmTasks('grunt-react');
	  grunt.loadNpmTasks('grunt-jsx');
	  grunt.loadNpmTasks('grunt-contrib-sass');
	  grunt.loadNpmTasks('grunt-requirejs');
	  grunt.loadNpmTasks('grunt-webpack');
	  grunt.loadNpmTasks('grunt-babel');


};