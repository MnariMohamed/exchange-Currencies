import React from 'react';
import './exchange.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class exchange extends React.Component {
  constructor(props){
    super(props)
    this.state={
      clientSold: 'paypal',
      clientCurrency: '$',
      input:0,
      output: 0
    }
  }
  changeSold=(sold)=>{
    this.setState({clientSold:sold}, function() {
      this.calcOutput(this.state.input);
    })
  }
  changeCurrency=(currency)=>{
    this.setState({clientCurrency:currency},function () {
      this.calcOutput(this.state.input);
    });
  }

   inputChange=(e)=>{
     this.setState({input:e.target.value});
     this.calcOutput(e.target.value);
}

     calcOutput=(input)=>{
     var clientSold=this.state.clientSold;
     var clientCurrency=this.state.clientCurrency;
     var calc;
     if(clientSold=="paypal")
     {
       if(clientCurrency=="$"){
         calc=input*0.89;
         this.setState({output:calc});
       }
       else
       {
         calc=input*0.86;
         this.setState({output:calc});
       }
     }
     else
      {
       if(clientCurrency=="$")
       {
         calc=input*0.94;
         this.setState({output:calc});
       }
        else
       {
         calc=input*0.93;
         this.setState({output:calc});
       }
       }

}

onSubmitExchange=()=>{
  fetch("http://localhost:3000/exchange",{
method:'POST',
credentials : 'include',
headers:{'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
body:JSON.stringify({
  sendsold: this.state.clientSold,
  recievesold: this.state.clientSold=="paypal" ? "skrill" : "paypal",
sendcurrency: this.state.clientCurrency,
recievecurrency: this.state.clientCurrency=="$" ? "€" : "$",
amountsend: this.state.input,
amountrecieve: this.state.output
})
}).then(response => response.json()).then(res=>{
  window.open(res, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=200,width=600,height=800");
  this.props.onRouteChange("requests");
});

}

componentDidMount(){
}
  render(){
    const {clientSold, clientCurrency, output}=this.state;
    var sold=clientSold=="paypal" ? "skrill" : "paypal";
    var currency=clientCurrency=="$" ? "$" : "€";
    return (
<div id="exchange">
<h2>I want to transfer: </h2>

<div className="input-group mb-3">
  <div className="input-group-prepend">
  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{clientSold}</button>
    <div className="dropdown-menu">
    { clientSold=="skrill" ?
      <div onClick={(e)=>this.changeSold('paypal')} className="dropdown-item">Paypal</div>
      :
      <div onClick={(e)=>this.changeSold('skrill')} className="dropdown-item"div>Skrill</div>
    }

    </div>

     </div>
  <input onChange={this.inputChange} type="text" className="form-control" placeholder="your amount here.."/>
  <div className="input-group-append">
  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{clientCurrency}</button>
  <div className="dropdown-menu">
  { clientCurrency=="€" ?
    <div onClick={(e)=>this.changeCurrency('$')} className="dropdown-item">$</div>
    :
    <div onClick={(e)=>this.changeCurrency('€')} className="dropdown-item">€</div>
}
  </div>  </div>
</div>

<h2>I get:</h2>

<div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text">{sold}</span>
  </div>
  <input type="text" className="form-control" value={output} disabled="true"/>
  <div className="input-group-append">
    <span className="input-group-text">{currency}</span>
  </div>
</div>
<Link to="/requests">
<button className="btn btn-lg btn-success" onClick={this.onSubmitExchange}>
Exchange</button>
</Link>
</div>
    )
    }
  }

  export default exchange;
