module.exports = function(grunt) {

  var jsDependencies = [
    'public/js/vendor/*.js',
    'public/js/app.js',
    'public/js/router.js',
    'public/js/lib/*.js',
    'public/js/interludes/*.js',
    'public/js/essays/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dev: {
        options: {
          sassDir: 'public/scss',
          cssDir: 'public/css',
          outputStyle: 'compact',
          force: true,
          noLineComments: true
        }
      },
      prod: {
        options: {
          sassDir: 'public/scss',
          cssDir: 'public/css',
          outputStyle: 'compressed',
          environment: 'production',
          force: true
        }
      }
    },
    uglify: {
      dev: {
        files: {
          'public/main.min.js': jsDependencies
        },
        options: {
          sourceMap: true,
          compress: false,
          mangle: false
        }
      },
      prod: {
        files: {
          'public/main.min.js': jsDependencies
        },
        options: {
          sourceMap: false,
          compress: true,
          mangle: true,
          'screw-ie8': true,
          lint: true
        }
      }
    },
    watch: {
      scss: {
        files: 'public/scss/**/*.scss',
        tasks: ['compass:dev'],
      },
      js: {
        files: ['public/js/**/*.js'],
        tasks: ['uglify:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['compass:dev', 'watch']);
  grunt.registerTask('productionize', ['uglify:prod', 'compass:prod']);
};
