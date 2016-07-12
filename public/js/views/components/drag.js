import React from "react"; 
import UserView from "./userview";
import loadImage from "./helpers/load-images";
import DATASOURCE from "./helpers/datasource";

const draggablePolyfil = (() => {
	
const hasEvent = {};

const patt = new RegExp(/!^[google]/i);
return () => {
	if (patt.test(navigator.vendor)){
		var allLi = document.querySelectorAll('.li-box');
		for (var i = 0; i < allLi.length; i++) {
			if (hasEvent[allLi[i].id] === undefined) {
				hasEvent[allLi[i].id] = "has";
				allLi[i].addEventListener('dragstart', (e) => {
				  e.dataTransfer.setData('text', 'foo');
				});
			} 
			
		}
		console.log('hasEvent',hasEvent);
}
  
}
})();

 
const waitApply = () => setTimeout(() => { draggablePolyfil();  }, 100);

export default class Drag extends React.Component {

	constructor(props) {
  super(props); 
  this.dbSource = DATASOURCE;
  this.state = {
  	 onDropOver: false,
  	 displayedUser : null,
  	 dragUser : null,
  	 shownUser: null,
  	 dropClass : "drop-column",
  	 userProfiles: {},
  	 loaded: false,
  	 users: []
  	};
  	this.getNewList = this.getNewList.bind(this);
		this.dropHandle = this.dropHandle.bind(this);
		this.handleDragEv = this.handleDragEv.bind(this);
		this.dragEnter = this.dragEnter.bind(this);
		this.dragLeave = this.dragLeave.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeCity = this.changeCity.bind(this);
		this.changeName = this.changeName.bind(this);
		this.infoChange = this.infoChange.bind(this);
		this.updateShownUser = this.updateShownUser.bind(this);
  	this.dbSource.socket.on('userList',  (details) => this.getNewList( details ));
  	if (this.dbSource.connected) {
  		this.dbSource.getUsersSockets();
  	}else {
  		this.dbSource.getUsersXHR(this.getNewList);
  	}
			 

	   
	};
	getNewList (details) {
		console.log('details', details);
		let that = this;
		Promise.all(details.users.map((user) => loadImage(user.imgurl))).then(() => {
			that.setState({ users: details.users , loaded:true});
			waitApply();
		});
		
  }
  saveChanges () {
    if (this.dbSource.connected) {
     this.dbSource.postUserChangesSockets(this.state.displayedUser);
   	}else{
     this.dbSource.postUserChangesXHR(this.state.displayedUser,this.getNewList );
   	}
  };
	infoChange (change) {
		console.log('infoChange change', change);
		let displayedUser = this.state.displayedUser;
   	displayedUser.info = change;
   	this.setState({ displayedUser: displayedUser});
   	this.updateShownUser();
		
	};
	updateShownUser () {
		let disUser = this.state.displayedUser;
		this.setState({
			shownUser: <UserView key={disUser.email} infoChange={this.infoChange} countryChange={this.changeCountry} cityChange={this.changeCity} nameChange={this.changeName} user={disUser} /> 
		});
	}
  changeName (name)  {
   	console.log('infoName', name);
   	let displayedUser = this.state.displayedUser;
   	displayedUser.name = name;
   	this.setState({ displayedUser: displayedUser});
   	this.updateShownUser();
  };
  changeCity (city)  {
   	console.log('changeCity', city);
   	let displayedUser = this.state.displayedUser;
   	displayedUser.city = city;
   	this.setState({ displayedUser: displayedUser});
   	this.updateShownUser();
  };
  changeCountry (country)  {
   	console.log('changeCountry', country);
   	let displayedUser = this.state.displayedUser;
   	displayedUser.country = country;
   	this.setState({ displayedUser: displayedUser});
   	this.updateShownUser();
  };

	dropHandle (e) {
		e.preventDefault(); e.stopPropagation();
		let droppedUser = this.state.dragUser;
		console.log('this.state.dragUser', this.state.dragUser);

		this.setState({displayedUser: droppedUser, dropClass: "drop-column displayData",
			shownUser: <UserView key={droppedUser.email} infoChange={this.infoChange}  countryChange={this.changeCountry} cityChange={this.changeCity} nameChange={this.changeName} user={droppedUser} /> 
		 }); 

		console.log(e);
		console.log(droppedUser);
	};
	handleDragEv (user) {
		console.log('drag envent',user);
    this.setState({ dragUser: user});
  };
	dragEnter (e) {
     e.preventDefault();e.stopPropagation();
     let clss = this.state.displayedUser ? "drop-column displayData is-dragover" : "drop-column is-dragover";
		 this.setState({dropClass:  clss , onDropOver: true  });
  };
  dragLeave (e) {
     e.preventDefault();e.stopPropagation();
     let clss = this.state.displayedUser ? "drop-column displayData" : "drop-column";
		 this.setState({dropClass:  clss , onDropOver: false  });
  };  
  

	render() { 
	  
	  const users = this.state.users.map((user,i) => {

	  	let ani = 'slideIn '+String(0.1 * i)+'s ease-out 0.6s 1 forwards';

	    return <a id={user.id} key={user.email}  onDragStart={this.handleDragEv.bind(this, user)} className="li-box li-left"  style={{animation: ani}}  draggable="true" >
		    					<div className="inline-hl img-hold">
		    						<img src={user.imgurl} /> 
		    					</div>
		    					<div className="inline-hl text-hl">
		    						{user.name}
		    			 		</div>
	    					</a>;
	 			});
		

    return ( 
				<div className="col-row">
				  <div className="list-column">
				    <div className="demo-set">
				      {users}
				      <div className={this.state.loaded ? "loader hide-elm" : "loader"}>Loading...</div>
				    </div>
				  </div>
				  <div onDrop={this.dropHandle.bind(this)} onDragOver={this.dragEnter.bind(this)} onDragLeave={this.dragLeave.bind(this)} className={this.state.dropClass}>
				    <div className="drop-zone">
				      <i className="material-icons">system_update_alt</i> Drop Here
				    </div>
				    <div className="profileView">
				      {this.state.shownUser}
				      <div className="purple-stripe"></div>
				      <div className="saveToDB">
				        <div onClick={this.saveChanges.bind(this)} className="saveDBbutton">Save Changes</div>
				      </div>
				    </div>
				  </div>
				  <div className="stretch"></div>
				</div>
            )
	}
};