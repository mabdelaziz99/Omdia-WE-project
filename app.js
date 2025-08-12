const express = require ('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const {campgroundSchema} = require('./validationSchemas')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Presentation = require('./models/presentation')
const Article = require('./models/article')

mongoose.connect('mongodb://localhost:27017/omdia',{
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})


const app = express ()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/imgs', express.static('imgs'));



const validateCampground = (req,res,next) => {
    // Server-side (Joi) validation that works alonside the client-side validation
    const result = campgroundSchema.validate(req.body)
    const {error} = result
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)    
    }else{
            next()
        }
}

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/presentations', catchAsync(async (req,res) =>{
    const presentations = await Presentation.find({})
    res.render('presentations/index', {presentations})
}))

app.get('/articles', async (req, res) => {
    const { domains = [], tags = [], page = 1, search = '' } = req.query;

    // Normalize arrays
    const domainArray = Array.isArray(domains) ? domains : [domains].filter(Boolean);
    const tagsArray = Array.isArray(tags) ? tags : [tags].filter(Boolean);

    const filter = {};

    if (domainArray.length > 0) filter.domains = { $in: domainArray };
    if (tagsArray.length > 0) filter.tags = { $in: tagsArray };
    if (search) {
  const wordBoundaryRegex = new RegExp(`\\b${search}\\b`, 'i');
  filter.$or = [
    { title: wordBoundaryRegex },
    { p1: wordBoundaryRegex },
    { p2: wordBoundaryRegex }, // add more if needed
    { p3: wordBoundaryRegex }
    ];
    }

    // Tags checkbox filter
    if (tags && tags.length > 0) {
    filter.tags = { $in: tagsArray };
    }

    // Domains checkbox filter
    if (domains && domains.length > 0) {
    filter.domains = { $in: domainArray };
    }
    const limit = 9;
    const skip = (page - 1) * limit;

    const articles = await Article.find(filter).skip(skip).limit(limit);
    const totalArticles = await Article.countDocuments(filter);
    const totalPages = Math.ceil(totalArticles / limit);

    const allTags = ['RAN', 'vRAN', 'OpenRAN','AI-RAN', 'AI', '5G', '6G','Automation', 'Market Share', 'Cloud', 'Customer Experience', 'Digital Transformation', 'Fiber', 'cRAN','Microwave', 'Energy Efficiency', 'Recycling & Reuse', 'Green Energy', 'Digital Inclusion', 'Conservation', 'Green Bonds', 'Carbon Credits'];
    const allDomains = ['Wireless Access', 'Fixed Access', 'Transmission', 'Core', 'Sustainability'];

    res.render('articles/index', {
        articles,
        currentPage: parseInt(page),
        totalPages,
        selectedTags: tagsArray,
        selectedDomains: domainArray,
        allTags,
        allDomains,
        query: req.query,
        search
    });
});



app.get('/articles/new', catchAsync(async (req,res) =>{
    res.render('articles/new')
}))

app.get('/articles/:id', catchAsync(async (req,res,next) =>{
        const {id} = req.params
        const article = await Article.findById(id)
        const presentation = await Presentation.findOne({month:`${article.month}`})
        res.render('articles/show', {article, presentation})
}))


app.get('/presentations/new', catchAsync(async (req,res) =>{
    res.render('presentations/new')
}))

app.post('/presentations', validateCampground, catchAsync(async(req,res,next) =>{
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/presentations/${newCampground._id}`)
}))

app.get('/presentations/:id', catchAsync(async (req,res,next) =>{
        const {id} = req.params
        const presentation = await Presentation.findById(id)
        const articles = await Article.find({month:`${presentation.month}`})
        res.render('presentations/show', {presentation, articles})
}))

//Change the p.code in line 74 to a dynamic ejs page in the future when
//you replace static htmls with the ejs pages like the yelp project was
// app.get('/presentations/:code', catchAsync(async (req,res,next) =>{
//     const {code} = req.params
//     const p = await Presentation.findOne({code:`${code}`})
//     const articles = await Article.find({code: `${code}`})
//     console.log(articles)
//     res.render(`presentations/${p.code}`, {p, articles})
// }))

app.get('/presentations/:id/edit', catchAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('presentations/edit', {campground})
}))

app.put('/presentations/:id', validateCampground, catchAsync(async(req,res) =>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/presentations/${campground._id}`)
}))

app.delete('/presentations/:id', catchAsync(async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/presentations')
}))

app.all(/(.*)/, (req,res,next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req,res,next) => {
    const {statusCode = 500} = err
    if(!err.message) err.message = "Oh No! Something Went Wrong"
    res.status(statusCode).render('Error', {err})
    res.send()
})

app.listen(3000, ()=>{
    console.log("Listening on Port 3000")
})