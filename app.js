const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const ejs = require('ejs');
const app = new express();
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const contentTypes = require('./utils/content-types');
const sysInfo = require('./utils/sys-info');
const env = process.env;
const socketio = require('socket.io');
const redis = require('redis');
const sio_redis = require('socket.io-redis');
const NodeCache = require("node-cache");
const redisShare = redis.createClient(17129, env.REDIS_ENDPOINT_A);
const pub = redis.createClient(18071, env.REDIS_ENDPOINT_B);
const sub = redis.createClient(18071, env.REDIS_ENDPOINT_B);
const exampleData = {
  users: [],
  userKeys: []
};
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});
var marketData;

redisShare.auth(env.REDIS_A_PW, (err) => {
  if (err) {
    console.log(err)
  };
});
redisShare.on('connect', (err) => {
  console.log('Connected to Redis');

  redisShare.hgetall("example_userz:", (err, reply) => {

    var userKeys = Object.keys(reply);

    exampleData.userKeys = userKeys;
    userKeys.map((keyy, ind) => {
      var stringKey = String(keyy);
      var parsedOB = JSON.parse(reply[stringKey]);
      parsedOB.arrIndex = ind;
      exampleData[stringKey] = parsedOB;
      exampleData.users.push(parsedOB);
    });
    marketData = require('./restroutes.js')(app, urlencodedParser, redisShare, exampleData);
  });

});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.enable('trust proxy');
app.use(cookieParser());
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');


app.get('/examples', (req, res) => {

  res.render('demo', {
    hey: "yo"
  });
});
app.get('/samples', (req, res) => {
  res.render('demo', {
    hey: "yo"
  });
});
app.get(/\/examples\/(drag|graphs|lists)/i, (req, res) => {

  res.render('demo', {
    hey: "yo"
  });
});
app.get('/', (req, res) => {
  res.send("Sorry no Index, just JSON");
});

app.get('/health', (req, res) => {

  res.writeHead(200);
  res.end();
});
app.get(/\/info\/(gen|poll)/, (req, res) => {
  let url = req.url;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.end(JSON.stringify(sysInfo[url.slice(6)]()));
});

app.get('/', (req, res) => {
  res.render('start');
});

let server = app.listen(env.NODE_PORT || 8443, env.NODE_IP || 'localhost', () => {
  console.log(`Application worker ${process.pid} started...`);
});
const io = socketio(server);
var setAdapter = (() => {
  var num = 0;
  return function() {
    num += 1;
    console.log('num', num);
    if (num > 1) {
      io.adapter(sio_redis({
        pubClient: pub,
        subClient: sub
      }));
    }
  }
})();
sub.auth(env.REDIS_B_PW, (err) => {
  if (err) {
    console.log(err)
  };
  setAdapter();
  sub.subscribe('change_made');
  sub.on('message', (channel, message) => {
    if (channel === 'change_made') {
      let mm = JSON.parse(message);
      let oldU = exampleData[mm.email];
      mm.arrIndex = oldU.arrIndex;
      exampleData[mm.email] = mm;
      exampleData.users[mm.arrIndex] = mm;
    }
  });
});
pub.auth(env.REDIS_B_PW, (err) => {
  if (err) {
    console.log(err)
  };
  setAdapter();
});

const redisManager = require('./redis_session.js')(io, redisShare);
io.on('connection', (socket) => {

  socket.emit('newInstance', {
    sockId: socket.id
  });

  socket.on('changedUser', (data) => {
    const user = data.user;
    redisShare.hset("example_userz:", user.email, JSON.stringify(user), (err, reply) => {
      exampleData.users[user.arrIndex] = user;
      exampleData[user.email] = user;
      pub.publish("change_made", JSON.stringify(user));
      socket.emit('userList', {
        users: exampleData.users
      });
    });
  });
  socket.on('getUsers', (ok) => {
    io.to(socket.id).emit('userList', {
      users: exampleData.users
    });
  });
  socket.on('hgGet', (ok) => {
    redisShare.hgetall("example_userz:", (err, reply) => {
      socket.emit('hgGot', {
        data: reply
      });
    });
  });
  socket.on('historyFor', (who) => {
    console.log('historyFor socket.id', socket.id);
    console.log('historyFor who.sock', who.sock);
    marketData.getData(who.company, (data) => {

      io.to(who.sock).emit('marketData', data);
    });
  });
  socket.on('getUsersByType', (request) => {
    console.log('getUsersByType', request.ok);
    socket.emit('gotList', {
      users: exampleData.users
    });
  });
  socket.on('userUdid', (userData) => {
    redisManager.setUserRedis(userData);
    console.log('userUdid', userData);
  });
  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });
  socket.on('answer', (answer) => {
    console.log('relaying answer');
    socket.broadcast.emit('answer', answer);
  });
  socket.on('peer-connect', (peerObject) => {
    console.log('peerObject', peerObject);
    redisManager.addPeerOb(peerObject);
  });

});