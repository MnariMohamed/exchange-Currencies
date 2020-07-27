var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var exchnageSchema=new mongoose.Schema({
  user:{
  id: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
},
  username: String
},
  sendsold: String,
  recievesold: String,
sendcurrency: String,
recievecurrency: String,
amountsend: Number,
amountrecieve:Number,
date: String
});


module.exports=mongoose.model("Exchange",exchnageSchema);
