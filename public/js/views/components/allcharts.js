//var d3 = require("d3");
if (!window.d3){
	window.d3 = require('d3');
}
import Charts from './charts/chartholder';
var ohlc = require('./helpers/ohlc_chart');

module.exports = Charts;