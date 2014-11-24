var fs  = require('fs');
var csv = require('csv');

exports.convert = function(filePath, callback) {
  var rawData = fs.readFileSync(filePath).toString();
  var events = [];

  csv()
    .from.string(rawData)
    .to.array(function (data) {
      var headers = data[0];
      for (var i = 1; i < data.length; i++) {
        var record = {};
        for (var j = 0; j < headers.length; j++) {
          var key = data[0][j].trim().toLowerCase();
          record[key] = data[i][j].trim().toLowerCase();
        }
        events.push(record);
      }
      events = events.sort(function (a, b) {
        if (Date.parse(a.date) > Date.parse(b.date)) {
          return 1;
        } else {
          return -1;
        }
      });
      callback(events);
    });
}
