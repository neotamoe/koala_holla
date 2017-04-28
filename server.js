//requires
var express = require ('express');
var app = express();
var bodyParser = require ('body-parser');
var path = require ('path');
var pg = require ('pg');
//uses
app.use (express.static('public'));
app.use (bodyParser.urlencoded( {extended: true }));

//set up config for pool
var config = {
  database: 'koalaholla',
  host: 'localhost',
  port: 5432,
  max: 20,
  timeOutMilliSec: 15000
}; // end config

//create new pool
var pool = new pg.Pool( config );

//globals
//test array used in testing connection between client and server
var koalaArray=[
  {
    Name: 'stan',
    Sex: 'male',
    Age: 4,
    Ready_For_Transfer: 'yes',
    Notes: 'not friendly'
  }
];

//server listening
app.listen(3050, function(){
  console.log('server up on 3050');
});

//ROUTES
//base URL
app.get ('/', function(req, res){
  console.log('base URL hit');
  res.sendFile(path.resolve('public/views/index.html'));
});//base URL end

//getKoalas route
app.get ('/getKoalas', function (req, res){
  console.log('hit get koalas');
  // array of koalas
  var allKoalas = [];
  // connect to db
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.send( 400 );
    }// end Error
    else{
      console.log('connected to db');
      // send query for all koalas in the 'koalaHut' table and hold in a variable (resultSet)
      var resultSet = connection.query( "SELECT * from koalaholla" );
      // convert each row into an object in the allKoalas array
      // on each row, push the row into allKoalas
      resultSet.on( 'row', function( row ){
        allKoalas.push( row );
      }); //end on row
      // on end of rows send array as response
      resultSet.on( 'end', function(){
        // close connection to reopen spot in pool
        done();
        // res.send array of cars
        res.send( allKoalas );
      }); //end on end
    } // end no error
  }); //end pool
}); //end koalas get

//addKoala route
app.post ('/addKoala', function (req, res){
  console.log('hit addKoala');
  var newKoala = req.body;
  console.log('received from client:', req.body);
  // connect to db
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.send( 400 );
    }// end Error
    else{
      console.log('connected to db');
      //query write this koala to db (req.body)
      connection.query( "INSERT INTO koalaholla (name, sex, age, ready_for_transfer, notes) VALUES($1,$2,$3,$4,$5 )", [req.body.name, req.body.sex, req.body.age, req.body.ready, req.body.notes]);
      // close connection to reopen spot in pool
      done();
      // res.send
      res.sendStatus(200);
    } // end else
  }); //end pool
}); //end addKoala post

app.delete ('/removeKoala', function (req, res){
  console.log('hit removeKoala');
  var removedKoala = req.body;
  console.log('hit removeKoala and received from client:', req.body);
  // connect to db
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.send( 400 );
    }// end Error
    else{
      console.log('connected to db');
      //query delete this koala from db (req.body)
      var name = req.body.name;
      connection.query( "DELETE from koalaholla where name="+req.body.koalaid);
      // close connection to reopen spot in pool
      done();
      // res.send
      res.sendStatus(200);
    } // end else
  }); //end pool
}); //end addKoala post
