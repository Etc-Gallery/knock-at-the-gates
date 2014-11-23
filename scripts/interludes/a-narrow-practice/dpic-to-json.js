var converter = require('../../util/dpic-to-json');
var fs = require('fs');

converter.convert(
    'data/common/raw/dpic/dpic.csv',
    function(executions) {
      fs.writeFile(
        'data/interludes/a-narrow-practice/raw/dpic/dpic.json',
        JSON.stringify(executions),
        function (error) {
          if (error) {
            console.log(error);
          }
          else {
            console.log('ugly file written.');
          }
        });
    });
