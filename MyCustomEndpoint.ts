import { Request, Response } from "express";
import passport from "passport";
import OAuth2Strategy from "passport-oauth2";


export class MyCustomEndpoint {

  public static getConfig(callbackUrl: string): OAuth2Strategy.StrategyOptionsWithRequest {
    return {
      authorizationURL: process.env.EXAMPLE_AUTH_URL!,
      tokenURL: process.env.EXAMPLE_TOKEN_URL!,
      clientID: process.env.EXAMPLE_CLIENT_ID!,
      clientSecret: process.env.EXAMPLE_CLIENT_SECRET!,
      callbackURL: callbackUrl,
      passReqToCallback: true,
      scope: 'email openid profile',
    };
  }

  // for example 1
  public static async handler1(req: Request, res: Response): Promise<void> {
    console.log('sending okay true now from handler1');
    res.send({ okay: true, user: (req as any).user });
  }
 
  // for example 2
  public static async handler2(req: Request, res: Response): Promise<void> {
    console.log('running authenticate');
    await (passport.authenticate('mycustomstrat', {
      session: false,
      successRedirect: '/',
      passReqToCallback: true
    })(req, res, async () => {
      console.log('running authorize');
      await (passport.authorize('mycustomstrat')(req, res));
    }));
  }

  // for example 3
  public static async handler3(req: Request, res: Response): Promise<void> {
    console.log('running authenticate');
    await new Promise(async (resolve, reject) => {
      await passport.authorize('mycustomstrat', {
        session: false,
        state: 'abc123',
        passReqToCallback: true,
      })(req, res, (err?: Error) =>
      err ? reject(err) : resolve(true));
    });

    console.log('sending okay true now');
    res.send({ okay: true, user: (req as any).user });
  }
}
