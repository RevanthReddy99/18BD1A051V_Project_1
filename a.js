var express=require('express');
var app=express(); 

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;


let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');

const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';

let db
MongoClient.connect(url, (err,client)=>{
   
    db=client.db(dbName);
    console.log(`Connected database: ${url}`);
    console.log(`Database : ${dbName}`);
    
});

app.get('/hospitaldetails',middleware.checkToken,function(req,res){
   
    console.log("Fetching data from hospital collections");
    var data=db.collection('hospital').find().toArray().then(result => res.json(result));
    /*if(error){return response.send("An error occured");}
        response.send(result);*/
});

app.get('/ventilatordetails',middleware.checkToken, function(req,res){
   
    console.log("Fetching data from ventilator collections");
    var data=db.collection('ventilator').find().toArray().then(result => res.json(result));
    /*if(error){return response.send("An error occured");}
        response.send(result);*/
});

app.post('/ventilatorbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
   
    console.log("fetching data of "+status+" ventilators");
    var data=db.collection('ventilator').find({"status":status}).toArray().then(result => res.json(result));
    /*if(error){return response.send("An error occured");}
        response.send(result);*/

});

app.post('/ventilatorbyname',middleware.checkToken, function(req,res){
   
    var name=req.query.name;
    console.log("fetching data of "+name+" ventilators");
    var data=db.collection('ventilator').find({"name":name}).toArray().then(result => res.json(result));
    /*if(error){return response.send("An error occured");}
        response.send(result);*/

});

app.post('/hospital',middleware.checkToken,(req,res)=>{
   
    var name=req.query.name;
    console.log("fetching data of "+name+" hospital");
    var data=db.collection('hospital').find({"name":name}).toArray().then(result => res.json(result));
   /* if(error){return response.send("An error occured");}
        response.send(result);*/

});

app.put('/updateventilator',middleware.checkToken, function(req,res){

    var ventilatorId={ventilatorId:req.body.ventilatorId};
    console.log("updating "+ventilatorId);
    var val={$set:{status:req.body.status}};
    db.collection("ventilator").updateOne(ventilatorId,val,function(err,result){
        /*if(error){return response.send("An error occured");}
        response.send(result);*/
        res.json('1 ventilator updated');
        console.log("1 ventilator updated");
    });
});

app.put('/addventilator',middleware.checkToken, function(req,res){
    var hid=req.body.hid;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    
    var item={hid:hid,ventilatorId:ventilatorId,status:status,name:name};
    db.collection('ventilator').insertOne(item,function(err,result){
       /* if(error){return response.send("An error occured");}
        response.send(result);*/
        res.json(" ventilator added");
        console.log("ventilator "+hid+" added");
    });
});

app.delete('/deleteventilator',middleware.checkToken,function(req,res){
    var todel={ventilatorId:req.body.ventilatorId};
    db.collection('ventilator').deleteOne(todel,function(err,obj){
       /* if(error){return response.send("An error occured");}
        response.send(result);*/
        res.json("ventilator successfully deleted");
        console.log("ventilator successfully deleted");

    });
});



app.listen(3000);