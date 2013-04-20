module.exports = function models_function(mongoose, settings) {
    var schemas = {
        user_schema: {
            username : { type: String, unique: true }
            ,  password : String
            ,  salt : String
            ,  email : String
            ,  date_signup : { type: Date, default: Date.now }
            ,  date_login : Date
            ,  record_games_won : { type : Number, default: 0 }
            ,  record_games_lost : { type : Number, default : 0 }
            ,  avatar_url : { type : String, default : '' }
        }
    };
    var models = {
        user: mongoose.model('user', schemas.user_schema, settings.mongodb_collections.user_accounts)
    };
    return models;
}
