const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  //BEFORE ENGINE:
  //   res.sendFile(path.join(__dirname, 'views', 'about.html'));
  res.render('add', {
    title: 'Add Course',
    isAdd: true,
  });
});

router.post('/', (req, res) => {
  console.log(req.body);

  res.redirect('/courses');
});

module.exports = router;
