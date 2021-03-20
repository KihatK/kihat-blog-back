import { Sequelize } from 'sequelize';
import config from '../config/config';

let sequelize: Sequelize = null;

if (process.env.NODE_ENV === 'production') {  //배포모드일 때
  if (process.env.DATABASE_URL) {  //만약 heroku postgres 연결했을 때
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      native: true,
      protocol: 'postgres',
    });
  }
}
else {  //개발모드일 때
  const env = 'development'
  sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);
}

export { sequelize };
export default sequelize;