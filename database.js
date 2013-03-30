i = module.exports;

var settings = require.cache('./settings.js');

var Db = require('mongodb').Db
  , MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server
  , ReplSetServers = require('mongodb').ReplSetServers
  , ObjectID = require('mongodb').ObjectID
  , Binary = require('mongodb').Binary
  , GridStore = require('mongodb').GridStore
  , Code = require('mongodb').Code
  , BSON = require('mongodb').BSON


i.database_connection = function(settings) {
    console.log("****");
    console.log(settings.project_directory);
    console.log("****");
    //return new Db('cards', new Server(settings.database_host, settings.database_port, {}), {w: 1});
}

//i.query = function(err, collection) {
