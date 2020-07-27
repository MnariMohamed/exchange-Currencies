import React from 'react';
import './signIn.css';
import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";

class signIn extends React.Component {
  constructor(){
    super()
    this.state={
      email:"",
      password:""
    }
  }
  onEmailChange=(event)=> {
  this.setState({email: event.target.value})
  }
  onPasswordChange=(event)=> {
    this.setState({password: event.target.value})
  }

  onSignIn=(e)=>{
e.preventDefault();
    fetch("http://localhost:3000/login",{
  method:'POST',
  credentials : 'include',
  headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
  body:JSON.stringify({
    email: this.state.email,
    password: this.state.password
  })
}).then(response => response.json()).then(user=>{
  if(user._id){
    localStorage.setItem("user_id",user._id);
    this.props.onUserChanged(user);
  }
else {
  alert("something is wrong");
}
});
  }
  render(){
    return (
      <div id="signIn">
      <form  onSubmit={this.onSignIn} className="container">
         <h1>Sign In</h1>
         <p>Please fill in this form to sign-In.</p>
         <hr />

         <label htmlFor="email"><b>Email</b></label>
         <input  onChange={this.onEmailChange} type="text" placeholder="Enter Email" name="email" required />

         <label htmlFor="psw"><b>Password</b></label>
         <input  onChange={this.onPasswordChange} type="password" placeholder="Enter Password" name="password" required />
         <button ref = "cpDev1" type="submit" className="registerbtn">Sign-In</button>
  </form>
      </div>
    );
  }
}

export default signIn;
