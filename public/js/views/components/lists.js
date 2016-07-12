import React from "react";
import loadImage from "./helpers/load-images"
import DATASOURCE from "./helpers/datasource";

export default class Lists extends React.Component {
	constructor(props) {
  super(props);

  this.dbSource = DATASOURCE;
  this.state = {
  	 onConfig: true,
  	 loaded: false,
  	 tabSet: 0,
  	 liClass: 'li-box li-left',
  	 liAnimation: 'slideIn ',
  	 navCntrlClass: "select-nav hide-controls",
  	 calculating: false,
  	 users: [] 
  	};
  	this.setAt = this.setAt.bind(this);
  	this.getNewList = this.getNewList.bind(this);
  	this.getClassSet = this.getClassSet.bind(this);
  	this.searchType = this.searchType.bind(this);
  	this.listAniSet = this.listAniSet.bind(this);
  	this.getListDefault = this.getListDefault.bind(this);
	  this.dbSource.socket.on('gotList',  (details) => this.getNewList( details )); 
	};
	setAt (bool) {
		this.setState({onConfig: bool });
	}
	getNewList (details) {
		console.log('details', details);
		let that = this;
		Promise.all(details.users.map((user) => loadImage(user.imgurl))).then(() => {
			that.setState({ users: details.users , loaded:true, calculating:false,  navCntrlClass: "select-nav show-controls"});
		});
		 
  }
  listAniSet (num) {
  	let classTypes = ['li-box li-left', 'li-box li-slidedown', 'li-box li-slideup', 'li-box li-grow-out', 'li-box li-scale'];
  	let aniTypes =  ['slideIn ', 'slideDown ', 'slideUp ', 'growOut ', 'scaleBig '];
  	this.setState({tabSet: num, liClass: classTypes[num], liAnimation: aniTypes[num]  });
  };
  searchType () {

  };
  getListDefault () {
  	this.setState({calculating:true, navCntrlClass: "select-nav message-block"});
 
  	if (this.dbSource.connected) {
  		this.dbSource.getListTypeSockets('getRecent20');
  	}else {
  		this.dbSource.getListTypeXHR('getRecent20',this.getNewList);
  	}
  };
	getClassSet () {
		if (!this.state.loaded){
			return "list-holder no-list";
		}
		return this.state.calculating ? "list-holder loading-list" : "list-holder ul-block";
	}
	render() {
		const liClass = this.state.liClass;
		const aniType = this.state.liAnimation;
		const users = this.state.users.map((user,i) => {
	  	let ani = aniType+String(0.1 * i)+'s ease-out 0.6s 1 forwards';
	    return <li id={user.id} key={user.email}  className={liClass}  style={{animation: ani}}  >
		    	
		    					<div className="inline-hl img-hold"><img src={user.imgurl} /> 
		    					</div>
		    					<div className="inline-hl text-hl">
		    					{user.name}
		    					</div>
		    		
	    					</li>;
	 	});
    return (
        <div className="container move-up">
					  <div className="row">
					    <div className="col-lg-offset-2 col-lg-8 col-md-offset-2 col-md-8">
					      <div className={this.state.navCntrlClass}>
					       <div onClick={this.getListDefault.bind(this)} className="get-list">
					            Get List
					          </div>
					          <div className="msg-h4">
												 <h3>Configuring</h3>
												 <div className="col">
										    
										    <ul className="loading-2">
										      <li></li>
										      <li></li>
										      <li></li>
										    </ul>
										    
										  </div>
					          </div>
					        <div className="ui-tabs">
					          <a onClick={this.setAt.bind(this, true)} className={this.state.onConfig ? "tab-buttons active" : "tab-buttons" }>
					            	<span>List Animations</span>
					            <i className="material-icons">tune</i>
					          </a>
					          <a onClick={this.setAt.bind(this, false)} className={this.state.onConfig ? "tab-buttons" : "tab-buttons active" }>
					           	<span>Search</span>
					            <i className="material-icons">search</i>
					          </a>
					        </div>
					        <div className="nav-container">
					          
					          <div className={this.state.onConfig ? "list-controls" : "list-controls hide-elm"}>
					           		<div className="list-animations">
					           		  <strong>List Animations</strong>
						           		<div className="btn-group">
						           				<a onClick={this.listAniSet.bind(this, 0)} className={this.state.tabSet === 0 ? "btn btn-info tab-sets active" : "btn btn-info tab-sets"}>ONE</a>
						           				<a onClick={this.listAniSet.bind(this, 1)} className={this.state.tabSet === 1 ? "btn btn-info tab-sets active" : "btn btn-info tab-sets"}>TWO</a>
						           				<a onClick={this.listAniSet.bind(this, 2)} className={this.state.tabSet === 2 ? "btn btn-info tab-sets active" : "btn btn-info tab-sets"}>THREE</a>
						           				<a onClick={this.listAniSet.bind(this, 3)} className={this.state.tabSet === 3 ? "btn btn-info tab-sets active" : "btn btn-info tab-sets"}>THREE</a>
						           		    <a onClick={this.listAniSet.bind(this, 4)} className={this.state.tabSet === 4 ? "btn btn-info tab-sets active" : "btn btn-info tab-sets"}>SCALE</a>
						           		</div>
					           		</div>
					          </div>
					          <div className={this.state.onConfig ? "list-controls srch hide-elm" : "list-controls srch"}>
					          <p>Search</p>
					          <input type="text" className="form-control search-input" ref="userSearch" onChange={this.searchType.bind(this)} />
					          </div>
					        </div>
					      </div>
					      <div className={this.getClassSet()}>
					        <h4 className="hide-elm"></h4>
					        <div className="loader">Loading...</div>
					        <ul>
					          {users}
					        </ul>
					      </div>
					    </div>
					  </div>
					</div>
            )
	}
};