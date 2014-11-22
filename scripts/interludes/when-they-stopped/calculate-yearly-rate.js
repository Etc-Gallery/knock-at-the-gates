var fs = require('fs');
var _ = require('underscore');
var dpicData = require('../../../data/common/dpic-full.json');

Assert = {}

Assert.assertEquals = function(a, b) {
  if (a != b) {
    throw new Error("Expected " + a + " but got " + b + ".");
  }
};

Assert.assertTrue = function(expr) {
  Assert.assertEquals(true, expr);
};

// Normalize.
dpicData = _.map(dpicData, function(datum) {
  datum.State = datum.State.toLowerCase();
  Assert.assertEquals(2, datum.State.length);
  datum.Year = new Date(datum.Date).getFullYear();
  return datum;
});

// Group the data by state
var dataByState = _.groupBy(dpicData, 'State');

// Group the data by year, within each state. Filling in empty years with zeros.
var dataByStateAndYear = {};
_.each(dataByState, function(stateExecutions, state) {
  var years = [];
  for (var i = 1976; i < 2015; i++) {
    years[i] = _.filter(stateExecutions, function(execution) {
      return execution.Year == i;
    }).length;
  }
  dataByStateAndYear[state] = years;
});

// Calculate the running average.
var runningYears = 3;
var yearlyRatesByState = {};
_.each(dataByStateAndYear, function(executionsByYear, state) {
  years = {};
  for (var i = 1976; i < 2015; i++) {
    var numExecutions = 0;
    for (var j = i - runningYears + 1; j <= i; j++) {
      executions = executionsByYear[j] || 0;
      numExecutions += executionsByYear[j] || 0;
    }
    years[i] = numExecutions / runningYears;
  }
  yearlyRatesByState[state] = years;
});

var dataDir = "data/interludes/when-they-stopped/";
fs.writeFileSync(
    dataDir + "yearly-rate-by-state.json", JSON.stringify(yearlyRatesByState));
