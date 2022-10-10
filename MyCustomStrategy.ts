import axios from 'axios';
import OAuth2Strategy from 'passport-oauth2';

export class MyCustomStrategy extends OAuth2Strategy {
  public name: string = 'mycustomstrat';

  constructor(options: OAuth2Strategy.StrategyOptionsWithRequest, verify: OAuth2Strategy.VerifyFunctionWithRequest) {
    super(options, verify);
  }

  public async userProfile(
    accessToken: string,
    callback: (err: Error | undefined, user?: any) => void
  ) {
    console.log(
      'fetching user profile information now with accessToken: ',
      accessToken
    );

    try {

      const profileData = await axios.request({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken,
        method: 'GET'
      })

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
    } catch (err) {
      return callback(err as Error);
    }
  }
}
