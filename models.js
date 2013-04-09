module.exports = function models_function(mongoose) {
    //var models = {
    var schema = mongoose.Schema
    ,   objectid = schema.ObjectId;

    var user_schema = new schema({
           username : String
        ,  password : String
        ,  salt : String
        ,  email : String
        ,  date_signup : { type: Date, default: Date.now }
        ,  date_login : Date
        ,  record_games_won : { type : Number, default: 0 }
        ,  record_games_lost : { type : Number, default : 0 }
        ,  avatar_url : { type : String, default : '' }
    });
    //}
    //return models;
    return mongoose.model('User', user_schema);
}
