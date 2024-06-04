const Joi = require('joi');
const helmet = require('helmet');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('connected to MongoDB'))
.catch(err => console.log(err.message));
const courseSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 1, maxlength: 3},
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true, // Indicate that the validator is asynchronous
      validator: function(value) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const result = value && value.length > 0;
            resolve(result);
          }, 2000);
        });
      },
      message: 'A course should have at least one tag'
    }
  },
  date: {type: Date, default: Date.now},
  isPublished: Boolean,
  price: {
    type: Number, 
    required: function() {return this.isPublished; }, // () => arrow function will not work here as i have to use this here.
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'network'],
    required: true,
    lowercase: true,
    // uppercase: true,
    trim: true,
  }
});
const Course = mongoose.model('Course', courseSchema);

async function createCourse () {
  
  const course = new Course ({
    name: "aaa",
    price: 12.8,
    category: 'WEB    ',
    author: "Hamna Zahid",
    tags: ['first'],
    isPublished: true
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (err) {
    for (field in err.errors){
      console.log(err.errors[field].message);
    }
  }
}

async function getCourses () {
  // const courses = await Course.find({author: 'Shaista', isPublished: true, price: {$gte: 2, $lte: 3}}).limit(2).sort({name: -1}).select({name:1, tags: 1}); // -1 sort documents in descending order, 1 for ascending order
  // const courses = await Course.find().or({author: "Shaista"},{isPublished: true}).and({author: 'Shaista', isPublished: true});
  // author name starts with 'Shaista'
  // const courses = await Course.find({author: /^Shaista/}).or({author: "Shaista"},{isPublished: true}).and({author: 'Shaista', isPublished: true});
  // author name ends with 'Abid'
  // const courses = await Course.find({author: /Abid$/})
  // author contains name Shaista and show count'
  // const courses = await Course.find({author: /.*Shaista.*/}).count();
  
  // Pagination
  // const pageNumber = 2;
  // const pageSize = 10;
  // const courses = await Course.find({author: /.*Hamna Zahid.*/i}).skip((pageNumber - 1) * pageSize).limit(pageSize).select('author isPublished price');
  // console.log(courses);

  const courses = await Course.findById('664a182d608661a6323b3916')
  console.log(courses.price);
  console.log(courses);
}

async function updateCourse (id) {
  // const course = await Course.findById(id); // update course by id
  // if (!course) return;
  // course.set({
  //   isPublished: false,
  //   author: "Kanwal"
  // })
  // const result = await course.save();
  // console.log(result);


  // const result = await Course.updateOne({_id: id }, { // updateMany is used in case if filter is applied for isPublished because it will fetch many records to update but here id will fetch only one record that's why updateOne is used here
  //   $set: {
  //     isPublished: false,
  //     author: "Kanwal"
  //   }
  // }); // update course directly by query like {isPublished: false } or {_id: id } to find by id or where isPublished false and in second argument we add fields to update
  // console.log(result);

  
  const result = await Course.findByIdAndUpdate(id, { // find by id and update at same time
    $set: {
      isPublished: true,
      author: "Kanwal2"
    }
  }, {new: true}); // return updated object
  console.log(result);
}


async function removeCourse (id) {
  const result = await Course.deleteOne({_id: id}); // we can also use deleteMany to delete in bulk, it will delete all those objects written in id filter
  console.log(result);
}

// removeCourse ('6649f01b0ffa021f96f63456');
// updateCourse ('6649de88f606b5e35af1d639');
// createCourse();
getCourses();


const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const morgan = require('morgan');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const genres = require('./routes/genres');
const home = require('./routes/home');
const express = require('express');
const config = require('config');
const { result } = require('underscore');
const { func } = require('joi');

const app = express();

app.use(express.json()); // middleware function
app.use(express.urlencoded({extended: true})); // middleware function
app.use(express.static('public')); // middleware function
app.use(helmet()); // middleware function
app.use(logger); // middleware function created in logger and used here
app.set('view engine', 'pug');
app.set('views', './views');
app.use('/api/courses', courses); 
app.use('/api/genres', genres); 
app.use('/', home); 


console.log(`Node Env: ${process.env.NODE_ENV}`);
console.log(`APP: ${app.get('env')}`);
console.log('Application name: ' + config.get('name'));
console.log('Mail sever name: ' + config.get('mail.host'));

console.log('After...');
// console.log('Password: ' + config.get('mail.password'));


// callabcks
getUser(1, (user) =>{
  console.log('User', user);
  getRepositories(user.gitHubUsername, (repos) =>{
    // console.log('Repo', repos);
    getCommits(repos, displayCommits);
  });
});

getUser(1, fetchRepositories);

function fetchRepositories(user) {
  getRepositories(user.gitHubUsername, fetchCommits)
}

function fetchCommits(repos){
  getCommits(repos[0], displayCommits);
}

function displayCommits(commits){
  console.log('Commits', commits);
}

function getUser(id, callback) {
  setTimeout(() => {
    console.log('Reading user from database...');
    callback({id: id, gitHubUsername: "shaistaabidd"})
  }, 3000);
}

function getRepositories(username, callback) {
  setTimeout(() => {
    console.log('Calling Repo...');
    callback(['repo1', 'repo2', 'repo3']);
  }, 3000);
}

function getCommits(repo, callback) {
  setTimeout(() => {
    console.log('Calling Commits...');
    callback(['commit1', 'commit2', 'commit3']);
  }, 3000);
}


// callbacks end

// Promises Start
getGithub(1)
.then(result => getCar(result.gitHubUsername))
.then(result => console.log('Car',result))
.catch(err => console.log('Error',err.message)); 


function getGithub(id) {
  return new Promise((resolve, reject) =>{
    setTimeout(() => {
      console.log('Reading Github promise...');
      resolve({id: id, gitHubUsername: "shaistaabidd"})
    }, 3000);
  })
}

function getCar(username) {
  return new Promise((resolve, reject) =>{
    setTimeout(() => {
      console.log('Reading Car promise...');
      // resolve(['car1', 'car2', 'car3'])
      reject(new Error('error async occured'));
    }, 3000);
  })
}

// Promises End

// Async and Await

async function displayCars(){
  try {
  const github = await getGithub(1);
  const car = await getCar(github.gitHubUsername);
  console.log('Async and Await');
  console.log(car);
  } catch (error) {
    console.log(error.message);
  }
}
displayCars();

// End of Async and Await

if (app.get('env') == 'development') {
  app.use(morgan('tiny')); // middleware function
  startupDebugger(`Morgan is enabled`);
}

// database debugger
dbDebugger('Connected to database');

app.use(function(req, res, next) {  // middleware function
  console.log('Authenticating...');
  next();
});



const port = process.env.PORT || 3000;


app.listen(port, () => {console.log(`listening on port ${port}`)});