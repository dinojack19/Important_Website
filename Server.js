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
const crypto = require('crypto');


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
var filename = "d15252dc.png"
var amount = []




var authenticateToken = function() {
  var a = sessionStorage.getItem("Token") //get token from session 
  if (a == null){ 
    return 1 ; // if there is no toekn 
  }
  else {
    var decode = jwt.verify(a , process.env.JWT_SECRET_KEY) // verify the token
    if(decode.Admin == "admin"){
      return 3  //check the status of said user. 
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
    sql = "INSERT INTO cart (User_ID) values('"+decode.ID+"')" ;
    con.query(sql, function (err, result, next) {
      return result
    })
  }else{
    console.log("owo")
  }
}

function randomstring(){
  uuid = (crypto.randomUUID());
  value = uuid.substring(0, 8); 
  return value
}

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  const hashedPassword = hash.update(password).digest('hex');
  return hashedPassword;
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/static")
  },
  filename: function (req, file, cb) {
    cb(null, randomstring()+ ".png")
    }
  }
)
var upload = multer({ storage: storage })


app.get('/Product_line', function(req, res)  { //when asked 
  sql = "SELECT * FROM products" ;             // query the data base
  con.query(sql, function (err, result, next) {
    let rows = JSON.parse(JSON.stringify(result))  // change the form of our data
    res.render(__dirname + "/veiws/Product_line.html", {   // then send it to our front end
      ID: rows });
  });
});

app.get('/Stock_take_*', (req,res)=>{ 
  ID=req.path
  user_id = req.path.replace("/Stock_take_",'');
  var nume = parseInt(user_id)
  console.log(nume)
  var status = authenticateToken()
  console.log(status)
  if (status == 3){
    sql = "SELECT * FROM products" ;
    con.query(sql, function (err, result, next) {
      let stocktake = JSON.parse(JSON.stringify(result)) 
      res.render(__dirname + "/veiws/Stocktake.html", {
        yes: stocktake, ID:nume});

    })
  }else{
    res.status(403).sendFile(path.join(__dirname,'veiws','Homepage.html'));
  }
});


app.get('/signup',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','signup.html'))
});

app.post('/easports',(req,res)=> { 
  var a = sessionStorage.getItem("Token")
  var decode = jwt.verify(a , process.env.JWT_SECRET_KEY)
  sql=" ((SELECT COUNT(*) AS result_count FROM Cart_item WHERE session_iD = (SELECT User_ID FROM Cart WHERE ID = ('"+decode.ID+"'))))"
  con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
      res.sendFile(path.join(__dirname,'veiws','signup.html'))});
})
app.get('/delete_items',(req,res)=> { 
  var a = sessionStorage.getItem("Token")
  var decode = jwt.verify(a , process.env.JWT_SECRET_KEY)
  sql=`DELETE FROM Cart_item products WHERE ID IN (SELECT DISTINCT Product_id FROM Cart_item WHERE session_iD = (SELECT User_ID FROM Cart WHERE ID = 1))`
  con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);  


  });
})

app.get('/items',(req,res)=> { 
  var a = sessionStorage.getItem("Token")
  var decode = jwt.verify(a , process.env.JWT_SECRET_KEY)
  sql="SELECT * FROM products WHERE ID IN (SELECT DISTINCT Product_id FROM Cart_item WHERE session_iD = (SELECT User_ID FROM Cart WHERE ID = ('"+decode.ID+"')))"
  con.query(sql, (err, results) => {
    console.log(results)
      var items = results.map(row => ({
        id: row.ID,
        Product: row.product,
        Quantity: row.quantity,
        img_fiel: row.img,
      }))
    res.json(items);  
  })
});

app.post("/create",  upload.single('tomato') ,(req, res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
    var values = [req.body.product ,req.body.description ,req.value ];
    sql = "INSERT INTO products (product, desciption, img) VALUES (?, ?, ?)";
    con.query(sql,values, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
  });
})

app.post("/create_profile" ,upload.single('tomato'), (req, res) => {    //when asked
  sql = "INSERT INTO profiles_1 (first_name, last_name, img) VALUES (?, ?, ?)" // create a query 
  pasword = hashPassword(req.body.lastname) //encrypt our passowrd 
  if (req.file != undefined) {   //check if there is a file
    tomato =req.file.filename //if it does use the file
  }else{
    tomato = filename   //if not use defult
  }
  res.sendFile((path.join(__dirname,'veiws','homepage.html')))  
  var values = [req.body.firstname ,pasword ,tomato ]; //given values for query 
  con.query(sql,values, function (err, result) {    // then query the data base 
      if (err) throw err;
      console.log("1 record inserted");
  })
})


app.post("/login", (req, res) => {
  let username = req.body.user_name
  let password = req.body.Password
  encrypted = hashPassword(password) 
  console.log(encrypted)
  sql = "SELECT * FROM profiles_1 WHERE first_name = ('"+username+"') AND last_name = ('"+encrypted+"')"
    let data = con.query(sql, function (err, result) {
      if (err) throw err;
      let length = (result.length) 
        if (length <= 1 ) {
          var token1 = jwt.sign({ ID: result[0].ID, Admin: result[0].Admin,} ,process.env.JWT_SECRET_KEY);
          sessionStorage.setItem("Token",token1)
          var status = authenticateToken()
          res.render(__dirname+'/veiws/Homepage.html', {e:status, data:result[0], value:"tomatosoup"})
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
    var a = sessionStorage.getItem("Token")
    var decode = jwt.verify(a , process.env.JWT_SECRET_KEY)
    sql = "INSERT INTO cart_item (Product_id, Session_iD, ) VALUES (?, ?, )"
    var values = [req.body.item ,decode.ID ,];
    let data = con.query(sql,values, function (err, result) {
      if (err) throw err;
    })
    res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
  }
});


app.get('/login',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','login.html'))
});

app.get('/creation',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','creation.html'))
});

app.post('/creation_e',(req,res)=>{
  console.log(req.body)
  res.sendFile(path.join(__dirname,'veiws','homepage.html'))
  sql = "INSERT INTO products (product, quantity, desciption, img) VALUES (?, ?, ?, ?)"
  var values = [req.body.Product , req.body.quantity, req.body.description, req.body.tomato];
  con.query(sql,values, function (err, result) {
    if (err) throw err;
  })
})


app.post('/ID',(req,res)=> { 
  sql = "SELECT * FROM products" ;
  console.log(req.body)
  let data = req.body.hi
  console.log(data)
  let number = data -= 1
  con.query(sql, function (err, result, next) {
    let e = JSON.parse(JSON.stringify(result))  
    ID_value = e[number]
    console.log(ID_value)
    res.render(__dirname + "/veiws/product.html", {
      yes: ID_value });

  });
})

app.post('/modify',(req,res)=> 
{ console.log(req.body)
  res.sendFile(path.join(__dirname,'veiws','stocktake.html'))
})



app.get('/', (req,res) => { 
  var status = 2
  console.log(status)
  if (status < 1){
    sql = "SELECT * FROM products" 
    con.query(sql, function (err, result, next) {
      let e = JSON.parse(JSON.stringify(result))  
      console.log(result) 
      res.render(__dirname + "/veiws/Homepage.html",{e:status, data:result, value:"tomatosoup"})
 })}else {
  res.render(__dirname + "/veiws/Homepage.html",{e:status, data:"e", value:"tomatosoup"})
  }
});



app.get('/*', (req,res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
});


app.listen(PORT, () => console.log('server is running'));

