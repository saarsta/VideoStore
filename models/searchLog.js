var db = require('../dbconnection');

var SearchLog = {
    getAllLogs:function(callback){
        return db.query("Select * from search_log",callback);
    },

    getLogById:function(id,callback){
        return db.query("select * from search_log where search_log_id=?",[id],callback);
    },

    addLog: function (searchTypes, searchValues, resCount, callback) {
        searchTypes = searchTypes.join(', ');
        searchValues = searchValues.join(', ');

        var timestamp = new Date();

        return db.query("Insert into search_log (timestamp, search_types, search_values, result_count) values (?,?,?,?)",
        [
            timestamp,
            searchTypes,
            searchValues,
            resCount
        ],callback);
    }
};

module.exports = SearchLog;