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

app.get('/stock_take',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','stocktake.html'))
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
  let firstname = (`${req.body.firstname}`)
  let lastname = (`${req.body.lastname}`)
  sql = "INSERT INTO profiles (first_name, last_name, img) VALUES ('"+firstname+"', '"+lastname+"', '"+req.file.filename+"')";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
});
})



app.get('/',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
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
  console.log(ID_value)
  });
})



app.get('/*', (req,res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
});

const url = 'https://www.webmound.com/uploads/26/banner.jpg';


app.listen(PORT, () => console.log('server is running'));

