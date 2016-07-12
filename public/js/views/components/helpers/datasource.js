import io from 'socket.io-client';
import xhr from "xhr";

function DATASOURCE(instanceName = "Default") {
  function xhrGet(route, cb) {
    var theURL = '/xhrs/' + route;

    var request = new XMLHttpRequest();

    request.open('GET', theURL, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var resp = request.responseText;

        cb(JSON.parse(resp));
      } else {

      }
    };
    request.onerror = function() {
      console.log('things happened');
    };
    request.send();

  };

  function xhrPost(route, data, cb) {
    var theURL = '/xhrs/' + route;
    xhr({
      body: JSON.stringify(data),
      uri: theURL,
      headers: {
        "Content-Type": "application/json"
      }
    }, function(err, resp, body) {
      cb(JSON.parse(body));
    })
  };
  this.instanceName = instanceName;

  this.getUsersSockets = function() {
    console.log('used sockets for getUsers');
    this.socket.emit('getUsers', {
      ok: 'give me user list please'
    });
  };
  this.getUsersXHR = function(cb) {
    xhrGet('getusers', cb);
  };
  this.postUserChangesSockets = function(user) {
    this.socket.emit('changedUser', {
      user: user
    });
  };
  this.postUserChangesXHR = function(user, cb) {
    xhrPost('postuserchanges', {
      user: user
    }, cb);
  };
  /* Filtered search*/
  this.getListTypeSockets = function(param) {
    console.log('used sockets for getListType');
    this.socket.emit('getUsersByType', {
      ok: param
    });
  };
  this.getListTypeXHR = function(param, cb) {
    console.log('used sockets for getListType');
    var route = 'listparams/' + param;
    xhrGet(route, cb);

  };
  this.getMarketDataSockets = function(symbol) {
    this.socket.emit('historyFor', {
      company: symbol.toUpperCase(),
      sock: DATASOURCE.prototype.socketID
    });
  }
  this.getMarketDataXHR = function(symbol, cb) {
    var route = 'marketdata/' + symbol.toUpperCase();
    xhrGet(route, cb);

  }

}
DATASOURCE.prototype.socket = io('https://main-wedkickstart.rhcloud.com:8443', {
  'forceNew': false,
  'reconnect': false,
  transports: ['websocket']
});
//DATASOURCE.prototype.socket = io('http://localhost:8443',{'forceNew':false,'reconnect': false, transports:['websocket'] });
DATASOURCE.prototype.connected = false;
DATASOURCE.prototype.socketID = null;
DATASOURCE.prototype.retryNums = 0;
DATASOURCE.prototype.retry = true;
DATASOURCE.prototype.socket.on('connect', (details) => {
  DATASOURCE.prototype.connected = true;

});
DATASOURCE.prototype.socket.on('disconnect', (details) => {
  DATASOURCE.prototype.connected = false;
  if (DATASOURCE.prototype.retry) {
    DATASOURCE.prototype.socket = io('https://main-wedkickstart.rhcloud.com:8443', {
      'forceNew': false,
      'reconnect': false,
      transports: ['websocket']
    });
    //DATASOURCE.prototype.socket = io('http://localhost:8443',{'forceNew':false,'reconnect': false, transports:['websocket'] });
  }
});
DATASOURCE.prototype.socket.on('connect_error', (details) => {
  console.log('connect error ', details);
  DATASOURCE.prototype.retryNums += 1;
  if (!DATASOURCE.prototype.connected && DATASOURCE.prototype.retryNums > 1) {
    DATASOURCE.prototype.socket = null;
    DATASOURCE.prototype.retry = false;


  }
});
DATASOURCE.prototype.socket.on('newInstance', (details) => {
  DATASOURCE.prototype.socketID = details.sockId;
  console.log('DATASOURCE.prototype.socketID ', DATASOURCE.prototype.socketID);
});


module.exports = new DATASOURCE('main');