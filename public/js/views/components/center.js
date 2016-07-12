import React from "react";
import {Link} from "react-router";
export default class Center extends React.Component {
	goState (pp) {
		window.checkPath(pp);
	}
	render() {
		console.log(this.props.ob)

		return (
	   <div className="center-intro">
		   <p className="main-headline">{this.props.ob.greeting}</p>
		   <div onClick={this.goState.bind(null,'/examples/drag')} className="btnn cool-button">Drag N Drop</div>
		   <div  onClick={this.goState.bind(null,'/examples/graphs')} className="btnn cool-button">Graphs</div>
		   <div  onClick={this.goState.bind(null,'/examples/lists')} className="btnn cool-button">List Animations</div>
		 </div>
		 );
	}
};