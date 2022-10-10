"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dot-env');
const passport_1 = __importDefault(require("passport"));
const MyCustomStrategy_1 = require("./MyCustomStrategy");
const MyCustomEndpoint_1 = require("./MyCustomEndpoint");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const users = new Map();
passport_1.default.serializeUser(function (user, done) {
    users.set(user.id, user);
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    return users.get(user.id);
});
const CALLBACK_URL = 'http://localhost:3000/oauth2/redirect/google';
const verifyFn = (req, accessToken, refreshToken, profile, cb) => {
    console.log('Verifying User Profile Now...');
    req.user = Object.assign(Object.assign({ external_id: profile.id }, profile), { accessToken,
        refreshToken });
    console.log(req.user);
    cb(undefined, req.user);
};
app.use((0, express_session_1.default)({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));
const strat = new MyCustomStrategy_1.MyCustomStrategy(MyCustomEndpoint_1.MyCustomEndpoint.getConfig(CALLBACK_URL), verifyFn);
passport_1.default.use('mycustomstrat', strat);
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
app.get('/oauth2/redirect/google', MyCustomEndpoint_1.MyCustomEndpoint.handler3);
app.get('/', (req, res) => res.send({ ok: true, user: req.user }));
app.listen(3000, () => {
    console.log('server listening on port 3000');
});
