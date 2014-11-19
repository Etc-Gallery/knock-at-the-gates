// okay
// here's what you need
// data/
//   interludes/
//     how-we-kill/
//        raw/
//          dpic/
//            dpic.csv
//          espy/
//            DS0001/
//              08451-0001-Data.txt
//       
//
// then run `npm install shelljs`
// then run `node scripts build.js`
// enjoy.

require('shelljs/global');

exec('node scripts/interludes/how-we-kill/sort-and-cull-espy-data.js');
exec('node scripts/interludes/how-we-kill/dpic-to-json.js');
exec('node scripts/interludes/how-we-kill/combine-and-stack-by-method.js');