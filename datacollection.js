const { Router } = require('express');

const datacollection = (pool) => {
  const router = Router();

 // update any data by data-id
  router.put('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    const dataToUpdate = req.body;
  
    const updateQuery = `
      UPDATE datacollection
      SET ? 
      WHERE data_id = ?;
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
        SELECT * FROM datacollection 
        WHERE data_id= ?;
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

 /*   try {
      const [results] = await pool.query(updateQuery, [dataToUpdate, id]);
      console.log("hg");
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: `No record found for id ${id}` });
      }
      console.log("hg");
      // Optionally fetch the updated record after the update if needed
      const selectQuery = `
        SELECT * FROM datacollection 
        WHERE data_id= ?;
      `;
      console.log("hg");
      const [selectedResults] = await pool.query(selectQuery, [id]);
      console.log("hg");
      res.status(200).json({ data: selectedResults[0] });
    } catch (error) {
      return next(error);
    }
    */
  });


   // Search for data
   router.get('/search', (req, res) => {
    const { user_id, resource_id, humidity } = req.body;
    
    const query = `
      SELECT *
      FROM datacollection
      WHERE user_id LIKE ? AND resource_id LIKE ? AND humidity >= ?
    `;
    const user_idFilter = `%${user_id || ''}%`;
    const resource_idFilter = `%${resource_id || ''}%`;
    const humidityFilter = humidity || 0;

    pool.getConnection((err, connection) => {
      if (err) throw err;

      connection.query(query, [user_idFilter, resource_idFilter, humidityFilter], (err, rows) => {
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


  // Insert an DataCollection
  router.post('/', (req, res) => {
    const { user_id, resource_id, airquality, temperature, humidity, waterquality, biodiversitymetrics  } = req.body;
    const query = 'INSERT INTO datacollection (user_id, resource_id, airquality, temperature , humidity, waterquality, biodiversitymetrics ) VALUES (?, ?, ?, ?, ?, ?, ?)';
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      connection.query(query, [user_id, resource_id, airquality, temperature , humidity, waterquality, biodiversitymetrics ], (err, result) => {
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

  // Get All DataCollection
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM datacollection';

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

  // Get one data by id
  router.get('/:data_id', (req, res) => {
    const data_id = req.params.data_id;
    const query = 'SELECT * FROM datacollection WHERE data_id = ?';

    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      connection.query(query, [data_id], (err, result) => {
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


   // Get one data by user-id
   router.get('/user/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const query = 'SELECT * FROM datacollection WHERE user_id = ?';

    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      connection.query(query, [user_id], (err, result) => {
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


    // Get one data by user-id
    router.get('/resource/:resource_id', (req, res) => {
        const resource_id = req.params.resource_id;
        const query = 'SELECT * FROM datacollection WHERE resource_id = ?';
    
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }
    
          connection.query(query, [resource_id], (err, result) => {
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

      // update one data by user-id
      router.put('/:data_id', (req, res) => {
        const data_id = req.params.data_id;
        const { user_id, resource_id, airquality, temperature, humidity, waterquality, biodiversitymetrics } = req.body;
        
        const query = 'UPDATE datacollection SET user_id = ?, resource_id = ?, airquality = ?, temperature = ?, humidity = ?, waterquality = ?, biodiversitymetrics = ? WHERE data_id = ?';
    
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(query, [user_id, resource_id, airquality, temperature, humidity, waterquality, biodiversitymetrics, data_id], (err, result) => {
                connection.release();
    
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
    
                res.status(200);
            });
        });
    });
    

      // Get one data by user-id
      router.delete('/:data_id', (req, res) => {
        const data_id = req.params.data_id;
        const query = 'DELETE FROM datacollection WHERE data_id = ?';
    
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }
    
          connection.query(query, [data_id], (err, result) => {
            connection.release();
    
            if (err) {
              console.log(err);
              res.status(500).send('Internal Server Error');
              return;
            }
    
            res.status(200);
          });
        });
      });

     


  // Add more routes as needed...

  return router;
};

module.exports = datacollection;
