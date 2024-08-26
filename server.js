const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static('views/partials'));
mongoose.connect('mongodb://localhost:27017/blog');

const paragraph_home = "Home ipsum dolor, sit amet consectetur adipisicing elit. Perferendis facilis molestiae atque nesciunt. Odit minima natus consectetur a id nostrum ipsam voluptatem sunt corporis, vero ad hic ullam optio officiis illum dicta distinctio repudiandae similique illo dolore accusantium deserunt veritatis soluta? Animi, sint. Pariatur ut iusto nemo quasi beatae quidem, rerum nostrum veritatis sequi porro libero corporis iure nulla sapiente inventore nam necessitatibus. Itaque consequatur molestiae tempore vitae? Recusandae similique temporibus error maxime cumque rem inventore assumenda mollitia soluta culpa commodi quas ea nisi optio doloremque nulla iure quidem pariatur veritatis, excepturi tempore. Expedita, quas illo perferendis voluptas eius quo.";
const paragraph_contact = "Contact ipsum dolor, sit amet consectetur adipisicing elit. Perferendis facilis molestiae atque nesciunt. Odit minima natus consectetur a id nostrum ipsam voluptatem sunt corporis, vero ad hic ullam optio officiis illum dicta distinctio repudiandae similique illo dolore accusantium deserunt veritatis soluta? Animi, sint. Pariatur ut iusto nemo quasi beatae quidem, rerum nostrum veritatis sequi porro libero corporis iure nulla sapiente inventore nam necessitatibus. Itaque consequatur molestiae tempore vitae? Recusandae similique temporibus error maxime cumque rem inventore assumenda mollitia soluta culpa commodi quas ea nisi optio doloremque nulla iure quidem pariatur veritatis, excepturi tempore. Expedita, quas illo perferendis voluptas eius quo.";
const paragraph_about = "About ipsum dolor, sit amet consectetur adipisicing elit. Perferendis facilis molestiae atque nesciunt. Odit minima natus consectetur a id nostrum ipsam voluptatem sunt corporis, vero ad hic ullam optio officiis illum dicta distinctio repudiandae similique illo dolore accusantium deserunt veritatis soluta? Animi, sint. Pariatur ut iusto nemo quasi beatae quidem, rerum nostrum veritatis sequi porro libero corporis iure nulla sapiente inventore nam necessitatibus. Itaque consequatur molestiae tempore vitae? Recusandae similique temporibus error maxime cumque rem inventore assumenda mollitia soluta culpa commodi quas ea nisi optio doloremque nulla iure quidem pariatur veritatis, excepturi tempore. Expedita, quas illo perferendis voluptas eius quo.";

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,"Your Bold must have a name"]
    },
    content:{
        type:String,
        required:[true,"content can't be empty"]
    }
});
const Blog = new mongoose.model('Blog', blogSchema);



app.get('/', async (req,res)=>{
    try{
        const posts = await Blog.find();
        res.render('home',{Title: 'Home',page: 'Home', paragraph: paragraph_home, blogd: posts});    

    }catch(err){
        console.log(err);
    }
});

app.get('/contactus',(req,res)=>{
    res.render('contact',{Title: 'Contact Us',page: 'Contact Us',paragraph: paragraph_contact})
})

app.get('/aboutus',(req,res)=>{
    res.render('about',{Title: 'About Us', page: 'About Us', paragraph: paragraph_about})
})

app.get('/compose',(req,res)=>{
    res.render('compose',{Title: 'Compose', page: 'Compose'})
});

app.post('/compose',async (req,res)=>{

    if(_.isEmpty(req.body.blogTitle)){
        res.status(404).send("<h1>Blog Title can't be Empty. Try Again </h1>");
    }else if(_.isEmpty(req.body.blogPost)){
        res.status(404).send("<h1>Blog must have some Content. Try Again</h1>");
    }else{

    try{
        const data = new Blog({
            title: req.body.blogTitle,
            content: req.body.blogPost
        });
        await data.save();
        console.log("You Blog is created");

    }catch(err){
        console.log(err);
    }
    res.redirect('/');
}
});

app.get('/post/:topic', async(req, res) => {
    let topic = _.lowerCase(req.params.topic);

    let Title = req.params.topic;


    const findPosts = await Blog.find({title: Title});

    if(findPosts.length > 0){
        findPosts.forEach(ele =>{
            res.render('post',{Title: topic, page: ele.title, paragraph: ele.content});            
        })

    }else{
        res.status(404).send("<h1>No Posts Found.</h1> <br> <p> Redirect in 3 seconds </p>");
    }

});


app.listen(process.env.PORT || 3000,()=>{
    console.log('Server Started with the port no 3000');
    
})