var express = require("express")
var bodyParser = require("body-parser")
const mongoose=require("mongoose")
const axios = require('axios');
var path=require("path")
const app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
 const db= mongoose.createConnection("mongodb+srv://soum_db:atlas_123@cluster1.knv1aqa.mongodb.net/Online_Exam_registration");
 const db1= mongoose.createConnection("mongodb+srv://soum_db:atlas_123@cluster1.knv1aqa.mongodb.net/Questions");
db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Online Database"))
db1.on('error',()=>console.log("Error in Connecting to Database"));
db1.once('open',()=>console.log("Connected toQuestion Database"))
app.post("/posttest",async(req,res)=>
  {
   var data={
    "TestName":req.body.TestName,
    "StartingTime":req.body.StartingTime,
    "EndingTime":req.body.EndingTime,
    "Marks":req.body.Marks,
    "Questions":req.body.Questions
  }
  await db.collection('Tests').insertOne(data,(err)=>{
    if(err){
      throw err;
  }
  console.log("Record Inserted Successfully");
  })
})
/*student registration*/
app.post("/register",async(req,res)=>
{
  var data={
    "Username":req.body.Username,
    "PhoneNumber":req.body.PhoneNumber,
    "Address":req.body.Address,
    "Age":req.body.Age
  }
  var check= await db.collection('Student_details').findOne({"PhoneNumber":data.PhoneNumber})
  try
  {
    if(check)
    {
      res.send("You have been already registered!! \n Login to your account to access the test.");
    }
    else
    {
      await db.collection('Student_details').insertOne(data,(err)=>{
        if(err){
          throw err;
      }
      console.log("Record Inserted Successfully");
      })
      res.redirect('/Student_Registered_successfully.html');
    }
  }
  catch(err)
  {
  throw err
  }
})
/* admin registration*/
app.post("/aregister",async(req,res)=>
  {
    var data={
      "Username":req.body.Adminname,
      "PhoneNumber":req.body.Adminphone,
      "Department":req.body.department,
      "Role":req.body.Role
    }
    var check= await db.collection('Admin_details').findOne({"PhoneNumber":data.PhoneNumber})
    try
    {
      if(check)
      {
        res.send("You have been already registered!! \n Login to your account to access the test.");
      }
      else
      {
        await db.collection('Admin_details').insertOne(data,(err)=>{
          if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
        })
        res.redirect('/Admin_Registered_successfully.html');
      }
    }
    catch(err)
    {
    throw err
    }
  })
