//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});

const blogPostSchema = ({
  title: String,
  paragraphs: []
});
const Post = mongoose.model("Post", blogPostSchema);
const bigO = new Post({
  title: "Why the big O notation is not the same as worst case execution time",
  paragraphs: ["Each algorithm has a best case, a worst case and an average case performance based on a particular input.", "Take as an example linear search. We are searching for an element k in the array with n elements. The best case performance for the linear search is when k is the first element of the array. After looking at the first element we are done, and the run time complexity in this case is Θ(1). For those who forgot, Θ describes tight upper and lower bound, so Θ(1) means the algorithm is both O(1) and Ω(1). Which makes sense: if k is the first element, we have to check at least one element, i.e. Ω(1), but at the same time at most 1 element, i.e. O(1), because in this specific scenario we will never have to look for the element past the first index.", "Let’s take the worst case scenario, when k is either the last element of the array, or is not there at all. We must iterate over all n elements in order to find that out, so the run time complexity for this case is Θ(n): one must go over at least n elements - Ω(n), but also not more than n elements - O(n).", "So, it is clear that both - best case and worst case have their own big O and big Ω. So, why is this topic confusing? In most cases, when programmers talk about the run time complexity of a given algorithm, they don’t split it into worst and best cases, and in the case with the linear search above they would say that the algorithm has the run time complexity of Ω(1) and O(n), meaning that based on the input, it can execute in as little as constant time - Ω(1), and as maximum it will go over all n elements - O(n)."]
});
//bigO.save();
const aboutContent = new Post({
  title: "About",
  paragraphs: ["Hi! My name is Irina.", "After graduating with a MA in Linguistics and working for several years in a large state corporation, I realized that I had a passion for technology and programming, and decided to change my career.", "Back then I lived in Austria, and in order to follow my dream I learned German in one year, passed the entrance exams and enrolled in  Computer Science Bachelor program.", "Right now I am studying, working as a freelance web developer, and can say with certainty that it's never too late :) "]
});
const contactContent = new Post ({
  title: "Contact",
  paragraphs: ["Ask me anything"]
});

app.get("/", function(req, res){
  Post.find(function(err, foundPosts){
    if (!err){
      res.render("home", {
        posts: foundPosts
        });
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutTitle: aboutContent.title, paragraphs: aboutContent.paragraphs});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactTitle: contactContent.title, paragraphs: contactContent.paragraphs});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  }); 
});

app.get("/posts/:postId", function(req, res){
  Post.findById(req.params.postId, function(err,foundPost){
    if (!err){
      res.render("post", {
        title: foundPost.title,
        paragraphs: foundPost.paragraphs
      });
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
