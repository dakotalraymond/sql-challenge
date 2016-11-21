var express = require('express');
var mysql = require('mysql')
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dakoat101!',
  database: 'web'
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})

connection.query('SELECT * FROM blogs', function (err, rows, fields) {
  if (err) throw err
  //console.log('blogs', {blogs: rows});
})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  var blogs;
  connection.query('SELECT * FROM blogs', function (err, rows, fields) {
    if (err) throw err
    console.log(rows[1].blogText);
    blogs = rows;
    res.render('index', {blogs: rows});
  })
});

app.post('/', function(req, res){
  console.log(req.body.id);
  var query = connection.query("DELETE FROM blogs WHERE id = ? ", [req.body.id] , function(err, rows) {
    res.redirect('/');
  });
})

app.get('/edit/:id', function(req, res){
  var id = req.params.id;
  if(id === undefined){
    res.status(404);
    res.send("This page doesn't exist");
  } else {
    connection.query('SELECT * FROM blogs', function (err, rows, fields) {
      if (err) throw err
      console.log(rows[1].blogText);
      blogs = rows;
      res.render('edit', {blog: rows[id]});
    })
  }
});

app.post('/edit/:id', function(req, res){
  var data = {
    blogTitle : req.body.name,
    blogText   : req.body.blogbody
  };
  var query = connection.query("UPDATE blogs set ? WHERE id = ?", [data, req.params.id] , function(err, rows) {
    res.redirect('/');
  });
});

app.get('/new', function(req, res){
  res.render('new');
})

app.post('/new', function(req, res){
  var data = {
    blogTitle : req.body.name,
    blogText   : req.body.blogbody
  };
  var query = connection.query("INSERT INTO blogs set ?", data , function(err, rows) {
    res.redirect('/');
  });
})

app.listen(3000, function(){
  console.log("The server is running on localhost:3000")
})
