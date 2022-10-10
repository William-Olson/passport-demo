"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomEndpoint = void 0;
const passport_1 = __importDefault(require("passport"));
class MyCustomEndpoint {
    static getConfig(callbackUrl) {
        return {
            authorizationURL: process.env.EXAMPLE_AUTH_URL,
            tokenURL: process.env.EXAMPLE_TOKEN_URL,
            clientID: process.env.EXAMPLE_CLIENT_ID,
            clientSecret: process.env.EXAMPLE_CLIENT_SECRET,
            callbackURL: callbackUrl,
            passReqToCallback: true,
            scope: 'email openid profile',
        };
    }
    static handler1(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('sending okay true now from handler1');
            res.send({ okay: true, user: req.user });
        });
    }
    static handler2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('running authenticate');
            yield (passport_1.default.authenticate('mycustomstrat', {
                session: false,
                successRedirect: '/',
                passReqToCallback: true
            })(req, res, () => __awaiter(this, void 0, void 0, function* () {
                console.log('running authorize');
                yield (passport_1.default.authorize('mycustomstrat')(req, res));
            })));
        });
    }
    static handler3(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('running authenticate');
            yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield passport_1.default.authorize('mycustomstrat', {
                    session: false,
                    state: 'abc123',
                    passReqToCallback: true,
                })(req, res, (err) => err ? reject(err) : resolve(true));
            }));
            console.log('sending okay true now');
            res.send({ okay: true, user: req.user });
        });
    }
}
exports.MyCustomEndpoint = MyCustomEndpoint;
