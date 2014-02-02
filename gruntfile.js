module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
                        src:"bower_components/font-awesome/fonts/*",
                        dest: "static/fonts/",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        src:["bower_components/angular/angular.js","bower_components/angular/angular.min.js","bower_components/angular/angular.min.js.map","bower_components/angular-route/angular-route.js","bower_components/angular-route/angular-route.min.js","bower_components/angular-route/angular-route.min.js.map"],
                        dest: "static/js/lib/angular",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        src:["bower_components/jquery/jquery.js","bower_components/jquery/jquery.min.js","bower_components/jquery/jquery.min.map"],
                        dest: "static/js/lib/jquery",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        src:["bower_components/kineticjs/kinetic.js","bower_components/kineticjs/kinetic.min.js"],
                        dest: "static/js/lib/kinetic",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        src:"bower_components/holderjs/holder.js",
                        dest: "static/js/lib/holder",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        src:["bower_components/socket.io-client/dist/socket.io.js","bower_components/socket.io-client/dist/socket.io.min.js"],
                        dest: "static/js/lib/socket.io",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        src: "scss/javascripts/bootstrap/*",
                        dest: "static/js/lib/bootstrap",
                        expand: true,
                        flatten: true,
                        filter: 'isFile'
                    }
                ]
            }
        }
    });
};
