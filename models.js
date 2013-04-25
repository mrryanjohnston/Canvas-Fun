module.exports = function models_function(mongoose, settings) {
    var schemas = {
        user_schema: {
                id : { type: Number, default: 1, unique: true }
            ,   email : { type: String, unique: true }
            ,   password : String
            ,   salt : String
            ,   username : String
            ,   date_signup : { type: Date, default: Date.now }
            ,   date_login : Date
            ,   record_games_won : { type : Number, default: 0 }
            ,   record_games_lost : { type : Number, default : 0 }
            ,   avatar_url : { type : String, default : '' }
        }
    };
    var models = {
        user: mongoose.model('user', schemas.user_schema, settings.mongodb_collections.user_accounts)
    };
    // http://stackoverflow.com/questions/14454271/auto-increment-document-number-in-mongo-mongoose
    //console.log(models.user.pre);
    //console.log(mongoose);
    mongoose.modelSchemas.user.pre('save', function pre_save_call(next) {
        console.log("OK!");
        var doc = this;
        mongoose.models.user.findByIdAndUpdate( settings.user_id, { $inc: { nextSeqNumber: 1 } }, function pre_save_call_2(error, id) {
            if (error) next(error);
            doc.number = mongoose.models.user.nextSeqNumber - 1;
            next();
        });
    });
    return models;
}
