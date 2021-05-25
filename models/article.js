const mongoose = require('mongoose');
const slugify = require('slugify');//used to change the id in the url to something different
const marked = require('marked');//used to turn markdown into html

const createDomPurifiy = require('dompurify');
const { JSDOM } = require('jsdom');//these 3 help prevent malicious attacks
const dompurify = createDomPurifiy(new JSDOM().window);

const articleSchema = new mongoose.Schema({//creates a schema
  title: {
    type: String,
    required: true
  }, 
  description: {
    type: String 
  },
  markdown: {
    type: String,
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now //this is gonna set the createdAt date to the current date
  },
  slug: {
    type:String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }

})

articleSchema.pre('validate', function(next) { //this will run anytime we do something to our article
 if(this.title){
   this.slug = slugify(this.title, {lower: true, strict: true})
 }
 if (this.markdown){
   this.sanitizedHtml = dompurify.sanitize(marked(this.markdown)) 
 }

 next()
})

module.exports = mongoose.model('Article', articleSchema)
//exports our model, creates it, this names it and this passes it the schema we made
//now we have a sort of table in our DB called Article with this structure