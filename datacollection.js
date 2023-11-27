const { Router } = require('express');

const datacollection = (pool) => {
  const router = Router();

  const authenticateUser = (req, res, next) => {
    if (req.session.isAuthenticated) {
      return next();
    } else {
      res.status(401).send('Please login');
    }
  };

 // update any data by data-id
  router.put('/update/:id',authenticateUser, async (req, res, next) => {
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
//////////////////////////////////////////////////////////////////////
  // Get All SustainabilityScore
  router.get('/score', (req, res) => {
    const query = 'SELECT * FROM SustainabilityScore';
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      connection.query(query, (err, result) => {
        connection.release();
  
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        console.log('Query Result:', result); // Add this line for debugging
  
        if (result.length === 0) {
          console.log('No data found'); // Add this line for debugging
        }
  
        res.json(result);
      });
    });
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
  router.post('/', authenticateUser,(req, res) => {
    const { user_id, resource_id, airquality, temperature, humidity, waterquality, biodiversitymetrics } = req.body;
    const query = 'INSERT INTO datacollection (user_id, resource_id, airquality, temperature, humidity, waterquality, biodiversitymetrics,total) VALUES (?, ?, ?,?, ?, ?, ?, ?)';
    const sustainabilityScoreQuery = `
      UPDATE SustainabilityScore ss
      SET TotalPoints = COALESCE(?, 0) + COALESCE(ss.TotalPoints, 0)
      WHERE ss.UserID = ?;
    `;
    const query3 = `
      UPDATE userprofiles ss
      SET ContributionPoints = COALESCE(?, 0) + COALESCE(ss.ContributionPoints, 0)
      WHERE ss.UserID = ?;
    `;
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error 1');
        return;
      }
      const total = airquality + temperature + humidity + waterquality + biodiversitymetrics;
      const one=1;
      connection.query(query, [user_id, resource_id, airquality, temperature, humidity, waterquality, biodiversitymetrics,total], (err, result) => {
        connection.release();
  
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error 2');
          return;
        }
        
        
        
        connection.query(sustainabilityScoreQuery, [total, user_id], (err) => {
          if (err) {
            connection.rollback(() => {
              console.log(err);
              res.status(500).send('Internal Server Error 3');
            });
            return;
          }
                  connection.query(query3, [ one , user_id], (err) => {
                    if (err) {
                      connection.rollback(() => {
                        console.log(err);
                        res.status(500).send('Internal Server Error 4');
                      });
                      return;
                    }});
  
          res.json({ result: total, message: `Data with ID: ${result.insertId} has been submitted.` });
        });
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
    const query1 = 'SELECT TotalPoints FROM SustainabilityScore WHERE UserID = ?';

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
        connection.query(query1, [user_id], (err, ret) => {
        
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error2');
            return;
          }
    
          if (ret.length === 0) {
            res.status(404).send('Data not found');
            return;
          }


          res.json({
            totalPoints: ret[0].TotalPoints,
            result: result
          });
          
      });
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
      router.put('/:data_id', authenticateUser, (req, res) => {
        const data_id = req.params.data_id;
        const {airquality, temperature, humidity, waterquality, biodiversitymetrics,user_id } = req.body;
        const query1 = 'SELECT total, user_id FROM datacollection WHERE data_id = ?';
        const query = 'UPDATE datacollection SET airquality = ?, temperature = ?, humidity = ?, waterquality = ?, biodiversitymetrics = ?, total = ? WHERE data_id = ?';
        const sustainabilityScoreQuery = `
        UPDATE SustainabilityScore ss
        SET TotalPoints = COALESCE(?, 0) + COALESCE(ss.TotalPoints, 0)
        WHERE ss.UserID = ?;
      `;

        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error1');
                return;
            }
            connection.query(query1, [data_id], (err, ret) => {
        
              if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error2');
                return;
              }
        
              if (ret.length === 0) {
                res.status(404).send('Data not found');
              } else {
                const total=airquality+ temperature+ humidity+ waterquality+ biodiversitymetrics;
            connection.query(query, [ airquality, temperature, humidity, waterquality, biodiversitymetrics,total ,data_id], (err, result) => {
              
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error3');
                    return;
                }
                console.log(total);
                console.log(ret[0].total);
                const i =  total -  ret[0].total;
                console.log(i);

                connection.query(sustainabilityScoreQuery, [i, ret[0].user_id], (err) => {
                  if (err) {
                    connection.rollback(() => {
                      console.log(err);
                      res.status(500).send('Internal Server Error');
                    });
                    return;
                  }
                
                  connection.commit((err) => {
                    if (err) {
                      connection.rollback(() => {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                      });
                      return;
                    }
                
                    // If there are no errors, the transaction is committed, and the update is complete
                    res.json({ result: i, message: `Data with ID: ${result.insertId} has been submitted.` });
                  });
                });
                
                });
        }
      }); 
        });
    });
    

      // Get one data by user-id
      router.delete('/:data_id', authenticateUser, (req, res) => {
        const data_id = req.params.data_id;
        const query = 'DELETE FROM datacollection WHERE data_id = ?';
        const query1 = 'SELECT total, user_id FROM datacollection WHERE data_id = ?';
        const sustainabilityScoreQuery = `
        UPDATE SustainabilityScore ss
        SET TotalPoints = COALESCE(?, 0) + COALESCE(ss.TotalPoints, 0)
        WHERE ss.UserID = ?;
      `;
      const query3 = `
      UPDATE userprofiles ss
      SET ContributionPoints = COALESCE(?, 0) + COALESCE(ss.ContributionPoints, 0)
      WHERE ss.UserID = ?;
    `;
    
        pool.getConnection((err, connection) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          connection.query(query1, [data_id], (err, ret) => {
        
            if (err) {
              console.log(err);
              res.status(500).send('Internal Server Error2');
              return;
            }
      
            if (ret.length === 0) {
              res.status(404).send('Data not found');
            } else {
              const i = 0-ret[0].total;
              const one = 0-1;
             // console.log(i);
              connection.query(sustainabilityScoreQuery, [i, ret[0].user_id], (err) => {
                if (err) {
                  connection.rollback(() => {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                  });
                  return;
                }
              
                connection.commit((err) => {
                  if (err) {
                    connection.rollback(() => {
                      console.log(err);
                      res.status(500).send('Internal Server Error');
                    });
                    return;
                  }
            
                });
              });

              connection.query(query, [data_id], (err) => {
                if (err) {
                  console.log(err);
                  res.status(500).send('Internal Server Error');
                } else {

                  connection.query(query3, [ one , ret[0].user_id], (err) => {
                    if (err) {
                      connection.rollback(() => {
                        console.log(err);
                        res.status(500).send('Internal Server Error 4');
                      });
                      return;
                    }});
                  res.status(200).send('Success');
                }
                connection.release();
              });
        }}
      )});
        
        });
      


    // Get one SustainabilityScore by user-id
    router.get('/score/:UserID', (req, res) => {
      const UserID = req.params.UserID;
      const query = 'SELECT * FROM SustainabilityScore WHERE UserID = ?';
  
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


     


  // Add more routes as needed...

  return router;
};

module.exports = datacollection;
