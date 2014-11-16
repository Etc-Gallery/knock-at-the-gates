var marked = require('marked')
,   fs     = require('fs');


marked.setOptions({
  smartypants: true
});

var name = process.argv[2];

var md = fs.readFileSync('data/essays/' + name + '.md').toString();

fs.writeFile('data/essays/' + name + '.html', marked(md), function (error) {
  if (error) {
    console.log(error);
  }
  console.log(name + ' essay written.');
});