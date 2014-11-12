var fs = require('fs');
var dpic = require('./../../../data/interludes/a-narrow-practice/raw/dpic/dpic-corrected-counties.json');
var fips = require('./../../../data/interludes/a-narrow-practice/raw/counties/clean-fips.json');
var _ = require('underscore');

var counts = {};
var entries = [];
for (var i = 0; i < dpic.length; i++) {
  var execution = dpic[i];
  if (execution.federal === 'no') {

    for (var j = 0; j < fips.length; j++) {
      
      // if it's a match
      if (execution.state === fips[j].state.toLowerCase() && execution.county === fips[j].name) {

        var fip = fips[j].id;
        counts[fip] = counts[fip] || {
          "id": parseInt(fip),
          "county": fips[j].longname,
          "state": execution.state,
          "count": 0 };
        counts[fip].count++;


        // check if there's an entry for that fips yet.
/*        var extant = false;
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].id === parseInt(fips[j].id)) {
            entries[k].count++;
          }
        }
        if (!extant) {
          entries.push({
            "id": parseInt(fips[j].id),
            "county": execution.county,
            "state": execution.state,
            "count": 1
          });
        }
*/
      }
    }
  }
}

var fip;
for (fip in counts) {
  entries.push(counts[fip]);
}

var entries = entries.sort(function (a, b) { return a.count < b.count ? 1 : -1; });
_.each(entries, function (entry) {
  entry.topTen = false;
  entry.topTenPercent = false;
  entry.topOnePercent = false;
});
for (var i = 0; i < 10; i++) {
  entries[i].topTen = true;
}
for (var i = 0; i < Math.round(fips.length * 0.1); i++) {
  entries[i].topTenPercent = true;
}
for (var i = 0; i < Math.round(fips.length * 0.01); i++) {
  entries[i].topOnePercent = true;
}

fs.writeFile(
  'data/interludes/a-narrow-practice/counties.json',
  JSON.stringify(entries),
  function (error) { console.log(error ? error : "json file written."); }
);

var header = "id,state,county,count,topTen,topOnePercent,topTenPercent\n";
for (var i = 0; i < entries.length; i++) {
  header += entries[i].id + ',';
  header += entries[i].state + ',';
  header += entries[i].county + ',';
  header += entries[i].count + ',';
  header += entries[i].topTen + ',';
  header += entries[i].topOnePercent + ',';
  header += entries[i].topTenPercent + ',';
  header += "\n";
}

fs.writeFile(
  'data/interludes/a-narrow-practice/counties.csv',
  header,
  function (error) { console.log(error ? error : "csv file written."); }
);