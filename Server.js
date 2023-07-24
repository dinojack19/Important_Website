const express = require('express');
const mysql = require('mysql')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {logger} = require('./middleware/logEvents.js');
const { appendFileSync, truncate } = require('fs');
const { error } = require('console');
var router = express.Router()
var multer = require('multer');
var upload = multer({dest:'public/static/'});
var sessionStorage = require('sessionstorage');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');

const PORT = process.env.PORT || 3305;

var con = mysql.createConnection({
    host: "localhost",
    user: "Jack",
    password: 'rootAPPLE',
    database: "owo",
});

app.set('view engine', 'html');
app.use(express.static("public"));
app.use(express.json());
app.use(logger)
app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('html', require('ejs').renderFile);
dotenv.config();
process.env.JWT_SECRET_KEY;



var authenticateToken = function() {
  var a = sessionStorage.getItem("Token")
  if (a == null){ 
    return 1 ;
  }
  else {
    var decode = jwt.verify(a , process.env.JWT_SECRET_KEY)
    if(decode.Admin = "admin"){
      return 3
    }else{
      return 2 
    }
  }
}

var cart = function(){
  var carter = true
  var a = sessionStorage.getItem("Token")
  var decode = jwt.verify(a , process.env.JWT_SECRET_KEY)
  sql = "SELECT * FROM cart WHERE User_ID = ('"+decode.ID+"')" ;
    con.query(sql, function (err, result, next) {
      if (result = null ){
        carter == false
      }else{ 
        return result
      }
    })
  if (carter= false ){
    sql = "INSERT INTO cart  (User_ID) values('"+decode.ID+"')" ;
    con.query(sql, function (err, result, next) {
      return result
    })
  }else{
    console.log("owo")
  }
}



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/static")
  },
  filename: function (req, file, cb) {
    cb(null, "-" + file.originalname)
  }
})

var upload = multer({ storage: storage })


app.get('/Product_line', function(req, res)  {
  sql = "SELECT * FROM products" ;
  con.query(sql, function (err, result, next) {
    let rows = JSON.parse(JSON.stringify(result))  
    res.render(__dirname + "/veiws/Product_line.html", {
      ID: rows });
  });
});

app.get('/stock_take', (req,res)=>{ 
  var status = authenticateToken()
  if (status == 3){
    sql = "SELECT * FROM products" ;
    con.query(sql, function (err, result, next) {
      let stocktake = JSON.parse(JSON.stringify(result))  
      res.render(__dirname + "/veiws/Stocktake.html", {
        yes: stocktake });
    })
  }else{
    res.status(403).sendFile(path.join(__dirname,'veiws','Homepage.html'));
  }
});


app.get('/signup',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','signup.html'))
});

app.post("/create",  upload.single('tomato') ,(req, res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
    var values = [req.body.product ,req.body.description ,req.file.filename ];
    sql = "INSERT INTO products (product, desciption, img) VALUES (?, ?, ?)";
    con.query(sql,values, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
  });
})

app.post("/create_profile",  upload.single('tomato') ,(req, res) => {
  res.sendFile((path.join(__dirname,'veiws','homepage.html')))
  if (req.file == undefined){
    req.file.filename = "default.png" 
  }else{
  sql = "INSERT INTO profiles (first_name, last_name, img) VALUES (?, ?, ?)"
  var values = [req.body.firstname ,req.body.lastname ,req.file.filename ];
  con.query(sql,values, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
  })
}})


app.post("/login", (req, res) => {
  let username = req.body.user_name
  let password = req.body.Password
  sql = "SELECT * FROM profiles WHERE first_name = ('"+username+"') AND last_name = ('"+password+"')"
    let data = con.query(sql, function (err, result) {
      if (err) throw err;
      let length = (result.length) 
        if (length == 1 ) {
          var token1 = jwt.sign({ ID: result[0].ID, Admin: result[0].Admin, login :true} ,process.env.JWT_SECRET_KEY);
          res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
          sessionStorage.setItem("Token",token1)
        }else{
          res.sendFile(path.join(__dirname,'veiws','login.html'))
          console.log("wrong")
        };
    })
})

app.post('/buy',(req,res)=>{ 
  var status = authenticateToken()
  if (status <= 2 ){
    res.sendFile(path.join(__dirname,'veiws','signup.html'))
  }else{
    var cart_true = cart()
    console.log(cart_true)
    var values = [req.body.item ];
    sql = "INSERT INTO cart_item (Product_id, last_name,) VALUES (?, ?)"
    let data = con.query(sql,values, function (err, result) {
      if (err) throw err;
    })
    res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
  }
});


app.get('/login',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','login.html'))
});

app.post('/ID',(req,res)=> { 
  sql = "SELECT * FROM products" ;
  let data = req.body.shit
  let number = data -= 1
  con.query(sql, function (err, result, next) {
    let e = JSON.parse(JSON.stringify(result))  
    ID_value = e[number]
    res.render(__dirname + "/veiws/product.html", {
      yes: ID_value });
  });
})

app.get('/', (req,res) => {
  var login = authenticateToken()
  if(login == 2 ){
    var decode = jwt.verify(sessionStorage.getItem("Token") , process.env.JWT_SECRET_KEY)
    res.render(__dirname + "/veiws/homepage.html", {
      yes: login });
  }else{
  res.status(404).sendFile((path.join(__dirname,'veiws','Homepage.html')))
  }
});


app.get('/*', (req,res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
});


app.listen(PORT, () => console.log('server is running'));

