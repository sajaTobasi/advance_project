const { Router } = require('express');
const enviromentalart = (pool) => {
const router = Router();
// Search for alart
router.get('/search', (req, res) => {
    const { UserID, AlertID } = req.query;
    const query = `
        SELECT *
        FROM environmentalalerts
        WHERE UserID LIKE ? AND AlertID LIKE ?`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [`%${UserID}%`, `%${AlertID}%`], (err, rows) => {
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
//get all reports
router.get('/', (req, res) => {

    const query = 'SELECT * FROM environmentalalerts';

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
//get alart by AlertID
router.get('/:AlertID', (req, res) => {
    const AlertID = req.params.AlertID;
    const query = 'SELECT * FROM environmentalalerts WHERE AlertID  = ?';

    pool.getConnection((err, connection) => {
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        connection.query(query, [AlertID], (err, result) => {
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
   // Get one alart by UserID
router.get('/u/:UserID', (req, res) => {
    const UserID  = req.params.UserID ;
    const query = 'SELECT * FROM environmentalalerts WHERE UserID = ?';

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

        res.json(result);
    });
    });
});

// Insert an alart
router.post('/', (req, res) => {
    const { UserID , AlertMessage, Threshold ,Triggered_At} = req.body;
    const query = 'INSERT INTO environmentalalerts (UserID , AlertMessage, Threshold,Triggered_At) VALUES (?, ?, ?, ?)';
    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [UserID, AlertMessage, Threshold,Triggered_At], (err, result) => {
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

// delete one data by AlertID
router.delete('/:AlertID', (req, res) => {
    const AlertID = req.params.AlertID;
    const query = 'DELETE FROM environmentalalerts WHERE AlertID = ?';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }

    connection.query(query, [AlertID], (err, result) => {
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

// delete one data by UserID
router.delete('/d/:UserID', (req, res) => {
    const UserID = req.params.UserID;
    const query = 'DELETE FROM environmentalalerts WHERE UserID = ?';

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
//UserID, AlertMessage, Threshold,Triggered_At
 // update data by AlertID
 router.put('/:AlertID', (req, res) => {
    const AlertID = req.params.AlertID;
    const { UserID, AlertMessage, Threshold,Triggered_At} = req.body;
    
    const query = 'UPDATE environmentalalerts SET UserID = ?, AlertMessage = ?, Threshold = ?, Triggered_At = ? WHERE AlertID = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [UserID, AlertMessage, Threshold,Triggered_At, AlertID], (err, result) => {
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
// update any data by AlertID
router.put('/up/:id', async (req, res, next) => {
    const { id } = req.params;
    const dataToUpdate = req.body;

    const updateQuery = `
    UPDATE environmentalalerts
    SET ? 
    WHERE AlertID = ?;
    `;

    pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(updateQuery, [dataToUpdate, id], (err, rows) => {
        connection.release();
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        const selectQuery = `
        SELECT * FROM cenvironmentalalerts 
        WHERE AlertID= ?;
    `;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(selectQuery, id, (err, rows) => {
        connection.release();
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
        });
    });

       // res.json(rows);
    });
    });


});

    return router;
};

module.exports = enviromentalart;

