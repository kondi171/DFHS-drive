const LocalStrategy = require('passport-local').Strategy;

const initialize = (passport, getUserByEmail, getUserById) => {

    passport.use(new LocalStrategy({ usernameField: 'mail' }, true))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

module.exports = initialize;