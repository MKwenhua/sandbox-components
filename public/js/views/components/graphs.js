import React from "react";
import d3 from 'd3';
if (!window.d3){
	window.d3 = require('d3');
}
import ReStock from "react-stockcharts";
import DATASOURCE from "./helpers/datasource";

import CandleStickChart from "./charts/boxplot";

const fixDate = (() => {
	let parseDate = d3.time.format("%Y-%m-%d").parse;
	return (data) => {
    return data.map((d, i) => {
		        d.date = new Date(d.timestamp);
		       return d;
		    });
	}
})(); 
export default class Graphs extends React.Component {
	constructor(props) {
  super(props);
  this.dbSource = DATASOURCE;
  this.state = {
  	 onConfig: true,
  	 loaded: false,
  	 dataSets: {},
  	 hybrid: true,
  	 chartShow: false,
  	 currentSet: [],
  	 graphElement: []
  	};
 
  	this.gotData = this.gotData.bind(this);

  	this.createChart = this.createChart.bind(this);
	  this.dbSource.socket.on('marketData',  (details) => this.gotData( details )); 
	 
    
	};
	createChart () {
		if (this.dbSource.connected) {
  		this.dbSource.getMarketDataSockets('AAPL');
  	}else {
  		this.dbSource.getMarketDataXHR('AAPL',this.gotData);
  	}
		if (!this.state.currentSet.length) return false;
			this.setState({chartShow: true});
	};
	gotData (details) {
		let data = details;
		console.log('marketData data.results', data.results);
		let theData = fixDate(data.results);
		console.log('marketData', theData);

		this.setState({currentSet: data.results, chartShow: true});
		
  };
 
	render() {
				 const width =  window.innerWidth - 60;
				 const height = window.innerHeight - 300;
		 console.log('width', width);
    return (
           <div className="container">
           		<div className={this.state.chartShow ? "row hide-elm" : "row"}>
           			<div onClick={this.createChart.bind(this)} className="get-list center-text">
					            Create Chart
					          </div>
           		</div>
            	<div id="chartAnchor" className={this.state.chartShow ? "fadeinto" : "hide-elm"}>
            	<div id="chart">
            				<CandleStickChart company="AAPL" height={height} width={width} data={this.state.currentSet} type={this.state.hybrid ? "hybrid" : "svg"} />
            		</div>
            	</div>
            </div>
            )
	}
};