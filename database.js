module.exports = function(settings){

    /***
    * MongoDB objects
    */
    var mongo = {
    Db : require('mongodb').Db,
    MongoClient : require('mongodb').MongoClient,
    Server : require('mongodb').Server,
    ReplSetServers : require('mongodb').ReplSetServers,
    ObjectID : require('mongodb').ObjectID,
    Binary : require('mongodb').Binary,
    GridStore : require('mongodb').GridStore,
    Code : require('mongodb').Code,
    BSON : require('mongodb').BSON,
    }
    return mongo
}
