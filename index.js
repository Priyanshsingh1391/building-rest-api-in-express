const express = require("express");
const users = require("./MOCK_DATA.json");
const { status } = require("express/lib/response");
const fs = require('fs')
const app = express();
const PORT = 8000; 


//Middleware - plugin
app.use(express.urlencoded({ extended: false}))

//routes
app.get("/api/users", (req, res) =>{
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
        return res.json({status:"success", id: users.length})
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