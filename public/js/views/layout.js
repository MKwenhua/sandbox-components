import React from "react";
import Bslide from "./components/btm_slider";
import Bpop from "./components/btm_popup";
import Center from "./components/center";
import Nav from "./components/nav";
import Drag from "./components/drag";
import Graphs from "./components/graphs";
import Lists from "./components/lists";


const _applyListener = (type) => {
  let histFunc = history[type];
  return () => {
    let rv = histFunc.apply(this, arguments);
    let e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
};

window.checkPath = (() => {

  const ChangeUrl = (title, url) => {
    if (typeof(history.pushState) === "undefined") return;
    let obj = {
      Title: title,
      Url: url
    };
    history.pushState(obj, obj.Title, obj.Url);
  };
  const allPaths = ['/examples', '/examples/drag', '/examples/graphs', '/examples/lists'];
  const allTitles = {
    '/examples': 'Examples',
    '/examples/drag': 'Drag Animations',
    '/examples/graphs': 'Charting',
    '/examples/lists': 'List Animations'
  }
  return (path) => {
    let pathIS = allPaths.reduce((q, i) => {
      return i === path ? i : q;
    }, "/examples");
    ChangeUrl(allTitles[pathIS], pathIS);
    return pathIS;
  }
})();

export default class Layout extends React.Component {

  constructor() {
    super();
    history.pushState = _applyListener('pushState');
    window.onpopstate = (e) => {
      console.log(e);
      let newPath = e.state.Url;
      this.setState({
        pathName: newPath,
        blocked: this.routeComponents[newPath]
      });
    };
    const eventHandler = (() => {
      const thisScope = this;
      return (e) => {
        console.log('State Changed!', e);
        let newPath = e.arguments[0].Url;
        thisScope.setState({
          pathName: newPath,
          blocked: thisScope.routeComponents[newPath]
        });
      }
    })();

    window.addEventListener('pushState', eventHandler);
    const centerOb = {
      greeting: "Welcome please check out these Widgets"
    };
    this.routeComponents = {
      "/examples": [<Center ob={centerOb}></Center>, <Bslide/>],
      "/examples/drag": [<Drag/>],
      "/examples/graphs": [<Graphs />, <Bpop/>],
      "/examples/lists": [<Lists />]
    }
    this.state = {
      pathName: window.location.pathname,
      blocked: this.routeComponents[window.checkPath(window.location.pathname)]
    }
  }
  newSet(newPath) {

    this.setState({
      pathName: newPath,
      blocked: this.routeComponents[newPath]
    });
  };

  setPath() {
    let len = window.location.pathname.match('/').length;
    let path = len === 1 ? '/examples' : window.location.pathname.replace('/examples', '');
    this.newSet(checkPath(window.location.pathname));
  };

  render() {

    return (
      <div> 
				<Nav />
				{this.state.blocked}
			</div>
    );
  }
};