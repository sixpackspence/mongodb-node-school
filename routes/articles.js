express = require('express');
Article = require('./../models/article')
const router = express.Router(); //gives us a router we can use to creates different routes

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })//this will render articles/new.ejs
  //everything in this will be based on the /articles route in server.js so added to the end of /articles
}); //which is why we only need a / here.  if we put /page the path would be /articles/page not just /page

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
});

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
});

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveRedirectArticle('new'));

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveRedirectArticle('edit'));


router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  //delete router
  res.redirect('/');
})

function saveRedirectArticle(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }//this will make sure all the fields passed in previously will be refilled
  }
}

module.exports = router;