module.exports = function settings_function() {
    var settings = {

        debug: true,

        /***
        * Directories and filepaths
        */
        project_directory:  __dirname,
        views_directory: __dirname+"/views",
        static_directory: __dirname+"/static",
        favicon_path: __dirname+"/static/img/favicon-16.ico",
        routes_path: __dirname+"/routes.js",
        models_path: __dirname+"/models.js",
        colors_path: __dirname+"/colors.js",

        /***
        * Web server settings
        */
        port: 8000,
        session_key: "2cards2furious",
        session_secret: "p2(236cVb3S#a,25gffDxrR|tb{{bddR31aAz35917",
        cookie_secret: "11rn@J2d9SSv21qz%17201439pKTB28cnOWe4cjd!kd",

        /***
        * Database server settings
        */
        database_host: "127.0.0.1",
        database_port: 27017,
        mongodb_database_name: "cards",
        mongodb_salt_keyword: "salty"+String(Math.floor(Math.random()*10000000000000000))+"poop",
        /*
        mongodb_options: {
            user: "cards_user_xd43hgEdjRLfks33gfddsw3",
            pass: "cards_password_j3#5gfd343wxzZs",
            server: { poolSize: 5 }
        },
        */
        mongodb_collections: {
            user_accounts: "users"
        },
        redis_settings: {
            host: "127.0.0.1",
            port: "6379",
            pass: "SHittYpAssWORd",
            db: "cards",
            ttl: 60*60*24*365 //Cookies last a year
        },
        context : {
            version : 1,
            year : new Date().getFullYear(),
            errors : [],
            messages : []
        }
    }
    return settings;
}
