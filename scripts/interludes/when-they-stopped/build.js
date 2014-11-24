// okay
// here's what you need
// data/interludes/when-they-stopped
//   raw/
//     state-fips.csv
//     commutations.csv
//     death-sentences.csv
//     exonerations.csv
//     last-executions.csv
// data/common/raw/
//   dpic
//     dpic.csv
//   maps/
//     us-10m.json
//
// then run `npm install shelljs`
// then run `node scripts build.js`
// enjoy.

require('shelljs/global');
var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');
var dpicConverter = require('../../util/dpic-to-json.js');

rm('data/interludes/when-they-stopped/states.topo.json');
rm('data/interludes/when-they-stopped/data.json');


// Build events list:
// Parse dpic - add execution events

// To be populated by the async functions.
var executions;
var commutations;
var exonerations;
var lastExecutions;
var deathSentences = {};
var states = {};

var asyncFunctions = [
  function() {
    var rawData = fs.readFileSync('data/interludes/when-they-stopped/raw/state-fips.csv').toString();
    var events = [];

    csv()
      .from.string(rawData)
      .to.array(function (data) {
        for (var i = 1; i < data.length; i++) {
          states[data[i][0]] = data[i][2];
        }
        countResult();
      });
  },
  function() {
    dpicConverter.convert('data/common/raw/dpic/dpic.csv', function(result) {
      executions = result;
      countResult();
    });
  },
  function() {
    dpicConverter.convert('data/interludes/when-they-stopped/raw/last-executions.csv', function(result) {
      lastExecutions = result;
      countResult();
    });
  },
  function() {
    dpicConverter.convert('data/interludes/when-they-stopped/raw/commutations.csv', function(result) {
      commutations = result;
      countResult();
    });
  },
  function() {
    dpicConverter.convert('data/interludes/when-they-stopped/raw/exonerations.csv', function(result) {
      exonerations = result;
      countResult();
    });
  },
  function() {
    var rawData = fs.readFileSync('data/interludes/when-they-stopped/raw/death-sentences.csv').toString();
    var rows = [];

    csv()
      .from.string(rawData)
      .to.array(function (data) {
        // First row is a header.
        for (var j = 1; j < data.length; j++) {
          var stateRow = data[j];
          var state = stateRow[0];
          // console.log(stateRow);
          for (var i = 1; i < stateRow.length; i++) {
            var year = 2014 - i;

            deathSentences[state] = deathSentences[state] || [];
            // console.log(deathSentences);
            deathSentences[state][year] = stateRow[i];
          }
        }
        countResult();
      });

  },
];

var results = 0;
var countResult = function() {
  results++;
  if (results == asyncFunctions.length) {
    processResults();
  }
};

_.each(asyncFunctions, function(fn) { fn.call() });


// When this function is called all of the data globals will be populated.
var processResults = function() {
  var years = {};

  for (var i = 1977; i <= 2014; i++) {
    years[i] = [];
  }

  _.each(executions, function(execution) {
    var year = new Date(execution.date).getFullYear();
    years[year].push({
      type: 'execution',
      state: execution.state.toUpperCase(),
      name: execution.name,
      year: year
    });
  });

  _.each(lastExecutions, function(lastExecution) {
    var state = abbreviateStateName(lastExecution.state);
    if (!state) {
      console.log("Failed to find state " + lastExecution.state);
      return;
    }
    if (lastExecution.date < 1976) {
      // What should we do here?
      return;
    }
    years[lastExecution.date].push({
      type: 'last-execution',
      state: state,
      year: lastExecution.date,
    });
  });

  _.each(commutations, function(commutation) {
    years[commutation.date].push({
      type: 'commutation',
      state: commutation.state,
      year: commutation.date,
      explanation: commutation.explanation,
      name: commutation.name.replace(/^[\d]+\./, '').trim()
    });
  });

  _.each(exonerations, function(exoneration) {
    assertStateExists(exoneration.st);

    if (exoneration.exonerated < 1977) {
      console.log("Dropping exoneration before 1977 in " + exoneration.exonerated);
      return;
    }
    years[exoneration.exonerated].push({
      type: 'exoneration',
      name: exoneration.name,
      state: exoneration.st,
      exonerated: exoneration.exonerated,
      convicted: exoneration.convicted,
      race: exoneration.race,
      reason: exoneration.reason,
    });
  });

  _.each(deathSentences, function(stateRow, state) {
    for (var year = 2013; year > 1976; year--) {
      for (var i = 0; i < stateRow[year]; i++) {
        years[year].push({
          type: 'death-sentence',
          state: state
        });
      }
    }
  });

  var mapLocation = 'data/interludes/when-they-stopped/states.topo.json';

  // Join state name onto the map so that states can be identified
  exec('topojson data/common/raw/maps/us-10m.json -o data/interludes/when-they-stopped/raw/us-10m.topo.json -e data/interludes/when-they-stopped/raw/state-fips.csv -q 1e4 -p');
  // Simplify the map a bit
  exec('mapshaper data/interludes/when-they-stopped/raw/us-10m.topo.json -o '
      + mapLocation +' format=topojson target=states -simplify 10% visvalingam ');

  // Randomize the order of events within each year.
  _.each(years, function(data, year) {
    years[year] = _.shuffle(data);
  });

  var mapJson = fs.readFileSync(mapLocation);
  var finalData = {
    map: JSON.parse(mapJson),
    data: years
  }
  fs.writeFile(
      'data/interludes/when-they-stopped/data.json',
      JSON.stringify(finalData),
      function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log('Success!');
        }
      });
};

var abbreviateStateName = function(name) {
  return _.invert(states)[name.toUpperCase()];
};

var assertStateExists = function(state) {
  if (!states[state.toUpperCase()]) {
    throw new Error("State " + state + " not found.");
  }
}
