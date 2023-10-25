const { Router } = require('express');
const report = (pool) => {
const router = Router();

// Search for report
router.get('/search', (req, res) => {
    const { UserID, ReportID } = req.query;
    const query = `
        SELECT *
        FROM communityreports
        WHERE UserID LIKE ? AND ReportID LIKE ?`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [`%${UserID}%`, `%${ReportID}%`], (err, rows) => {
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
    const query = 'SELECT * FROM communityreports';

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

//get reports by ReportID
router.get('/:ReportID', (req, res) => {
    const ReportID = req.params.ReportID;
    const query = 'SELECT * FROM communityreports WHERE ReportID  = ?';

    pool.getConnection((err, connection) => {
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }

        connection.query(query, [ReportID], (err, result) => {
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

// Get one report by user-id
router.get('/u/:UserID', (req, res) => {
    const UserID  = req.params.UserID ;
    const query = 'SELECT * FROM communityreports WHERE UserID = ?';

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

// Insert an Report
router.post('/', (req, res) => {
    const { UserID , ReportType, Description } = req.body;
    const query = 'INSERT INTO communityreports (UserID , ReportType, Description) VALUES (?, ?, ?)';
    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [UserID, ReportType, Description], (err, result) => {
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


 // delete one data by ReportID
router.delete('/:ReportID', (req, res) => {
    const ReportID = req.params.ReportID;
    const query = 'DELETE FROM communityreports WHERE ReportID = ?';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }

    connection.query(query, [ReportID], (err, result) => {
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
    const query = 'DELETE FROM communityreports WHERE UserID = ?';

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

  // update data by ReportID
router.put('/:ReportID', (req, res) => {
    const ReportID = req.params.ReportID;
    const { UserID, ReportType, Description} = req.body;
    
    const query = 'UPDATE communityreports SET UserID = ?, ReportType = ?, Description = ? WHERE ReportID = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(query, [UserID, ReportType, Description, ReportID], (err, result) => {
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

 // update any data by ReportID
router.put('/up/:id', async (req, res, next) => {
    const { id } = req.params;
    const dataToUpdate = req.body;

    const updateQuery = `
    UPDATE communityreports
    SET ? 
    WHERE ReportID = ?;
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
        SELECT * FROM communityreports 
        WHERE ReportID= ?;
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

module.exports = report;
