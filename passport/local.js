const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');

const { User } = require('../models');

module.exports = () => {
    passport.use('local', new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password',
    }, async (userId, password, done) => {
        try {
            const user = await User.findOne({
                where: { userId },
            });
            if (!user) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user);
            }
            return done(null, false, { message: '비밀번호가 다릅니다.' });
        }
        catch (e) {
            console.error(e);
            return done(e);
        }
    }));
}