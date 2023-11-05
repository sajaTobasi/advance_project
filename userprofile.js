const { Router } = require('express');
const userprofile = (pool) => {
const router = Router();
//////////
router.get('/search', (req, res) => {
    const { UserID, Username } = req.query;
    const query = `
        SELECT *
        FROM userprofiles
        WHERE UserID LIKE ? AND Username LIKE ?`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [`%${UserID}%`, `%${Username}%`], (err, rows) => {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.json(rows);
        });
    });
});
////insert
router.get('/interest', (req, res) => {
    const { Interests } = req.query;
    const query = `
        SELECT *
        FROM userprofiles
        WHERE Interests LIKE ? `;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [`%${Interests}%`], (err, rows) => {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.json(rows);
        });
    });
});
//////////
router.get('/', (req, res) => {
    const query = 'SELECT * FROM userprofiles';

    pool.getConnection((err, connection) => {
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        connection.query(query, [], (err, result) => {
        connection.release();

        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(result);
        });
    });
    });
//////////////
router.get('/:userID', (req, res) => {
    const userID = req.params.userID;
    const query = 'SELECT * FROM userprofiles WHERE userID = ?';

    pool.getConnection((err, connection) => {
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        connection.query(query, [userID], (err, result) => {
        connection.release();

        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(result);
        });
    });
    });
//////////////////////////
router.post('/', (req, res) => {
    const { Username , Email, Location ,Interests,ContributionPoints,SustainabilityScoreID} = req.body;
    const query = 'INSERT INTO userprofiles (Username , Email, Location,Interests,ContributionPoints,SustainabilityScoreID) VALUES (?, ?, ?,? ,? , ?)';
    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [Username, Email, Location,Interests,ContributionPoints,SustainabilityScoreID], (err, result) => {
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
/////////////////
router.delete('/:UserID', (req, res) => {
    const UserID = req.params.UserID;
    const query = 'DELETE FROM userprofiles WHERE UserID = ?';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }

    connection.query(query, [UserID], (err, result) => {
        connection.release();

        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        res.status(200);
        res.json(result);
    });
    });
});
//////////////
//Username , Email, Location ,Interests,ContributionPoints,SustainabilityScoreID
router.put('/:UserID', (req, res) => {
    const UserID = req.params.UserID;
    const { Username, Email, Location,Interests,ContributionPoints,SustainabilityScoreID} = req.body;
    
    const query = 'UPDATE userprofiles SET Username = ?, Email = ?, Location = ? ,Interests = ?,ContributionPoints = ?,SustainabilityScoreID = ? WHERE UserID = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [Username, Email, Location, Interests,ContributionPoints,SustainabilityScoreID,UserID], (err, result) => {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200);
            res.json(result);
        });
    });
});

return router;
};

module.exports = userprofile;
