const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) =>{
    res.send('Registered!!')
})
app.get('/register', (req, res) =>{
    //username logic from a form (req.body)
    //password logic from a form (req.body)
    res.render('register');
})

app.post('/register', async (req, res) =>{
    //username logic from a form (req.body)
    //password logic from a form (req.body)
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await new User({
        username: username,
        password: hashedPassword
    })
    await newUser.save();
    console.log(newUser);
    res.redirect('/');
})

app.get('/login', (req, res) =>{

    res.render('login');
})
app.post('/login', async (req, res) =>{
    const {username, password} = req.body;
    //const user = req.body;
    //res.send(user);
    //find user by ussername inndatabase
    //if found, do the password compare to see if the password matches
    //then log in the user successfully
    const user = await User.findOne({username: username});
    if (!user){
        res.send('Invalid username or password')
    }
    else{
        const validUser = await bcrypt.compare(password, user.password);
        if (validUser){
            console.log('Welcome!!!')
            res.send('Welcome!!!')
        }
        else{
            res.send('Invalid username or password')
        }
    }
    //console.log(user.password);
    
})
app.get('/secret', (req, res) =>{
    res.send('it works!!');
})


app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})

