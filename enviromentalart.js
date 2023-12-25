const { Router } = require('express');
const twilio = require('twilio');

const environmentalAlerts = (pool) => {
const router = Router();



function sendSMSAlert(toPhoneNumber, alertMessage) {
    const accountSid = 'AC054f715ee37662266a654e72744b3d09'; // Replace with your Twilio Account SID
    const authToken = '5c3bc67bde19206edf1dd2da904773da';   // Replace with your Twilio Auth Token
    const twilioPhoneNumber = '+16572372426'; // Replace with your Twilio Phone Number

    const client = twilio(accountSid, authToken);

    client.messages
    .create({
        body: alertMessage,
        from: twilioPhoneNumber,
        to: toPhoneNumber,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));
}



  // Search for alert
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

 // Insert an alart
router.post('/', (req, res) => {
    const { UserID , AlertMessage, Threshold ,Triggered_At,toPhone} = req.body;
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
       // const PhoneNumber= "0599528307";
   // const toPhoneNumber="+970598534487";
        sendSMSAlert(toPhone, `alert: ${AlertMessage}`);
      //  res.send(Application with ID: ${result.insertId} has been submitted.);
        res.send(`Application with ID: ${result.insertId} has been submitted.`);
    });
    });
});

  // Get all reports
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

  // Get alert by AlertID
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

  // Get alert by UserID
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

  // Delete alert by AlertID
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
        res.json("Done");
      });
    });
  });

  // Delete alert by UserID
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
        res.json("Done");
      });
    });
  });

  // Update alert by AlertID
  router.put('/:AlertID', (req, res) => {
    const AlertID = req.params.AlertID;
    const { UserID, AlertMessage, Threshold } = req.body;

    const query = 'UPDATE environmentalalerts SET UserID = ?, AlertMessage = ?, Threshold = ? WHERE AlertID = ?';

    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      connection.query(query, [UserID, AlertMessage, Threshold, AlertID], (err, result) => {
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

  // Update any data by AlertID
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
          SELECT * FROM environmentalalerts 
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
      });
    });
  });

  return router;
};

module.exports = environmentalAlerts;