/*student registered successfully*/
app.get('/studentdata',async (req,res)=>{
  try
  {
    const col= db.collection('Student_details')
    const total = await col.countDocuments();
    const documents = await col.find({}).toArray();
    const docid = documents[total - 1].PhoneNumber;
  //console.log(docid)
  res.json({message:docid,value:'Test_123'})
  }
 catch(error)
 {
  res.status(500).json({error: error.message});
 }
})
/*Admin registered successfully*/
app.get('/admindata',async (req,res)=>{
  try
  {
    const col= db.collection('Admin_details')
    const total = await col.countDocuments();
    const documents = await col.find({}).toArray();
    const docid = documents[total - 1].PhoneNumber;
  //console.log(docid)
  res.json({message:docid,value:`Admin_123`})
  }
 catch(error)
 {
  res.status(500).json({error: error.message});
 }
})
/*student login*/
app.post('/Login', async (req, res) => {
  try {
    const username = req.body.Loginid;
    const pass = req.body.Pass;
    const logdata = {
      "Userid": username,
      "Password": pass
    };

    if (logdata.Password === "Test_123") {
      await db.collection('Login_details').insertOne(logdata);
      console.log("Record inserted successfully");
      res.redirect('/TestList.html');
    } else {
      res.send("Login session failed!! Check whether the password you have entered is invalid or not");
    }
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/getLogin',async(req,res)=>{
  const col= db.collection('Login_details')
  const total = await col.countDocuments();
  const documents = await col.find({}).toArray();
  const docid = documents[total-1];
  res.json(docid)
})
/*Admin login*/
app.post('/ALogin', async (req, res) => {
  try {
    const username = req.body.Adminid;
    const pass = req.body.AdPass;
    const logdata = {
      "Adminid": username,
      "Password": pass
    };
     
    if (logdata.Password === "Admin_123") {
      await db.collection('AdminLogin_details').insertOne(logdata);
      console.log("Record inserted successfully");
      res.redirect('/Admin_management_system.html');
    } else {
      res.send("Login session failed!! Check whether the password you have entered is invalid or not");
    }
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).send("Internal Server Error");
  }
});
/*Math collection*/
app.get('/getdata/Maths',async (req,res)=>{
  const result=await db1.collection('Maths').find({}).sort({Index:1}).toArray()
  res.json(result)
})
/*Physics collection*/
app.get('/getdata/Physics',async(req,res)=>{
  const physics=await db1.collection('Physics').find({}).sort({Index:1}).toArray()
  res.json(physics)
})
/*Chemistrycollection*/
app.get('/getdata/Chemistry',async(req,res)=>{
  const chemistry=await db1.collection('Chemistry').find({}).sort({Index:1}).toArray()
  res.json(chemistry)
})
app.get('/gettest',async(req,res)=>{
  const col=await db.collection('Tests').find({}).toArray()
  res.json(col)
})
/*student_result collection*/
app.get('/getrank',async(req,res)=>{
  const col= await db.collection('Student_result').find({}).toArray();
  res.json(col);
})
/*user_details collection*/
app.get('/getuser',async(req,res)=>{
  const col= await db.collection('Student_details').find({}).toArray();
  res.json(col);
})
app.delete('/getuser/:number',async(req,res)=>{
  const id=req.params.number;
  await db.collection("Student_details").deleteOne({"PhoneNumber":id});
  res.json({ success: true });
})
app.post('/postresult',async(req,res)=>{
  try{
   const user= await db.collection('Ranking_details').findOne({"Username":req.body.Username});
   if(user)
   {
    console.log("Username already exists");
   }
   else
   {
  await db.collection('Ranking_details').insertOne(req.body,(err)=>{
    if(err){
      throw err;
  }
  console.log("Record Inserted Successfully");
  })
}}
catch(err)
{
  console.log(console.error())
}})
app.get('/resultform',async(req,res)=>{
  const col= await db.collection('Ranking_details').find({}).toArray();
  res.json(col);
})
app.put('/updateuser/:id',async(req,res)=>{
  var data={
    "Username":req.body.Username,
    "PhoneNumber":req.body.PhoneNumber,
    "Address":req.body.Address,
    "Age":req.body.Age,
  }
  await db.collection("Student_details").updateOne({ PhoneNumber: req.params.id},
    {
      $set: {
        Username: data.Username,
       PhoneNumber:data.PhoneNumber,
        Address: data.Address,
        Age: data.Age
      }
    })
  })
  app.put('/updatetest',async(req,res)=>{
    var data={
      "TestName":req.body.TestName,
      "StartingTime":req.body.StartingTime,
      "EndingTime":req.body.EndingTime,
      "Marks":req.body.Marks,
      "Questions":req.body.Questions
    }
    await db.collection("Tests").updateOne({ TestName: data.TestName },
      {
        $set: {
          StartingTime: data.StartingTime,
          EndingTime: data.EndingTime,
          Marks: data.Marks,
          Questions: data.Questions
        }
      })
    })
app.delete('/deletest/:id',async(req,res)=>{
   const id= req.params.id;
   await db .collection("Tests").deleteOne({"TestName":id},(err)=>{
     if(err)
     throw err;
    console.log("record deleted succesfully")
   })
   res.json({success:true})
})
app.delete('/ALogout/:id',async(req,res)=>{
  await db .collection("AdminLogin_details").deleteOne({"Adminid":req.params.id},(err)=>{
    if(err)
    throw err;
   console.log("record deleted succesfully")
  })
})
app.delete('/Logout/:id',async(req,res)=>{
 try{
  await db .collection("Login_details").deleteOne({"Userid":req.params.id});
  console.log("Record deleted sucessfully");
  res.redirect('/Main_portal.html');
}
 catch(err)
 {
  console.error("Error during login process:", error);
  res.status(500).send("Internal Server Error");
 }
  })
  //res.redirect('/Main_portal.html')
const port=8000;
app.listen((port),(req,res)=>{
 console.log(`Server is running on port ${port}`);
})
app.post("/adminstudentregister",async(req,res)=>
  {
    var data={
      "Username":req.body.Username,
      "PhoneNumber":req.body.PhoneNumber,
      "Address":req.body.Address,
      "Age":req.body.Age
    }
    var check= await db.collection('Student_details').findOne({"PhoneNumber":data.PhoneNumber})
    try
    {
      if(check)
      {
        res.send("You have been already registered!! \n Login to your account to access the test.");
      }
      else
      {
        await db.collection('Student_details').insertOne(data,(err)=>{
          if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
        })
        res.redirect('/manageusers.html');
      }
    }
    catch(err)
    {
    throw err
    }
  })
