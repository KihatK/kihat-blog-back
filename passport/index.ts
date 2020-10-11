import passport from 'passport';

import User from '../models/user';
import local from './local';

export default () => {
  passport.serializeUser((user: User, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      return done(null, user);
    }
    catch (e) {
      return done(e);
    }
  });

  local();
}