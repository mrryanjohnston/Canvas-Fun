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
                    }
                ]
            }
        }
    });
};
