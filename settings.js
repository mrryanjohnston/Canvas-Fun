i = module.exports;

/***
* Directories and filepaths
*/
i.project_directory = __dirname;
i.views_directory = i.project_directory+"/views";
i.static_directory = i.project_directory+"/static";
i.favicon_path = i.static_directory+"/img/favicon-16.ico";

/***
* Web server settings
*/
i.port = 8061;
i.session_key = "p2(236cVb3S#a'25gffDxrR|tb{{bddR31aAz35917";

/***
* Database server settings
*/
i.database_host = "127.0.0.1";
i.database_port = 27017;
