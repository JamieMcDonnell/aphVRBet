module.exports = function(grunt) {
  'use strict';
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.initConfig({
    clean: {
      dist: 'dist'
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    concat: {
        app: {
            options: {
                  stripBanners: true
            },
            src: [
                "js/third-party/webvr-polyfill.js",
                "js/third-party/wglu/wglu-url.js",
                "js/third-party/gl-matrix-min.js",
                "js/third-party/wglu/wglu-debug-geometry.js",
                "js/third-party/wglu/wglu-program.js",
                "js/third-party/wglu/wglu-stats.js",
                "js/third-party/wglu/wglu-texture.js",
                "js/vr-cube-island.js",
                "js/vr-samples-util.js"
            ],
            dest: 'dist/js/app.js'
        }
    },
    uglify: {
      options: {
        preserveComments: 'false'
      },
      app: {
        src: 'dist/js/app.js',
        dest: 'dist/js/app.min.js'
      }
    },
    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'dist/'
      },
      img: {
        cwd: 'img',  // set working folder / root to copy
        src: '**/*',           // copy all files and subfolders
        dest: 'dist/img',    // destination folder
        expand: true           // required when using cwd
      },
      ajax: {
        cwd: 'ajax',  // set working folder / root to copy
        src: '**/*',           // copy all files and subfolders
        dest: 'dist/ajax',    // destination folder
        expand: true           // required when using cwd
       },
       fontAwesome: {
        expand: true,
	cwd: 'node_modules/font-awesome/fonts/',
    	src: ['**'],
        dest: 'dist/fonts'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });


  
  grunt.registerTask('default-js', ['clean:dist', 'concat:app', 'uglify:app', 'jshint']);
  grunt.registerTask('default', ['default-js']);

};