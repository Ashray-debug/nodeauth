var mongoose =require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port=3000;
var path=require("path");
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '069d9c17',
  apiSecret: 'fExnHyuCIYeomx8E',
});

mongoose.Promise = global.Promise;
var db=mongoose.connect('mongodb+srv://admin-ashray:test123@ashray-8z4xs.mongodb.net/my_db',function (err) {
 
   if (err) throw err;
   else console.log('Successfully connected');
 
});





app.get('/',(req,res)=>{
  res.sendFile((__dirname + '/index.html'));
});





app.get('/main', (req, res) => {
 res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname)); 

var personSchema = mongoose.Schema({
   childName: String,
   age: Number,
   id:String,
   Weight:Number,
   parentName: String,
   dob:Date,
   Mobile:Number,
   Password:String,
});

var Person = mongoose.model("Person", personSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post("/addname", (req, res) => {
   var newPerson=new Person({
   childName: req.body.childName,
   age: req.body.age ,
   id:req.body.id,
   parentName: req.body.parentName,
   dob:req.body.dob,
   Weight:req.body.	Weight,
   Mobile:req.body.Mobile,
   Password:req.body.Password
 	})
   	newPerson.save(function(err, doc){
		if(err) res.json(err);
		else {res.send('Successfully inserted!');
				 res.json(Person);
    }
	});

});

//app.get('/login', function(req, res){
  // res.render('login');
//});

// app.post('/login', function(req, res){
//    if(!req.body.lname || !req.body.lpass){
//       res.render('login', {message: "Please enter both id and password"});
//    } else {
//       Person.find(function(){
//          if(Person.id === req.body.lname && Person.password === req.body.lpass){
//             req.session.Person = Person;
//             res.redirect('/protected_page');
//          }
//       });
//       res.render('login', {message: "Invalid credentials!"});
//    }
// });

app.get('/user',(req,res)=>{
    res.sendFile(path.join(__dirname + '/Calender.html'))
});

app.post('/logging', function(req, res)
{
    Person.findOne({id: req.body.lname, Password: req.body.lpass}, function(err, user){
      if(user){
              return res.redirect('/user');
            //return res.send(user);
        }
        else {
            res.send("Invalid");
        }
    });

});


app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/');
});


var contactusschema = mongoose.Schema({
   name: String,
   subject: String,
   idc:String,
   message:String
});

var contactus = mongoose.model("contactus", contactusschema);

app.post("/main", (req, res) => {
   var feedback=new contactus({
   name: req.body.name,
   subject: req.body.subject,
   idc:req.body.idc,
   message:req.body.message
  });
    feedback.save(function(err, doc){
    if(err) res.json(err);
    else  {res.send('Successfully Sent');}
  });
});


app.get('/init', function(req, res){
    db.event.insert({ 
        text:"", 
        start_date: new Date(2019,8,1),
        color: "#DD8616"
    });
    db.event.insert({ 
        text:"", 
        start_date: new Date(2019,8,3),
        color: "#DD8616"
    });

    res.send("Test events were added to the database");
});


app.get('/data', function(req, res){
    db.event.find().toArray(function(err, data){
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});


app.post('/data', function(req, res){
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.id;
    var tid = sid;
    delete data.id;
    delete data["!nativeeditor_status"];

    function update_response(err, result){
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","application/json");
        res.send({action: mode, sid: sid, tid: tid});

    }

    if (mode == "updated")
        db.event.updateById( sid, data, update_response);
    else if (mode == "inserted")
        db.event.insert(data, update_response);
    else if (mode == "deleted")
        db.event.removeById( sid, update_response);
    else
        res.send("Not supported operation");
});


app.listen(3000, function(){
 console.log("Server listening on port " + port);

});
