const express = require('express'); //connect express
const path = require('path');
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const User = require('./models/user');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const app = express(); //our application

//Handlebars setup
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine); //registering the engine
app.set('view engine', 'hbs'); //setting up the engine
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('608c5144c8d18f201424ba48');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public'))); //add static folder for css files
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url =
      'mongodb+srv://hulchenko:Qfq7Z6lPeT0knZmg@cluster0.27fbk.mongodb.net/shop';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'hulchenko@shaw.ca',
        name: 'Vadym',
        cart: { items: [] },
      });
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
