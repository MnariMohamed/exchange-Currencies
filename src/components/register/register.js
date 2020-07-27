import React from 'react';
import './register.css';

class register extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username:"",
      email:"",
      password:""
    }
  }

  onNameChange=(event)=>{
  this.setState({username: event.target.value})
}
onEmailChange=(event)=> {
this.setState({email: event.target.value})
}
onPasswordChange=(event)=> {
  this.setState({password: event.target.value})
}

  onRegister=(e)=>{
    e.preventDefault();
    fetch("http://localhost:3000/register",{
  method:'POST',
  credentials : 'include',
  headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
  body:JSON.stringify({
    username:this.state.username,
    email: this.state.email,
    password: this.state.password
  })
}).then(response => response.json()).then(user=>{
  if(user._id){
    this.props.onUserChanged(user);
  }
else {
  alert("something is wrong");
}
});
  }
  render(){
    const {onRouteChange}=this.props;
    return (
      <div id="register-div">
      <form  onSubmit={this.onRegister} className="container">
         <h1>Register</h1>
         <p>Please fill in this form to create an account.</p>
         <hr />
         <label for="name"><b>fullName</b></label>
         <input onChange={this.onNameChange} type="text" placeholder="Enter Name" name="name" required />

         <label for="email"><b>Email</b></label>
         <input onChange={this.onEmailChange} type="text" placeholder="Enter Email" name="email" required />

         <label for="psw"><b>Password</b></label>
         <input onChange={this.onPasswordChange} type="password" placeholder="Enter Password" name="psw" required />
         <button type="submit" className="registerbtn">Register</button>
  </form>

  <div className="container signin">
    <p>Already have an account? <button onClick={()=>onRouteChange("signIn")}>Sign in</button>.</p>
  </div>
         </div>
    );
  }
}

export default register;
