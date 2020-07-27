import React from 'react';
import Menu from "./components/menu/menu";
import Exchange from "./components/exchange/exchange";
import Register from "./components/register/register.js";
import SignIn from "./components/signIn/signIn";
import Requests from "./components/requests/requests";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

const initUser={
  _id:"",
  username:"",
  email:""
}

class App extends React.Component {
  constructor(){
    super()
this.state={
  isSigned:false,
  route:"home",
  user: initUser,
  fetched: false
}

  }
  onRouteChange=(route)=>{
    if(route=="home")
    this.setState({route:"home"});
    else if(route=="register")
    this.setState({route:"register"});
    else if (route=="signIn") {
      this.setState({user: initUser},function () {
        this.setState({route:"signIn"}, function () {
          this.setState({isSigned:false});
        })
      });
    }
    else if(route=="requests")
    this.setState({route:"requests"});
  }
  onUserChanged=(user)=>{
    this.setState({user:{
      _id:user._id,
      username: user.username,
      email: user.email
    }
  },function () {
      this.setState({isSigned:true}, function () {
        this.setState({route:"home"});
      });
  });
  }
componentDidMount(){
  fetch("http://localhost:3000/currentUser/"+localStorage.getItem("user_id"), {credentials: 'include'})
  .then(response=>response.json())
  .then(theUser=>{
    if(theUser!=null)
     this.onUserChanged(theUser);
   }).then(()=>this.setState({fetched:true}));
}
  render(){
    const {isSigned, user, route, fetched}=this.state;
const cpath=window.location.pathname;
if(!fetched) return <span>Loading..</span>;
    return (
      <Router>
      <div className="App">
      <Route path="/"
      render={(props)=><Menu route={route} user={isSigned? user : null} onRouteChange={this.onRouteChange}/>} />

      { this.state.route=="home" && this.state.isSigned  &&
      <>
      <Redirect to="/" />
      <Route exact={true} path={["/","/exchange"]}
render={(props)=><Exchange onRouteChange={this.onRouteChange}/>
} />
</>
}

        <Route path="/register"
render={(props)=><Register onRouteChange={this.onRouteChange} onUserChanged={this.onUserChanged}/>
} />

{ !this.state.isSigned && cpath!="/register" &&
  <SignIn onRouteChange={this.onRouteChange} onUserChanged={this.onUserChanged}/>
}

{ this.state.isSigned &&
<Route path="/requests"
render={(props)=><Requests user={user}/>} />
}

      </div>
      </Router>
    );
  }
}

export default App;
