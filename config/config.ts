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
  production: IConfig,
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
    // "use_env_variable": "DATABASE_URL"
    "username": "zbgwbhottgzcqk",
    "password": process.env.DB_PASSWORD,
    "database": "ddi9v1lgjh624p",
    "host": "ec2-18-211-86-133.compute-1.amazonaws.com",
    "dialect": "postgres",
    "operatorsAliases": false
  }
}

export default config;