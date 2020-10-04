const Sequelize = require('sequelize');
const user = require('./user');
const post = require('./post');
const image = require('./image');
const comment = require('./comment');
const bcategory = require('./bcategory');
const scategory = require('./scategory');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

let sequelize = null;

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres'
    })
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.User = user;
db.Post = post;
db.Image = image;
db.Comment = comment;
db.Bcategory = bcategory;
db.Scategory = scategory;

Object.keys(db).forEach(modelName => {
    db[modelName].init(sequelize);
})

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;