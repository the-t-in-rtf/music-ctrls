module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    uglify: {
      all: {
        files: {
          "dist/sisiliano.min.js": [ "src/**/*.js" ]
        },
        options: {
          preserveComments: false,
          report: "min",
          beautify: {
            ascii_only: true
          }
        }
      }
    },
    less: {
      all: {
        options: { compress: true },
        files: {
          "dist/sisiliano.min.css": [ "src/**/*.css" ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');

  grunt.task.registerTask('test', 'Run unit tests, or just one test.',
  function(testname) {
    if (!!testname) {
      grunt.config('qunit.all', ['test/' + testname + '.html']);
    }
    grunt.task.run('qunit:all');
  });

  grunt.registerTask("testserver", ["watch:testserver"]);
  grunt.registerTask("default", ["uglify", 'less']);
};

