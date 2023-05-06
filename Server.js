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


app.post("/table", (req, res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
    let Product = (`${req.body.cars}`)
    let Desciption = (`${req.body.owo}`)
    sql = "INSERT INTO products (product, quantity, desciption) VALUES ('"+Product+"','1', '"+Desciption+"')";
    con.query("SELECT * FROM products ORDER BY product", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
  });
})

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

router.get('/owo', function (request, response, next) {
  var query = 'SELECT * FROM products ORDER BY id desc'
  database.query = (query, function (err, rows) {
    if (error) {
      throw error
    } else {
      response.render('admin', { data: rows })
    }
  })
})
module.exports = router
app.get('/owo',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','admin.ejs'))
});


app.get('/users', function(req, res) {
  con.query("SELECT * FROM products ORDER BY ID", function (err, result, fields) {
    if (err) throw err
      res.json('users', {title: 'User Details', message: result})
    console.log(result)
  });
});



app.get('/admin',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','admin.html'))
});

app.get('/',(req,res)=>
{ res.sendFile(path.join(__dirname,'veiws','index.html'))
});

app.get('/*', (req,res) => {
    res.status(404).sendFile((path.join(__dirname,'veiws','404.html')))
});

app.listen(PORT, () => console.log('server is running'));

