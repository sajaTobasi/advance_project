const { Router } = require('express');
const userprofile = (pool) => {
const router = Router();
//////////
router.get('/search', (req, res) => {
    const { UserID, Username } = req.body;
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
////intrest
router.get('/interest', (req, res) => {
    const { Interests } = req.body;
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
        res.json("Done");
    });
    });
});
//////////////
//Username , Email, Location ,Interests,ContributionPoints
router.put('/:UserID', (req, res) => {
    const UserID = req.params.UserID;
    const { Username, Email, Location,Interests,ContributionPoints} = req.body;
    
    const query = 'UPDATE userprofiles SET Username = ?, Email = ?, Location = ? ,Interests = ?,ContributionPoints = ? WHERE UserID = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [Username, Email, Location, Interests,ContributionPoints,UserID], (err, result) => {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200);
            res.json("Done");
        });
    });
});
//change password
router.put('/pass/:UserID', (req, res) => {
    const UserID = req.params.UserID;
    const {passward} = req.body;
    
    const query = 'UPDATE userprofiles SET passward = ? WHERE UserID = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [passward,UserID], (err, result) => {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200);
            res.json("Done");
        });
    });
});

return router;
};

module.exports = userprofile;
