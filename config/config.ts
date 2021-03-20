import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  username: string,
  password: null | string,
  database: string,
  [index: string]: string | boolean,
};

interface IConfigGroup {
  development: IConfig,
  test: IConfig,
  production: {
    use_env_variable: string,
    dialect: string,
    dialectOptions: { ssl: boolean },
  },
};

const config: IConfigGroup = {
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
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": true
    }
    // "username": "root",
    // "password": process.env.DB_PASSWORD,
    // "database": "myWeb_Heroku_product",
    // "host": "127.0.0.1",
    // "dialect": "mysql",
    // "operatorsAliases": false
  }
}

export default config;