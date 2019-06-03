
var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require('method-override');
    

mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));

// SCHEMA SETUP
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created : {type: Date,
   default: Date.now} //default date
});

let post = [{
   image: String,
   price: String,
}];

var Blog = mongoose.model("Blog", blogSchema);


app.get("/", function(req, res){
    res.redirect("blogs");
});

//INDEX - show all campgrounds
app.get("/blogs", function(req, res){
    // Get all campgrounds from DB
    Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       } else {
          res.render("home",{blogs:blogs});
       }
    });
});

app.get("/blogs/author", function(req, res){
    // Get all campgrounds from DB
   res.render("author");
});

app.get("/blogs/new", function(req, res){
    // Get all campgrounds from DB
   res.render("new");
});

//Create route
app.post("/blogs", function(req, res){
    // Create blog
   Blog.create(req.body.blog,function(err, newBlog){
      if(err){
         res.render("new");
      } else {
        res.redirect("/blogs");
       }
});
});
//to show he blog bigger
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err,foundBlog){
  if(err){
      res.redirect("/blogs");
  }else {
       res.render("show", {blog:foundBlog});
      
  }
  });
});

//to edit 
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs")
       } else {
           res.render("edit", {blog: foundBlog});
       }
   });
});

//PUT Update
app.put("/blogs/:id", function(req, res){
     req.body.blog.body = req.sanitize( req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});

//Delete
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
       if(err){
           res.redirect("/blogs");
       } else {
          res.redirect("/blogs");
       }
   })
});






app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});