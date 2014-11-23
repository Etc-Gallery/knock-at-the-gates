// GET COUNTY COUNTS
//
// The aim of this script is to calculate what percentage of counties are responsible for what percantage of executions.



var counties = require('./../../../data/interludes/a-narrow-practice/counties.json');
var fips = require('./../../../data/interludes/a-narrow-practice/raw/counties/clean-fips.json');
var _ = require('underscore');

var totalExecutions = 0;
_.each(counties, function (county) { totalExecutions += county.count; });
console.log("total executions:", totalExecutions);

var totalCounties = 0;
_.each(fips, function (county) { totalCounties += 1; });
console.log("total counties:", totalCounties);

var sortedCounties = counties.sort(function (a, b) {
  return a.count < b.count ? 1 : -1;
});
console.log("total counties that have executed:", sortedCounties.length);

var topTenCounties = sortedCounties.slice(0,10);
var topTenExecutionCount = 0;
_.each(topTenCounties, function (county) { topTenExecutionCount += county.count; });
console.log("% of executions by the top 10 counties", (topTenExecutionCount / totalExecutions) * 100);

var topOnePercentCounties = sortedCounties.slice(0, Math.round(totalCounties * 0.01));
var topTenPercentCounties = sortedCounties.slice(0, Math.round(totalCounties * 0.1));
var topOnePercentExecutionCount = 0, topTenPercentExecutionCount = 0;
_.each(topOnePercentCounties, function (county) { topOnePercentExecutionCount += county.count; });
_.each(topTenPercentCounties, function (county) { topTenPercentExecutionCount += county.count; });
console.log("% of exeuctions by the top 1% of counties", (topOnePercentExecutionCount / totalExecutions) * 100);
console.log("% of executions by the top 10% of counties", (topTenPercentExecutionCount / totalExecutions) * 100);
