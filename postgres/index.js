const { Pool, Client } = require('pg');

const credentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'sdc_reviews',
  password: '',
  port: 5432
};

const db = new Client(credentials);

db.connect()
  .then(response => {
    console.log('Connected!')
  })
  .catch(err => {
    console.error(err);
  })

module.exports = db;