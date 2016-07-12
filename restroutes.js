const cors = require('cors');


module.exports = function(app, urlencodedParser , redisShare, exampleData) {
    const marketData = require('./marketdata.js')(redisShare);
    app.get('/xhrs/getusers', cors(), (req,res) => {
				res.send(JSON.stringify({ users: exampleData.users }));
				res.end();
		});

		app.get('/xhrs/listparams/:condition', cors(), (req,res) => {
			  let condition = req.params.condition
			  console.log('xhr listparams', condition);
				res.send(JSON.stringify({ users: exampleData.users }));
				res.end();
		});

		app.get('/xhrs/marketdata/:symbol', cors(), (req,res) => {
			  let symbol = req.params.symbol
			  console.log('xhr marketdata', symbol);
			  marketData.getDataCB( symbol , (data) => {
			  	res.send(data);
					res.end();
			  });
				
		});
		

		app.get('/users', cors(), (req, res) => {
		  res.send(JSON.stringify(exampleData));
		});

		app.post('/xhrs/postuserchanges',cors(), urlencodedParser, (req,res) => {
	  let changeBody = req.body;
	  console.log('changeBody', changeBody);
	  const user = data.user;
  	redisShare.hset("example_userz:", user.email, JSON.stringify(user), (err,reply) =>{
  		exampleData.users[user.arrIndex] = user;
  		exampleData[user.email] = user;
  		pub.publish("change_made", JSON.stringify(user));
  		socket.emit('userList', { users: exampleData.users });
  	}); 
		res.send(JSON.stringify({ users: exampleData.users }));
		
		});
return marketData;
};