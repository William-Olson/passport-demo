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
exports.MyCustomStrategy = void 0;
const axios_1 = __importDefault(require("axios"));
const passport_oauth2_1 = __importDefault(require("passport-oauth2"));
class MyCustomStrategy extends passport_oauth2_1.default {
    constructor(options, verify) {
        super(options, verify);
        this.name = 'mycustomstrat';
    }
    userProfile(accessToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('fetching user profile information now with accessToken: ', accessToken);
            try {
                const profileData = yield axios_1.default.request({
                    url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken,
                    method: 'GET'
                });
                console.log('fetched profile information: ' + JSON.stringify(profileData.data, undefined, 2));
                const data = profileData.data;
                return callback(undefined, {
                    id: data.id,
                    accessToken: accessToken,
                    refreshToken: data.refresh_token,
                    email: data.email,
                    name: data.name,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    picture: data.picture,
                });
            }
            catch (err) {
                return callback(err);
            }
        });
    }
}
exports.MyCustomStrategy = MyCustomStrategy;
