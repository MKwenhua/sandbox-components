import React from "react";

export default class Bslide extends React.Component {
	 constructor() {
	    super();
	    this.state = {
	       sliderView: false,
	       sliderClass: "bottom-view dw_set",
	       loaded: true
	    }
	 };
	 sliderClass(go) {
	    var sliderUp = go === 'down';
	    this.setState({
	       sliderView: sliderUp
	    });
	    this.setState({
	       sliderClass: sliderUp ? "bottom-view dw_set" : "bottom-view up_set"
	    });

	 };
	 render() {
	    return (
			<div className={this.state.sliderClass}>
			   <div className="bottom-view-header">
			      <i onClick={this.sliderClass.bind(this, 'up')} className="material-icons upp">keyboard_arrow_up</i>
			      <i onClick={this.sliderClass.bind(this, 'down')} className="material-icons dwn">keyboard_arrow_down</i>
			   </div>
			   <div className="bottom-box">
			      	<div draggable="true" className="draggable blue-hl">Drag Me!</div>
			   </div>
			</div>
	    );
	 }
};