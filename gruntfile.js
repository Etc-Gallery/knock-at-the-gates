module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      build: {
        options: {
          sassDir: 'public/scss',
          cssDir: 'public/css',
          outputStyle: 'compact',
          force: true,
          noLineComments: true
        }
      }
    },
    uglify: {
      dev: {
        files: {
          'public/main.min.js' : [
            'public/js/vendor/*.js',
            'public/js/app.js',
            'public/js/lib/*.js',
            'public/js/interludes/*.js'
          ],
        },
        options: {
          sourceMap: true
        }
      }
    },
    watch: {
      scss: {
        files: 'public/scss/**/*.scss',
        tasks: ['compass:build'],
      },
      js: {
        files: ['public/js/**/*.js'],
        tasks: ['uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['compass:build', 'watch']);
};
