const express = require('express');
const mysql = require('mysql')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {logger} = require('./middleware/logEvents.js');
const { appendFileSync } = require('fs');
const { error } = require('console');
var router = express.Router()


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


if (typeof window !== 'undefined') {
  // 👉️ can use document here
  console.log('You are on the browser')

  console.log(document.title)
  console.log(document.getElementsByClassName('my-class'));
}

app.post("/table", (req, res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
    let Product = (`${req.body.cars}`)
    let Desciption = (`${req.body.owo}`)
    sql = "INSERT INTO products (product, quantity, desciption) VALUES ('"+Product+"','1', '"+Desciption+"')";
    con.query("SELECT * FROM products ORDER BY product", function (err, result) {
        if (err) throw err;
        console.log('good');
    });
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
  });
})

app.get('/main', function(req, res)  {
  sql = "SELECT * FROM products" ;
  con.query(sql, function (err, result, next) {
    let rows = JSON.parse(JSON.stringify(result))  
    res.render(__dirname + "/veiws/admin.html", {
      ID: rows });
  });
});


app.post("/create", (req, res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
    let firstname = (`${req.body.first_name}`)
    let lastname = (`${req.body.last_name}`)
    sql = "INSERT INTO profiles (first_name, last_name) VALUES ('"+firstname+"', '"+lastname+"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
  });
})


app.get('/',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
});


app.get('ID',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','Homepage.html'))
});

app.get('/*', (req,res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
});

app.listen(PORT, () => console.log('server is running'));

