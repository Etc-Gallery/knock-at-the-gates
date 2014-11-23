// okay
// here's what you need
// data/interludes/a-narrow-practice
//   raw/
//     maps/
//       us-10m.json
//     counties/
//       fips.csv
// data/common/raw/
//   dpic
//     dpic.csv
//
// then run `npm install shelljs`
// then run `node scripts build.js`
// enjoy.

require('shelljs/global');

if (!which('topojson')) {
  echo('Sorry, this script requires topojson');
  exit(1);
}
if (!which('mapshaper')) {
  echo('Sorry, this script requires mapshaper');
  exit(1);
}

rm('data/interludes/a-narrow-practice/us.topo.json');
rm('data/interludes/a-narrow-practice/us.topo-index.json');

exec('node scripts/interludes/a-narrow-practice/dpic-to-json.js');
exec('node scripts/interludes/a-narrow-practice/isolate-dpic-counties.js');
exec('node scripts/interludes/a-narrow-practice/clean-county-names.js');
exec('node scripts/interludes/a-narrow-practice/standardize-dpic-counties.js');
exec('node scripts/interludes/a-narrow-practice/merge-counts-and-fips.js');

exec('topojson data/interludes/a-narrow-practice/raw/maps/us-10m.json -o data/interludes/a-narrow-practice/raw/maps/us-10m.topo.json -e data/interludes/a-narrow-practice/counties.csv -q 1e4 -p');
exec('mapshaper data/interludes/a-narrow-practice/raw/maps/us-10m.topo.json -o data/interludes/a-narrow-practice/us.topo.json --visvalingam');
