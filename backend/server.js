var app=require("express")();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var ejs=require("ejs");
var methodOverride=require("method-override");
var passport=require("passport");
var localStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var session=require("express-session");
var nodemailer = require('nodemailer');
var path = require('path');
const paypal = require('paypal-rest-sdk');
var User=require("./models/user");
var Exchange=require("./models/exchange");

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': '<<client_id>>', // please provide your client id here
  'client_secret': '<<client_secret>>' // provide your client secret here
});

//app.use(cookieParser());
app.use(session({
  secret: "secret",
  saveUninitialized: false,
resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With, X-HTTP-Method-Override, Accept");
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
    res.send();
  } else {
    next();
  }
});




app.use(function(req, res, next) {
  res.locals.currentUser=req.user;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost/exchangecurrencies");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));



passport.use(new localStrategy({
  usernameField: 'email'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////Routes**************
app.get("/", function (req, res) {
  res.json("hi");
})


app.post("/exchange", isLoggedIn, function (req, res) {
  const user={id: req.user._id, username: req.user.username};
  var sendsold= req.body.sendsold;
  var recievesold= req.body.recievesold;
var sendcurrency= req.body.sendcurrency;
var recievecurrency= req.body.recievecurrency;
var amountsend= req.body.amountsend;
var amountrecieve= req.body.amountrecieve;
var options = {day: 'numeric', month: 'numeric', year: 'numeric', hour:"numeric", minute:"numeric" };
var date= new Date();
date=date.toLocaleDateString("en-us",options);
const theExchange={user: user, sendsold: sendsold, recievesold: recievesold, sendcurrency: sendcurrency, recievecurrency: recievecurrency, amountsend: amountsend, amountrecieve: amountrecieve, date: date};
Exchange.create(theExchange, function (err, exchange) {
  if(err){
    res.json(err);
  }
  else {
    var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohamedmnari94@gmail.com',
    pass: '<<password>>'
  }
});

var mailOptions = {
  from: 'mohamedmnari94@gmail.com',
  to: req.user.email,
  subject: 'Sending Email using Node.js',
  html: '<p>hello dear, <br> you sent '+exchange.amountsend+exchange.sendcurrency+" "+exchange.sendsold+" in exchage to "+exchange.amountrecieve+exchange.recievecurrency+" "+exchange.recievesold
  +"</p><h2> to confirm <strong>reply to this email by yes</strong></h2>"
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

// create payment object
const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/payment/success",
        "cancel_url": "http://localhost:3000/payment/err"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Red Sox Hat",
                "sku": "001",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "Hat for the best team ever"
    }]
};
    // call the create Pay method
paypal.payment.create(create_payment_json, function (err, payment) {
  if(err) console.log(err);
  else {
    for(let i = 0;i < payment.links.length;i++){
           if(payment.links[i].rel === 'approval_url'){
             res.json(payment.links[i].href);
           }
         }
         }
});

    //res.json(exchange);
  }
})
});

app.get("/payment/success", function (req, res) {
  const payerId = req.query.PayerID;
const paymentId = req.query.paymentId;

const execute_payment_json = {
  "payer_id": payerId,
  "transactions": [{
      "amount": {
          "currency": "USD",
          "total": "1.00"
      }
  }]
};
paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
   if (error) {
       console.log(error.response);
       throw error;
   } else {
       console.log(JSON.stringify(payment));
       res.json('Success');
   }
});

});

app.get("/payment/err", function (req, res) {
  res.json("Boo");
});
app.get("/requests/:userid", function(req, res) {
  Exchange.find({"user.id": req.params.userid}).sort({ date : "desc"}).exec(function (err, exchanges) {
if(err) {
  console.log(err);
  res.json(err);
}
else {
  res.json(exchanges);
}
  });
});

//*********************************User Routes*********************************************//
///////////////////////Register
app.post("/register", function(req, res) {
  var user=new User({username: req.body.username, email: req.body.email});
  User.register(user, req.body.password, function (err) {
    if(err)
    res.json(err);
    else {
      passport.authenticate("local")(req, res, function () {
res.json(user);
   })
    }
  })
});
/////////////////signIn
app.post("/login", passport.authenticate('local', {
    successRedirect: '/successLogin',
    failureRedirect: '/',
  })
);
app.get("/successLogin", function (req, res) {
  res.json(req.user);
})
//////////////logout
app.get("/logout",function (req, res) {
req.logout();
console.log(req.isAuthenticated());
res.json("successful");
});
////user get
app.get("/currentUser/:id", function (req, res) {
User.findById(req.params.id, function(err, user) {
  if(err){
    res.json(null);
    console.log(err);
  }
  else {
    console.log(user);
    res.json(user);
  }
})
})
/////////////////////

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  else {
console.log("error in isLoggedIn");
  }
}

// helper functions
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err);
         }
        else {
            resolve(payment);
        }
        });
    });
}

app.listen(3000, function() {
  console.log("started");
})
