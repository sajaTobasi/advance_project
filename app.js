const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const datacollection = require("./datacollection");
const report = require("./report");

const educationalResourcesRouter = require("./educationalResourcesRouter");


const app = express()
const port = process.env.PORT || 5000;

//mysql

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'advance'
})
app.use(express.json()); // New

app.use(express.urlencoded({extended: false})); 

app.use("/data",datacollection(pool))

app.use("/resource", educationalResourcesRouter(pool))


app.use("*", (req,res) => res.send({message: `Invalid end point.`}))

app.listen(port, () => console.log(`Listening on port ${port}`))



