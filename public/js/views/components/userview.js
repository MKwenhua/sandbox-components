import React from "react";

import languageList from "./helpers/languages"
import countries from "./helpers/countries"

export default class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      learnAdd: "add-ui select-hidden",
      speaksAdd: "add-ui select-hidden",
      speaks: props.user.info.speaks.reduce((obb, itm) => {
        obb[itm] = true;
        return obb;
      }, {}),
      learning: props.user.info.learning.reduce((obb, itm) => {
        obb[itm] = true;
        return obb;
      }, {})
    }

  };
  handleName() {
    this.props.nameChange(
      this.refs.userNameInput.value
    )
  };
  removeLearn(lang) {
    let ln = this.props.user.info.learning.filter((itm) => {
      return itm !== lang
    });
    this.props.user.info.learning = ln;
    this.props.infoChange(
      this.props.user.info
    )
  };
  removeSpeaks(lang) {
    let ln = this.props.user.info.speaks.filter((itm) => {
      return itm !== lang
    });
    this.props.user.info.speaks = ln;
    this.props.infoChange(
      this.props.user.info
    )
  };
  speaksSelect() {
    if (!this.state.speaks[this.refs.speaks.value]) {
      this.props.user.info.speaks.push(this.refs.speaks.value);
      this.state.speaks[this.refs.speaks.value] = true;
    }

    this.props.infoChange(
      this.props.user.info
    )
    this.setState({
      speaksAdd: "add-ui select-hidden"
    });
  };
  learnSelect() {
    if (!this.state.learning[this.refs.learns.value]) {
      this.props.user.info.learning.push(this.refs.learns.value);
      this.state.learning[this.refs.learns.value] = true;
    }
    this.props.infoChange(
      this.props.user.info
    )
    this.setState({
      learnAdd: "add-ui select-hidden"
    });
  }
  handleCity() {
    this.props.cityChange(
      this.refs.userCityInput.value
    )
  };
  handleCountry() {
    this.props.countryChange(
      this.refs.userCountryInput.value
    )
  };
  cancelAdd(wt) {
    if (wt === "learn") {
      this.setState({
        learnAdd: "add-ui select-hidden"
      });
    }
    if (wt === "speaks") {
      this.setState({
        speaksAdd: "add-ui select-hidden"
      });
    }
  };
  addLearning() {
    let classSet = this.state.learnAdd === "add-ui select-hidden" ? "add-ui select-show" : "add-ui select-hidden";
    this.setState({
      learnAdd: classSet
    });
  };
  addSpeaks() {
    let classSet = this.state.speaksAdd === "add-ui select-hidden" ? "add-ui select-show" : "add-ui select-hidden";
    this.setState({
      speaksAdd: classSet
    });
  };
  render() {
    console.log('props', this.props);



    const countryOptions = countries.map((country, ii) => {
      return <option key={ii} value={country} >{country}</option>;
    });

    const learning = this.props.user.info.learning.map((dta, i) => {
      return <li key={i}>{dta} <div onClick={this.removeLearn.bind(this, dta)} className="remove-itm"><i className="material-icons">remove</i></div></li>;
    });
    const speaks = this.props.user.info.speaks.map((dta, i) => {
      return <li key={i}>{dta} <div onClick={this.removeSpeaks.bind(this, dta)} className="remove-itm"><i className="material-icons">remove</i></div></li>;
    });
    const userInfo = this.props.user.info;
    const Llangs = languageList.map((itm, i) => {
      if (userInfo.learning[itm.lang] === undefined) {
        return itm.ele;
      }
    });
    const Slangs = languageList.map((itm, i) => {
      if (userInfo.speaks[itm.lang] === undefined) {
        return itm.ele;
      }
    });

    return (<div className="profile-info">
		            <div className="block-pic-name" >
		    					<img src={this.props.user.imgurl} /> 
		    					<div className="info-block">
			    						<strong> 
			    						   <input className="blended-bold" type="text"
			    						         ref="userNameInput"
			    						         onChange={this.handleName.bind(this)}  
			    						         size={this.props.user.name.length + 2}
			    						         value={this.props.user.name}/>
			    						 </strong>
			    			
			    						<span className="bold-span">
			    						<div className="inline-blocks">
			    						  <strong>City:</strong>
			    							<input className="blended-bold" type="text" 
			    						         ref="userCityInput"
			    						         size={this.props.user.city.length + 2}
			    						         onChange={this.handleCity.bind(this)}  
			    						    value={this.props.user.city}/>
			    						    </div>
			    						</span>
			    						<span>
			    						<div className="inline-blocks">
			    						<strong>Country:</strong>
			    						<select ref="userCountryInput"
			    						         className="country-pick"
			    						         value={this.props.user.country}
			    						         onChange={this.handleCountry.bind(this)} >
			    						{countryOptions}
			    						</select>
			    			
			    						</div>
			    						</span>
			    						<p><b>age:</b> {this.props.user.age}</p>
		    					</div>
	    			</div>
	    			<div className="block-pic-name no-border" >
		    			<div className="list-lang">
		    				<strong>Speaks</strong>
		    			
		    				<ul>
		    					{speaks}
		    				</ul>
		    	
		    				<div className={this.state.speaksAdd}>
		    			   <div onClick={this.addSpeaks.bind(this)} className="add-language">Add Language</div>
		    					<select ref="speaks" className="lang-pick" >
		    						{Slangs}
		    					</select>
		    			    <div className="button-opts">
		    			    <div onClick={this.cancelAdd.bind(this, 'speaks')} className="cancel-button">cancel</div>
		    					 <div onClick={this.speaksSelect.bind(this)} className="add-button">Add</div>
		    					</div>
		    				</div>
		    			</div>
		    			<div className="list-lang">
		    				<strong>Learning</strong>
		    				
		    				<ul>
		    					{learning}
		    				</ul>
		    		
		    				 <div className={this.state.learnAdd}>
		    			   <div onClick={this.addLearning.bind(this)} className="add-language">Add Language</div>
		    					<select ref="learns" className="lang-pick" >
		    						{Llangs}
		    					</select>
		    					<div className="button-opts">
		    					 <div onClick={this.cancelAdd.bind(this, 'learn')} className="cancel-button">cancel</div>
		    					 <div onClick={this.learnSelect.bind(this)} className="add-button">Add</div>
		    					</div>
		    				</div>
		    			</div>
	    			</div>
		  </div>);
  }
};