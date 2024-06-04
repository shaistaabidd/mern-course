const express = require('express');
const router = express.Router();

const courses = [
  {id: 1, name: "Course 1"},
  {id: 2, name: "Course 2"},
  {id: 3, name: "Course 3"}
];

router.get('/', (req, res) => {
  res.send(courses);
});


router.post('/', (req, res) => {
  res.send(req.body);
});


// router.get('/', (req, res) => {
//   const { error } = validateCourse(req.body);
//   console.log(error);
//   if (error) return res.status(400).send(error.details[0].message);  
//   const course = {
//     id: courses.length + 1,
//     name: req.body.name
//   }
//   courses.push(course);
//   res.send(course);
// });


router.delete('/:id', (req, res) => {
  const course = courses.find(c=> c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found');
  
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});


router.put('/:id', (req, res) => {
  const course = courses.find(c=> c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found');
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  course.name = req.body.name;
  res.send(course);
});

// router.put('/:id', (req, res) => {
//   const course = courses.find(c=> c.id === parseInt(req.params.id));
//   if (!course) res.status(404).send('Course not found');
//   res.send(course);
// });


router.get('/:course_id/:id', (req, res) => {
  res.send(req.query); // for sort like query in param -> http://localhost:5000//1/2?sort=3
});


function validateCourse(course){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}

module.exports = router;