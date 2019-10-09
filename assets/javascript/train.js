var config = {
    apiKey: "AIzaSyC0tYE-jY5stVDzIJFU5DJqjPYj2cejeqs",
    authDomain: "train-tracker-15cc1.firebaseapp.com",
    databaseURL: "https://train-tracker-15cc1.firebaseio.com",
    projectId: "train-tracker-15cc1"
};

firebase.initializeApp(config);
var database = firebase.database();

//put the code for getting the values from the user form and put the name, dest, freq, away, next arrival, etc. here and dump it to fire


var trains = database.ref("/trains");

database.ref("/trains").on("value", function (snapshot) { //this function is called whenever there is a CHANGE in the VALUE. theoretically, it can be called a million times at a given moment

    // console.log(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

database.ref("/trains").on("child_added", function (childSnapshot) {
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().dest;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var freq = childSnapshot.val().freq;
    var firstTrainTimeConverted = moment(firstTrainTime,"LT");
    
    // console.log("user time: ", firstTrainTimeConverted);
    // console.log("converted formatted: ", firstTrainTimeConverted.format("HH:mm A"));

    if (firstTrainTimeConverted.diff(moment(),"minutes") > 0) { //if train is scheduled to come in the future
        // console.log("WE ARE HERE");
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(freq),
            $("<td>").text(firstTrainTimeConverted.format("MM/DD/YYYY hh:mm A")), 
            $("<td>").text(firstTrainTimeConverted.diff(moment(),"minutes"))
        );
        $("#train-table > tbody").append(newRow);
    } //if same time
    else {
        var tFrequency = freq;
        var firstTime = firstTrainTime;
    
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);
    
        // Current Time
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);
    
        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        // console.log(tRemainder);
    
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("MM/DD/YYYY hh:mm A"));

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(freq),
            $("<td>").text(moment(nextTrain).format("MM/DD/YYYY hh:mm A")),
            $("<td>").text(tMinutesTillTrain)
        );
        $("#train-table > tbody").append(newRow);
    }
});

//submit click comes here 
$("#user-submit").on("click", function (e) {
    e.preventDefault();

    trainName = $("#train-name").val().trim();
    dest = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    freq = $("#freq").val().trim();

    var trainObj = {
        name: trainName,
        dest: dest,
        firstTrainTime: firstTrainTime,
        freq: freq
    };

    trains.push(trainObj);

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#freq").val("");

});
