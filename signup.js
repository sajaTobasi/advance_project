const { Router } = require('express');

const signup = (pool) => {
const router = Router();
router.post('/', (req, res) => {
    const { Username , Email, Location ,Interests,ContributionPoints,SustainabilityScoreID,passward} = req.body;
    const query = 'INSERT INTO userprofiles (Username , Email, Location,Interests,ContributionPoints,SustainabilityScoreID,passward) VALUES (?,?,?,?,?,?,?)';
    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [Username, Email, Location,Interests,ContributionPoints,SustainabilityScoreID,passward], (err, result) => {
        connection.release();

        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        res.send(`Application with ID: ${result.insertId} has been submitted.`);
    });
    });
});
return router;
};

module.exports = signup;
