// okay
// here's what you need
// data/
//   interludes/
//     the-changing-face/
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

exec('node scripts/interludes/the-changing-face/sort-and-cull-espy-data.js');
exec('node scripts/interludes/the-changing-face/dpic-to-json.js');
exec('node scripts/interludes/the-changing-face/combine-and-stack-by-method.js');