require('dot-env');
import passport from 'passport';
import { MyCustomStrategy } from './MyCustomStrategy';
import { MyCustomEndpoint } from './MyCustomEndpoint';
import express, { Request } from 'express';
import expressSession from 'express-session';
import OAuth2Strategy, { VerifyCallback } from 'passport-oauth2';

const app = express();

const users = new Map<string, any>();

passport.serializeUser(function(user: any, done) {
  users.set(user.id, user);
  done(null, user);
});

passport.deserializeUser(function(user: any, done) {
  return users.get(user.id);
});

const CALLBACK_URL: string = 'http://localhost:3000/oauth2/redirect/google';

const verifyFn: OAuth2Strategy.VerifyFunctionWithRequest = (req: Request, accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback): void => {
  console.log('Verifying User Profile Now...');
  req.user = {
    external_id: profile.id,
    ...profile,
    accessToken,
    refreshToken,
  };

  console.log(req.user);


  cb(undefined, req.user);
};

app.use(expressSession({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

const strat = new MyCustomStrategy(MyCustomEndpoint.getConfig(CALLBACK_URL), verifyFn);

passport.use(
 'mycustomstrat', strat
);

// example 1
// app.get('/oauth2/redirect/google', [ passport.authenticate('mycustomstrat', {
//   state: 'test',
//   session: false,
//   // successRedirect: '/',
//   passReqToCallback: true
// }) ], MyCustomEndpoint.handler1);

// example 2
// app.get('/oauth2/redirect/google', MyCustomEndpoint.handler2);

// example 3
app.get('/oauth2/redirect/google', MyCustomEndpoint.handler3);

app.get('/', (req, res) => res.send({ok: true, user: req.user }));
app.listen(3000, () => {
  console.log('server listening on port 3000');
})



