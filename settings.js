module.exports = function settings_function() {
    var settings = {

    /***
    * Directories and filepaths
    */
    project_directory:  __dirname,
    views_directory: __dirname+"/views",
    static_directory: __dirname+"/static",
    favicon_path: __dirname+"/static/img/favicon-16.ico",
    routes_path: __dirname+"/routes.js",
    database_path: __dirname+"/database.js",

    /***
    * Web server settings
    */
    port_http: 8000 ,
    port_sockets: 3000 ,
    session_key: "p2(236cVb3S#a,25gffDxrR|tb{{bddR31aAz35917",

    /***
    * Database server settings
    */
    database_host: "127.0.0.1",
    database_port: 27017 
    }
    return settings;
}
