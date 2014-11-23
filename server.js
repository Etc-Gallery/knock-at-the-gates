var express    = require('express'),
    path       = require('path'),
    fs         = require('fs'),
    app        = express();

// Middleware.
var favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

// Configure the app.
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').__express);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/', function (req, res) {
  res.render('index.html');
});
app.get('/last-words', function (req, res) {
  res.render('index.html');
});
app.get('/last-words.json', function (req, res) {
  res.send(require('./data/interludes/last-words/last-words.json'));
});
app.get('/names.json', function (req, res) {
  res.send(require('./data/common/dpic-full.json'));
});
app.get('/a-narrow-practice', function (req, res) {
  res.render('index.html');
});
app.get('/a-narrow-practice.json', function (req, res) {
  res.send(require('./data/interludes/a-narrow-practice/us.topo.json'));
});
app.get('/how-we-kill', function (req, res) {
  res.render('index.html');
});
app.get('/how-we-kill.json', function (req, res) {
  res.send(require('./data/interludes/how-we-kill/methods.json'));
});
app.get('/essays/:name', function (req, res) {
  res.render('index.html');
});

// Start yer engines.
app.listen(app.get('port'), function () {
  console.log('Engines started on port ' + app.get('port'));
});
