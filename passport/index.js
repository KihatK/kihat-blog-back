const passport = require('passport');

const { User } = require('../models');
const local = require('./local');

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({
                where: { id },
                attributes: ['id', 'admin', 'nickname', 'userId'],
            });
            return done(null, user);
        }
        catch (e) {
            console.error(e);
            return done(e);
        }
    });

    local();
}