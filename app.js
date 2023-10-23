const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const datacollection = require("./datacollection");
//const employers = require("./employers");
//const jobseekers = require("./jobseekers");
//const applications = require('./applications');


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

app.use(express.urlencoded({extended: false})); // New

app.use("/data",datacollection(pool))
//app.use("/employers",employers(pool))
//app.use("/seekers", jobseekers(pool))
//app.use('/applications', applications(pool));



app.use("*", (req,res) => res.send({message: `Invalid end point.`}))
// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))



