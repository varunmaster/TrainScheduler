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

    if (moment().isBefore(firstTrainTime)) {
        console.log("WE ARE HERE");
        // var newRow = $("<tr>").append(
        //     $("<td>").text(trainName),
        //     $("<td>").text(destination),
        //     $("<td>").text(freq),
        //     $("<td>").text(firstTrainTimeConverted.format("HH:mm A")), //if first arrival is in future, then set the next arrival time to that time
        //     $("<td>").text(moment().diff(firstTrainTime, "minutes"))
        // );
        // $("#train-table > tbody").append(newRow);
    } //if same time
    else {
        //use moment.js here
        var tFrequency = freq;
        var firstTime = firstTrainTime;
        var firstTimeConverted = moment(firstTime, "HH:mm");
        // console.log("first time conv: ", moment(firstTime, "HH:mm"))

        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(firstTimeConverted, "minutes");
        // console.log("diffTime")

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

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
