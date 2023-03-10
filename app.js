const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));


//connecting to database locally

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);


///// Request Targeting All Articles /////

app.route("/articles")
.get((req, res) => {
    Article.find( (err, foundArticles) =>{
        if(!err) {
            res.send(foundArticles);
        } else {
            console.log("err");
        };
    });

})
.post((req, res) => {

        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save( (err) => {
            if(!err) {
                res.send('Article is successfully saved')
            } else{
                res.send(err)
            }
        });
    })
.delete((req, res) => {
            Article.deleteMany( (err) => {
                if(!err) {
                    res.send("Successfully deleted all articles")
                } else{
                    res.send(err)
                }
            })
        })

///// Request Targeting All Articles Ends /////

///// Request Targeting A Specific Article /////

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if(!err) {
            res.send(foundArticle)
        } else {
            res.send('No Article Like Was Find')
        }
    });
})

.put((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        
        (err) => {
            if(!err) {
                res.send("Successfully Updated article")
            } else {
                res.send(err)
            }
        }
    );
})

.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => { 
            if(!err) {
                res.send("A field is successfully patched")
            } else {
                res.send(err);
            }

        }
    );
})

.delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err) => {
            if(!err) {
                res.send("A document is successfully deleted")
            } else {
                res.send(err)
            }
        });
});





// connecting and listening to servers on port 3000

app.listen(3000, function() {
    console.log("Server Successfully started on port 3000")
})