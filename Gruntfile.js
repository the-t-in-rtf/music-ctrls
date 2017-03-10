module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                stripBanners: true,
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                "<%= grunt.template.today('yyyy-mm-dd') %> \n\n*/"
            },
            dist: {
                separator: "\n\n",
                src: ["dist/templates.js", "src/index.js", "src/core/**/*.js", "src/controllers/**/*.js"],
                dest: "dist/sisiliano.js"
            }
        },
        uglify: {
            all: {
                files: {
                    "dist/sisiliano.min.js": ["dist/sisiliano.js"]
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
                    "dist/sisiliano.min.css": [ "src/main.less", "src/controllers/**/*.less" ]
                }
            }
        },
        connect: {
            "demo-server": {
                options: {
                    port: 8001,
                    base: "./demo"
                }
            }
        },
        watch: {
            testserver: {
                files: ["./dist"],
                tasks: ["jshint"],
                options: {
                    spawn: false
                }
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: "src/controllers",
                src: "**/*.html",
                dest: "dist/templates/"
            },
            "demo-public": {
                expand: true,
                src: [
                    "node_modules/**/*.*",
                    "dist/**/*.*"
                ],
                dest: "demo/source"
            },
            "test": {
                expand: true,
                src: [
                    "node_modules/qunit/qunit/qunit.js",
                    "node_modules/qunit/qunit/qunit.css",
                    "node_modules/jquery-simulate-ext/libs/bililiteRange.js",
                    "node_modules/jquery-simulate-ext/libs/jquery.simulate.js",
                    "node_modules/jquery-simulate-ext/src/jquery.simulate.ext.js",
                    "node_modules/jquery-simulate-ext/src/jquery.simulate.drag-n-drop.js",
                    "node_modules/jquery-simulate-ext/src/jquery.simulate.key-sequence.js",
                    "node_modules/jquery-simulate-ext/src/jquery.simulate.key-combo.js"
                ],
                dest: "test/html/lib"
            }
        },
        clean: {
            dist: ["./dist", "./demo/source"]
        },
        html2json: {
            dist: {
                src: ["src/controllers/**/*.html"],
                dest: "dist/templates.json"
            }
        },
        json: {
            main: {
                options: {
                    namespace: "htmlTempl",
                    includePath: false,
                    processName: function(filename) {
                        return filename.toLowerCase();
                    }
                },
                src: ["dist/templates.json"],
                dest: "dist/templates.js"
            }
        },
        qunit: {
            all: ["test/html/index.html"]
        },
        jshint: {
            all: ["**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "JST"
                },
                files: {
                    "dist/handlebars.js": "src/controllers/**/*.html"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-html2json");
    grunt.loadNpmTasks("grunt-json");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-handlebars");

    grunt.registerTask("demo", ["connect:demo-server", "watch:testserver"]);
    grunt.registerTask("build", ["clean:dist", "copy:main", "html2json", "json", "concat", "uglify", "less",
        "copy:demo-public", "copy:test"]);
    grunt.registerTask("default", ["build", "test"]);
    grunt.registerTask("test", ["jshint", "qunit"]);
};
