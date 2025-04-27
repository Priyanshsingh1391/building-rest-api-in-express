const express = require("express");
const users = require("./MOCK_DATA.json");
const { status } = require("express/lib/response");
const fs = require('fs')
const app = express();
const PORT = 8000; 


//Middleware - plugin
app.use(express.urlencoded({ extended: false}))

app.use((req, res, next)=>{
    console.log("Hello from middleware 1")
    next()
})

//routes
app.get("/api/users", (req, res) =>{
    //headers 
    res.setHeader("X-myNmae","Piyush Garg") // this line of code is for just in case you want to add headers otherwise dont add
    //Always add X to custum headers(good practice) 

    return res.json(users);
})

app.get("/users", (req, res) => {
    const HTML = `
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`)}
    </ul>
    `
    res.send(HTML)
})

app.route("/api/users/:id").get( (req, res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
} ).patch((req, res) =>{
    //edit user with id
   return  res.json({status: 'pending'})
}).delete((req, res)=>{
    // delete user with id
    return  res.json({status: 'pending'})
})



app.post('/api/users', (req, res) => {
    const body = req.body;
    console.log("Body", body)
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err, data )=>{

        // adding status 400(bad request condition)
        if(!body.first_name || !body.last_name){
            return res.status(400).json({msg: "All fields are required"})
        }


       /* return res.json({status:"success", id: users.length})*/

       // for status (nhi to upar wale se bhi kaam chal jaayega)
        return res.status(201).json({status:"success", id: users.length})
    })

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