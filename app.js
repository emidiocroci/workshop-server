
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var model = require('./model');

var app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('post', function (post) {
        model.Post.create(post, function (err, data) {
            if (err)
                socket.emit('error', { description: 'post not saved!'});
            else
                io.sockets.emit('post', post);
        })
    });
    socket.on('disconnect', function (reason) {
        console.log(reason);
    });
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/posts', function (req, res) {
    model.Post
        .find()
        .sort('-date')
        .exec(function (err, data) {
            if (!err) {
                res.set('Access-Control-Allow-Origin', '*');
                res.send(200, data);
            }
        });
});
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
