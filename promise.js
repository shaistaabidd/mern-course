const { set } = require("mongoose");

const p = new Promise(function(resolve, reject) {
  // kick of some async operations
  setTimeout(()=>{
    // resolve(1);
    reject(new Error('Failed to execute'));
  },2000);
});

p.then(result => console.log('Result', result))
.catch(error => console.log('Error', error.message));