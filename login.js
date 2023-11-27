const { Router } = require('express');

const login = (pool) => {
  const router = Router();

  router.get('/', (req, res) => {
    const { Username, passward } = req.body;
    const query = `
      SELECT *
      FROM userprofiles
      WHERE Username LIKE ? AND passward LIKE ?`;

    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      connection.query(query, [Username, passward], (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
          return;
        }

        if (!rows || rows.length === 0) {
          req.session.isAuthenticated = false;
          res.status(404).send('Please Login');
          return;
        }

        if (Username === rows[0].Username) {
          req.session.isAuthenticated = true;
        }

        res.json(rows);
      });
    });
  });

  return router;
};

module.exports = login;
