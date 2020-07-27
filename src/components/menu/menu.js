import React from 'react';
import './menu.css';
import { Link } from "react-router-dom";

class menu extends React.Component {
  constructor(){
    super()
  }
  onLogout=()=>{
    fetch('http://localhost:3000/logout')
.then(response => {
        return response.json();
})
.then(res => {
if(res==="successful"){
  localStorage.setItem("user_id",null);
  this.props.onRouteChange("signIn");
}
else {
  alert(res);
}
})
.catch((error) => {
console.log(error);
});
  }
  render(){
    const {user, onRouteChange, route}=this.props;
    return (
      <div id="menu">
        <nav className="navbar navbar-expand-sm navbar-dark">
          <ul className="navbar-nav">
          <Link to="/exchange">
            <li className={`nav-item ${route=='home' ? 'active' : ''}`} onClick={()=>onRouteChange("home")} >
              <a className="nav-link">Exchange</a>
            </li>
            </Link>
            <Link to="/requests">
            <li className={`nav-item ${route=='requests' ? 'active' : ''}`} onClick={()=>onRouteChange("requests")}>
              <a className="nav-link">my Requests</a>
            </li>
            </Link>

              <div id="menu-right">
              { user ?
                <>
              <li className="nav-item">
                <a className="nav-link" onClick={this.onLogout}>{user.username} Logout</a>
              </li>
  </>
              :
              <>
              <Link to="/signIn">
              <li className="nav-item">
                <a className="nav-link" onClick={()=>onRouteChange("signIn")}>signIn</a>
              </li>
              </Link>
              <Link to="/register">
<li className="nav-item">
                <a className="nav-link" onClick={()=>onRouteChange("register")}>Register</a>
              </li>
              </Link>
</>
            }
              </div>

          </ul>
        </nav>
      </div>
    );
  }
}

export default menu;
