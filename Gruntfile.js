'use strict';

module.exports = function (grunt) {

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig(
        {

            pkg: grunt.file.readJSON('package.json'),

            stylus: {
                compile: {
                    options: {
                        compress: false,
                        paths: ['src/**/*']
                    },
                    files: {
                        'dist/app.css': 'src/app.styl'
                    }
                }
            },

            jade: {
                compile: {
                    options: {
                        client: false,
                        pretty: true,
                        data: function (dest, src) {
                            var books = require('fs').readFileSync(
                                __dirname+'/src/books.json',
                                {encoding: 'utf-8'}
                            );
                            return { books: JSON.parse(books) }
                        }
                    },
                    files: [ {
                        cwd: 'src/',
                        src: ['index.jade'],
                        dest: 'dist',
                        expand: true,
                        ext: '.html'
                    } ]
                }
            },

            copy: {
                main: {
                    files: [{
                        expand: true,
                        flatten: true,
                        src: [
                            'src/**/*.jpg',
                            'src/**/*.png',
                            'src/**/*.js',
                            'src/*.html',
                            'src/CNAME'
                        ],
                        dest: 'dist/',
                        filter: 'isFile'
                    }]
                }
            },

            watch: {
                styles: {
                    files: ['src/**/*.styl'],
                    tasks: ['stylus', 'jade']
                },
                html: {
                    files: ['src/**/*.jade'],
                    tasks: ['jade']
                }
            },

            'gh-pages': {
                options: {
                    base: 'dist',
                    clone: 'node_modules/.tmp/'
                },
                src: ['**']
            }
        }
    );

    grunt.registerTask('build',   ['copy', 'stylus', 'jade']);
    grunt.registerTask('publish', ['build', 'gh-pages']);
    grunt.registerTask('default', ['build', 'watch']);
};
