const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
  //BEFORE ENGINE:
  //   res.sendFile(path.join(__dirname, 'views', 'about.html'));
  res.render('add', {
    title: 'Add Course',
    isAdd: true,
  });
});

router.post('/', async (req, res) => {
  const course = new Course(req.body.title, req.body.price, req.body.img);

  await course.save();

  res.redirect('/courses');
});

module.exports = router;
