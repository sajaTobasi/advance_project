const axios = require('axios');
const { Router } = require('express');

const weather = (db) => {
  const router = Router();
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?id=524901&appid=8e022b77674a4e095818d802963da9ba';

  async function fetchWeatherData() {
    try {
      const response = await axios.get(apiUrl);
      console.log(response.data);
      console.log(response.data.name);
      const city = response.data.name;
      const temperature = response.data.main.temp - 273.15;
      const humidity = response.data.main.humidity;
      const wind_speed = response.data.wind.speed || 0;
      const wind_deg = response.data.wind.deg || 0;
      const pressure = response.data.main.pressure;

      return { temperature, humidity, wind_speed, wind_deg, pressure, city };
    } catch (error) {
      console.error('Error fetching data from One Call API:', error.message);
      throw error;
    }
  }

  router.post('/weather', async (req, res) => {
    try {
      const weatherData = await fetchWeatherData();
      const { user_id, resource_id } = req.body;

      // Store data in MySQL database
      const query = 'INSERT INTO datacollection (user_id, resource_id, city, temperature, humidity, wind_speed, wind_deg, pressure, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())';
      const values = [user_id, resource_id, weatherData.city, weatherData.temperature, weatherData.humidity, weatherData.wind_speed, weatherData.wind_deg, weatherData.pressure];

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
      const one = 1;

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        db.query(sustainabilityScoreQuery, [one, user_id], (err) => {
          if (err) {
            db.rollback(() => {
              console.log(err);
              res.status(500).json({ error: 'Internal Server Error 3' });
            });
            return;
          }
          db.query(query3, [one, user_id], (err) => {
            if (err) {
              db.rollback(() => {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error 4' });
              });
              return;
            }
            res.json({ message: `Data with ID: ${result.insertId} has been submitted.` });
          });
        });
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch and update data' });
    }
  });

  return router;
};

module.exports = weather;
