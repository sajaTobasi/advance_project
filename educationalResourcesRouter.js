const { Router } = require('express');

const educationalResourcesRouter = (pool) => {
const router = Router();

  // Create new resource//
router.post('/', (req, res) => {
    const { UserID, Title, Category, Content, Link } = req.body;
    const query = 'INSERT INTO EducationalResources (UserID, Title, Category, Content, Link) VALUES (?, ?, ?, ?, ?)';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [UserID, Title, Category, Content, Link], (err, result) => {
        connection.release();
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.send(`Resource with ID: ${result.insertId} has been created.`);
    });
    });
});

// Get All Resources//
router.get('/', (req, res) => {
    const query = 'SELECT * FROM EducationalResources';
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

  // Get Resource by ID//
router.get('/:ResourceID', (req, res) => {
    const ResourceID = req.params.ResourceID;
    const query = 'SELECT * FROM EducationalResources WHERE ResourceID = ?';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [ResourceID], (err, result) => {
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

  // Update Resource by ID
router.put('/:ResourceID', (req, res) => {
    const ResourceID = req.params.ResourceID;
    const { UserID, Title, Category, Content, Link} = req.body;

    const query = 'UPDATE EducationalResources SET UserID = ?, Title = ?, Category = ?, Content = ?, Link = ? WHERE ResourceID = ?';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [UserID, Title, Category, Content, Link, ResourceID], (err, result) => {
        connection.release();
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.send(`Resource with ID: ${ResourceID} has been updated.`);
    });
    });
});

  // Delete Resource by ID//
router.delete('/:ResourceID', (req, res) => {
    const ResourceID = req.params.ResourceID;
    const query = 'DELETE FROM EducationalResources WHERE ResourceID = ?';

    pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
    }
    connection.query(query, [ResourceID], (err, result) => {
        connection.release();
        if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.send(`Resource with ID: ${ResourceID} has been deleted.`);
    });
    });
});

  // Add more routes as required...

return router;
};

module.exports = educationalResourcesRouter;
