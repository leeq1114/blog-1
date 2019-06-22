// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { PostManager, User } = require('./model.js');
require('./config.js');

const postManager = new PostManager();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  postManager.findAll((err, rows) => {
    console.log(err);
    console.log(rows);
    res.render('home', {
      homeStartingContent,
      posts: rows
    });
  });
});

app.get('/home', (req, res) => {
  res.redirect('/');
});

app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent
  });
});

app.get('/compose', (req, res) => {
  res.render('compose', {});
});

app.post('/compose', (req, res) => {
  postManager.create(req.body.title, req.body.content, () => {
    res.redirect('/');
  });
});

app.get('/posts/:id', (req, res) => {
  console.log(req.params.id);
  postManager.findById(req.params.id, (err, post) => {
    if (post) {
      res.render('post', {
        post
      });
    } else {
      res.redirect('/');
    }
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log(req.body);
  User.find({
    username: req.body.username
  }, (err, users) => {
    if (err) {
      console.error(err);
    } else if (users && users.length > 0) {
      const user = users[0];
      if (user.password === req.body.password) {
        // Login succeeded.
        res.redirect('/');
        return;
      } else {
        console.log('Wrong password!');
      }
    } else {
      console.log('No user');
    }
    res.redirect('/login');
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  console.log(req.body);
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save((err, data) => {
    if (err) {
      console.error(err);
      res.redirect('/register');
    } else {
      console.log('User created: ', JSON.stringify(data));
      res.redirect('/login');
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port " + (process.env.PORT || 3000));
});
