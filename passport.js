const LocalStrategy = require('passport-local').Strategy;
const User = require('./db/User');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({username: username}, (err, data) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          if (data) {
            console.log(data);
            const valid =
              data.username === username && data.password === password;

            if (valid) {
              done(null, {
                username: data.username,
              });
            } else {
              done(null, false, {message: 'Incorrect credentials'});
            }
          } else {
            done(null, false, {message: 'User not found'});
          }
        }
      });
    })
  );
};
