import React from "react";

export default class Nav extends React.Component {
  goState (pp) {
		window.checkPath(pp);
	}
	render() {
		return (
		<div className="top-nav">
		  <div onClick={this.goState.bind(null,'/examples')}  className="side-title">
		  	<span className="span-fat"><i className="material-icons">extension</i></span>
		  	<span className="span-thin middle-set"> Examples</span>
		  </div>
		  <div id="kickStart" className="btnn cool-button pull-right">Stuff</div>
		</div>
		 );
	}
};