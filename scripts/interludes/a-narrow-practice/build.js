// okay
// here's what you need
// data/interludes/a-narrow-practice
//   raw/
//     counties/
//       fips.csv
// data/common/raw/
//   dpic
//     dpic.csv
//   maps/
//     us-10m.json
//
// then run `npm install` if you haven't already
// then run `node scripts build.js`
// enjoy.

require('shelljs/global');

// These should be installed by npm install, this is a sanity check.
if (!which('topojson')) {
  echo('Sorry, this script requires topojson');
  exit(1);
}
if (!which('mapshaper')) {
  echo('Sorry, this script requires mapshaper');
  exit(1);
}

rm('data/interludes/a-narrow-practice/us.topo.json');

exec('node scripts/interludes/a-narrow-practice/dpic-to-json.js');
exec('node scripts/interludes/a-narrow-practice/isolate-dpic-counties.js');
exec('node scripts/interludes/a-narrow-practice/clean-county-names.js');
exec('node scripts/interludes/a-narrow-practice/standardize-dpic-counties.js');
exec('node scripts/interludes/a-narrow-practice/merge-counts-and-fips.js');

exec('topojson data/common/raw/maps/us-10m.json -o data/interludes/a-narrow-practice/raw/maps/us-10m.topo.json -e data/interludes/a-narrow-practice/counties.csv -q 1e4 -p');
exec('mapshaper data/interludes/a-narrow-practice/raw/maps/us-10m.topo.json -o data/interludes/a-narrow-practice/us.topo.json format=topojson -simplify 10% visvalingam');
