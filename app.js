/*
Borrowed from the following site to figure out how to route:
https://github.com/visionmedia/express/tree/master/examples/route-separation
*/

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , cats = require('./routes/cats');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/cats/new', cats.newCat);
app.get('/cats', cats.dispCats);
app.get('/cats/color/:color', cats.dispColor);
app.get('/cats/delete/old', cats.deleteOld);

/*app.get('/cats/new', function(req, res){
    res.send('Hello World');
});*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
