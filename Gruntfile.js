module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    uglify: {
      all: {
        files: {
          "dist/sisiliano.min.js": ["dist/templates.js", "src/**/*.js" ]
        },
        options: {
          preserveComments: false,
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
    },
    connect: {
      testserver: {
        options: {
          port: 8001,
          base: './'
        }
      }
    },
    watch: {
      testserver: {
        files: ['./dist'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
    },
    copy: {
      main: {
        expand: true,
        cwd: 'src/templates',
        src: '**/*',
        dest: 'dist/templates/',
      }
    },
    clean: ['./dist'],
    html2json: {
      dist: {
         src: ['src/templates/*.html'],
         dest: 'dist/templates.json'
      }
    },
    json: {
      main: {
          options: {
              namespace: 'htmlTempl',
              includePath: false,
              processName: function(filename) {
                  return filename.toLowerCase();
              }
          },
          src: ['dist/templates.json'],
          dest: 'dist/templates.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2json');
  grunt.loadNpmTasks('grunt-json');

  grunt.task.registerTask('test', 'Run unit test cases.',
  function(testname) {
    if (!!testname) {
      grunt.config('qunit.all', ['test/' + testname + '.html']);
    }
    grunt.task.run('qunit:all');
  });

  grunt.registerTask("testserver", ["connect", "watch:testserver"]);
  grunt.registerTask("build", ["clean", "copy", "html2json", "json", "uglify", 'less']);
  grunt.registerTask("default", ["build", "testserver"]);
};

