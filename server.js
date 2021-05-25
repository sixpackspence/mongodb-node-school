const express = require('express');
const articleRouter = require('./routes/articles');//requiring article routes
const mongoose = require('mongoose');
const Article = require('./models/article');//calls the article model
const methodOverride = require('method-override');

mongoose.connect('mongodb+srv://sixpackspence:Warning94@cluster0.xyl7s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

app = express();

app.set('view engine', 'ejs');  //this sets what we want to use as our view engine

app.use(express.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.get('/', async (req, res)  => {
  const articles = await Article.find().sort({createdAt: 'desc'})
  res.render('articles/index', {articles: articles})  
  //this is to access the views we want to use in this case its articles/index.ejs
});

app.use('/articles', articleRouter);

app.listen(5000);