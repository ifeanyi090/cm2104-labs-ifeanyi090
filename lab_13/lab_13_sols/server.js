//code to link to mongo module
const MongoClient = require('mongodb-legacy').MongoClient;
//const url = "mongodb://localhost:27017/star_wars_quotes";

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'star_wars_quotes';

//code to link to the express module
const express = require('express');
const app = express();

//code to define the public 
app.use(express.static('public'))
//allows us to read a post request
app.use(express.urlencoded({
    extended: true
}))
//our variable for our database
var db;

//run the connect method.
connectDB();

async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    //everything is good lets start
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}

//route to show all quotes
app.get('/all', function (req, res) {
    //get all the quotes from the database and turn ont oan array
    db.collection('quotes').find().toArray(function (err, result) {
        //if there is an error
        if (err) throw err;
        //if no error
        //all this does is format the output
        var output = "<h1>All the quotes</h1>";

        for (var i = 0; i < result.length; i++) {
            output += "<div>"
            output += "<h3>" + result[i].name + "</h3>"
            output += "<p>" + result[i].quote + "</p>"
            output += "</div>"
        }
        res.send(output);
    });
});

//add route
app.post('/quotes', function (req, res) {
    console.log(req.body);
    //actually addds the data
    db.collection('quotes').save(req.body, function (err, result) {
        //if an error stop
        if (err) throw err;
        //if not
        console.log('saved to database')
        //redirect me to index
        res.redirect('/')
    })
})

//search route
app.post('/search', function (req, res) {
    //get the value we want from the request 
    //(i.e the name (in this case "name" of the form item that has the data we want)

    var searchname = req.body.name;
//do the search on the DB with the value in JSON
    db.collection('quotes').find({name: searchname}).toArray(function (err, result) {
        //run through the response and format it (you coudl just retun json if you want)
        if (err) throw err;
        var output = "<h1>All the quotes</h1>";
        for (var i = 0; i < result.length; i++) {
            output += "<div>"
            output += "<h3>" + result[i].name + "</h3>"
            output += "<p>" + result[i].quote + "</p>"
            output += "</div>"
        }
        res.send(output);
    });
});