// jshint esversion: 6
require('./config.js');
const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-5htv5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(url);
mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log('Connection succeeded!'));

// post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('post', postSchema);

// posts: id: TEXT, title TEXT, content TEXT

module.exports = class PostManager {
  findAll(callback) {
    Post.find((err, data) => {
      data.forEach(elem => elem.id = elem._id.toString());
      callback(err, data);
    });
  }

  findById(id, callback) {
    Post.findById(id, (err, data) => callback(err, data));
  }

  create(title, content, callback) {
    const post = new Post({title, content});
    post.save((err, data) => {
      if (data) {
        console.log('Post created: ', JSON.stringify(data));
        callback();
      }
    });
  }
};
