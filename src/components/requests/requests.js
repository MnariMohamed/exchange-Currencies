import React from 'react';
import "./requests.css";

class requests extends React.Component{
  constructor(props){
    super(props);
    this.state={
userRequests:[]
    }
    this.fetchRequests();
  }
fetchRequests(){
  fetch("http://localhost:3000/requests/"+this.props.user._id)
  .then(response=>response.json())
  .then(theRequests=>{
    console.log(theRequests);
    this.setState({userRequests:theRequests});
}
  );
}
componentDidMount(){
}
render(){
  const {userRequests}=this.state;
  if(userRequests.length<1) return <span>Loading..</span>;
  return(
<div id="requests" class="container">
<h2>check your email to confirm a request by replying with "yes"</h2>
<table className="table table-bordered">
<thead>
<tr>
<th>send sold</th>
<th>recieve sold</th>
<th>send currency</th>
<th>recieve currency</th>
<th>amount send</th>
<th>amount recieve</th>
<th>Date</th>
</tr>
</thead>
<tbody>
{
  userRequests.map(function (userRequest,i) {
    return(
      <tr>
      <td>{userRequest.sendsold}</td>
      <td>{userRequest.recievesold}</td>
      <td>{userRequest.sendcurrency}</td>
      <td>{userRequest.recievecurrency}</td>
      <td>{userRequest.amountsend}</td>
      <td>{userRequest.amountrecieve}</td>
      <td>{userRequest.date}</td>
      </tr>
    )

  })

}
</tbody>
</table>
</div>
  );
}




}

export default requests;
