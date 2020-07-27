var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
  username: String,
  email: String,
password: String
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'})
/*userSchema.methods.validPassword = function( pwd ) {
    console.log(pwd, this);
    return ( this.password === pwd );
};*/
module.exports=mongoose.model("User",userSchema);
