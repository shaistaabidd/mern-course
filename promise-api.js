const { set } = require("mongoose");

// already resolved promises
const r = Promise.resolve({id: 1, name: "Shaista"});
r.then(result => console.log(result));

// already rejected promises
const re = Promise.reject(new Error("rejected"));
re.catch(error => console.log(error.message));

// running promises in parallel

p1 = new Promise((resolve, reject) =>{
  setTimeout(() =>{
    console.log("Async 1");
    resolve(1);
    // reject(new Error("Async 1 Rejected..."));
  }, 2000);

});

p2 = new Promise((resolve, reject) =>{
  setTimeout(() =>{
    console.log("Async 2..");
    // resolve(2);
    reject(new Error("Async 1 Rejected..."));
  }, 2000);

});

Promise.all([p1,p2]) // promise reject if any of p1 or p2 rejected
.then(result => console.log(result))
.catch(error => console.log(error.message));

Promise.race([p1,p2]) // promise resolve if first promise is fulfilled
.then(result => console.log(result))
.catch(error => console.log(error.message));