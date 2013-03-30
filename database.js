i = module.exports;
i.database_connection = new Db('cards', new Server("127.0.0.1", 27017, {}), {w: 1});
//i.query = function(err, collection) {
