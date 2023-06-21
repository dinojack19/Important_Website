const express = require('express');
const mysql = require('mysql')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {logger} = require('./middleware/logEvents.js');
const { appendFileSync } = require('fs');
const { error } = require('console');
var router = express.Router()
var multer = require('multer');
var upload = multer({dest:'public/static/'});
var sessionstorage = require('sessionstorage');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

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

function generateAccessToken(username) {
  return jwt.sign(username, process.env.JWT_SECRET_KEY, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  jwt.verify(token, process.env.TOKEN_SECRET,()  => {
    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
 
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

app.get('/stock_take',authenticateToken , (req,res)=>{ 
  let privlege = sessionstorage.getItem("Privlage");
  //let key = sessionstorage.getItem("Hash");
  //if (privlege == "admin" ) {
    sql = "SELECT * FROM products" ;
    con.query(sql, function (err, result, next) {
      let stocktake = JSON.parse(JSON.stringify(result))  
      res.render(__dirname + "/veiws/Stocktake.html", {
        yes: stocktake });
    })
  /*}else{
    console.log("you done have permision")
  } */
});


app.get('/signup',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','signup.html'))
});

app.post("/create",  upload.single('tomato') ,(req, res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
    let firstname = (`${req.body.product}`)
    let lastname = (`${req.body.description}`)
    sql = "INSERT INTO products (product, desciption, img) VALUES ('"+firstname+"', '"+lastname+"', '"+req.file.filename+"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
  });
})

app.post("/create_profile",  upload.single('tomato') ,(req, res) => {
  res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
  if (req.file = undefined){
    req.file.filename = "default.png" 
  }
  sql = "INSERT INTO profiles (first_name, last_name, img) VALUES ('"+req.body.firstname+"', '"+req.body.lastname+"', '"+req.file.filename+"')";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
});
})

app.post("/login", (req, res) => {
  let username = req.body.user_name
  let password = req.body.Password
  sql = "SELECT * FROM profiles WHERE first_name = ('"+username+"') AND last_name = ('"+password+"')"
    con.query(sql, function (err, result) {
      console.log(result)
      if (err) throw err;
      let length = (result.length) 
        if (length <= 1 ) {
          res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
          const token = generateAccessToken({ username: result[0].first_name });
          console.log(token)
        }else{
          res.sendFile(path.join(__dirname,'veiws','login.html'))
          console.log("wrong")
        };
    })
})

app.get("/token", (req, res) => {

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
      const token = req.header(tokenHeaderKey);
      const verified = jwt.verify(token, jwtSecretKey);
      if(verified){
          return res.send("Successfully Verified");
      }else{
          // Access Denied
          return res.status(401).send(error);
      }
  } catch (error) {
      // Access Denied
      return res.status(401).send(error);
  }
});

app.get('/',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
});

app.post('/delete', (req,res)=>{
  let data = req.body.delete
  sql="DELETE FROM products WHERE ID = ('"+data+"') "
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.sendFile(path.join(__dirname,'veiws','homepage.html'))
  })
});

app.post('/modify', (req,res)=>{
  let data = req.body
  console.log(data)
  sql="UPDATE products SET Product=('"+req.body.Product+"'), DESCIPTION=('"+req.body.description+"'),QUANTITY=(('"+req.body.quantity+"')) WHERE ID=('"+req.body.ID+"');"
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.sendFile(path.join(__dirname,'veiws','homepage.html'))
  })
});



app.get('/3',(req,res)=>
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



app.get('/*', (req,res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
});


app.listen(PORT, () => console.log('server is running'));

