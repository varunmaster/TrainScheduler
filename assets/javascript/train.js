// var moment = require('moment');

var config = {
    apiKey: "AIzaSyA80R6FtX0jub45y6Do_EmN8V79l3b3tQ4",
    authDomain: "varun-bootcamp.firebaseapp.com",
    databaseURL: "https://varun-bootcamp.firebaseio.com",
    projectId: "varun-bootcamp",
    storageBucket: ""
};

firebase.initializeApp(config);
var database = firebase.database();

//put the code for getting the values from the user form and put the name, dest, freq, away, next arrival, etc. here and dump it to fire
database.ref().set({
    trainName: "Never on Time Transit"
  });

database.ref().on("value", function (snapshot) {
    console.log(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
