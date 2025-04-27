const express = require("express");

// Mongodb se pahle ka scene hai ye niche wala
//const users = require("./MOCK_DATA.json");
const { status } = require("express/lib/response");
const fs = require('fs')
const mongoose = require('mongoose');


const app = express();
const PORT = 8000; 


//connection of db (()ke bich ka humne terminal se liya hai mongosh kr ke,/ ke baad jo youtube-app-1 hai wo humne apne se liya hai name)
mongoose.connect('mongodb://127.0.0.1:27017/youtube-app-1')
.then(()=>console.log("mongoDb connected"))
.catch((err) => console.log("Mongo Error", err))

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    jobTitle:{
        type:String,
    },
    Gender:{
        type: String,
        required: true
    }
},
{timestamps: true} // ye lagana optional hai(ye batayega created at and updated at (recommonded hai - good practice))
)

const User = mongoose.model("user", userSchema)


//Middleware - plugin
app.use(express.urlencoded({ extended: false}))

app.use((req, res, next)=>{
    console.log("Hello from middleware 1")
    next()
})

//routes
app.get("/api/users", async(req, res) =>{
    const allDbUsers = await User.find({})
    //headers 
    res.setHeader("X-myNmae","Piyush Garg") // this line of code is for just in case you want to add headers otherwise dont add
    //Always add X to custum headers(good practice) 

    return res.json(allDbUsers );
})
 //async was added after mongo
app.get("/users", async(req, res) => {
    //line just below was added after mongo
    const allDbUsers = await User.find({})
    
    const HTML = `
    <ul>
    
    ${allDbUsers.map((user)=>`<li>${user.firstName}- ${user.email}</li>`)}
    
    </ul>
    `
    res.send(HTML)
})

app.route("/api/users/:id").get( async(req, res)=>{
   
    const user = await User.findById(req.params.id);
    return res.json(user);
} ).patch(async(req, res) =>{
    //edit user with id
    await User.findByIdAndUpdate(req.params.id, {lastName : "changed"})
   return  res.json({status: 'success'})
}).delete(async(req, res)=>{
    // delete user with id

    await User.findByIdAndDelete(req.params.id)
    return  res.json({status: 'pending'})
})

//async was there after mongoose

app.post('/api/users', async(req, res) => {
    const body = req.body;
    console.log("Body", body)

    // adding status 400(bad request condition)
    if(!body.first_name || !body.last_name){
        return res.status(400).json({msg: "All fields are required"})
    }
    
  const result =   await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        Gender: body.gender,
        jobTitle: body.job_title
    })
    console.log("result", result);
    return res.status(201).json({msg: "success"})
    //below code was before mongoose
   /* users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err, data )=>{

        


       // return res.json({status:"success", id: users.length})

       // for status (nhi to upar wale se bhi kaam chal jaayega)
        return res.status(201).json({status:"success", id: users.length})
    })*/

})


//or the whole thing can be done as shown above 

/*
app.post('/api/users', (req, res) => {
    return res.json({status: "pending"})
})

app.patch('/api/users/:id', (req, res) => {
    // TODO: Edit the user with id
    return res.json({status: "pending"})
})


app.delete('/api/users/:id', (req, res) => {
    // todo : delete the user with id
    return res.json({status: "pending"})
})
*/

app.listen(PORT, ()=> console.log(`SERVER STARTED AT PORT`))