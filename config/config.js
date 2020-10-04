const dotenv = require('dotenv');

dotenv.config();

const config = {
  "development": {
    "username": "root",
    "password": null,
    "database": "myWeb_Heroku_dev",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "dmyWeb_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
    // "username": "root",
    // "password": process.env.DB_PASSWORD,
    // "database": "myWeb_Heroku_product",
    // "host": "127.0.0.1",
    // "dialect": "mysql",
    // "operatorsAliases": false
  }
}

module.exports = config;

// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "myWeb_dev",
//     "host": "127.0.0.1",
//     "dialect": "mysql",
//     "operatorsAliases": false
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "myWeb_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql",
//     "operatorsAliases": false
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "myWeb_product",
//     "host": "127.0.0.1",
//     "dialect": "mysql",
//     "operatorsAliases": false
//   }
// }