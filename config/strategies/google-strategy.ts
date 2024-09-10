import passport from 'passport';
import  { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20"
import config from "../config"

const {clientId, clientSecret, callbackURL}  = config.google
passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret,
    callbackURL
  },
  function(accessToken:string, refreshToken:string, profile:Profile, done) {
   done(null, profile)
  }
));


passport.serializeUser((user, done) => {
  // Serialize the user ID to store in the session
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  // Find the user by ID and pass it to done
  // In a real application, you would fetch the user from the database
  done(null, user);
});

// Error handling in serialize and deserialize
passport.serializeUser((user, done) => {
  try {
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser((user:Express.User, done) => {
  try {
    // Simulating user retrieval; replace with actual user fetch logic
    // const user = { id }; // Replace with real user fetch
    done(null, user);
  } catch (error) {
    done(error);
  }
});
