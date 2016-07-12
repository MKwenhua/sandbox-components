


module.exports = function(redisShare){
const Client = require('node-rest-client').Client;
const resty  = new Client();
const exchanges = {}
redisShare.get('NASDAQ',(err, reply) => {
		//exchanges['NASDAQ'] = reply;
		Object.assign(exchanges, JSON.parse(reply)); 
});
redisShare.get('NYSE',(err, reply) => {
		//exchanges['NYSE'] = JSON.parse(reply);
		Object.assign(exchanges, JSON.parse(reply));

});
const marketdata =  {
   getData: (symb, cb) => {
    let theURL = ["http://marketdata.websol.barchart.com/getHistory.json?key=58091a44a178075ed22e93053396bb67&symbol=" ,symb, "&type=daily&startDate=20150704000000"].join("");
   	resty.get(theURL ,  (data, response) => {
			cb(data);
			
		});
   },
   getDataCB: (symb,cb) => {
    let theURL = ["http://marketdata.websol.barchart.com/getHistory.json?key=58091a44a178075ed22e93053396bb67&symbol=" ,symb, "&type=daily&startDate=20150704000000"].join("");
   	resty.get(theURL ,  (data, response) => {
			cb(JSON.stringify(data));
			
		});
   }
};
return marketdata;
}