import * as FacebookTokenStrategy from 'passport-facebook-token';
import * as crypto from 'crypto';

export class FacebookAuth {
  passport: any;

  protected generateToken({
    stringBase = 'base64',
    byteLength = 32
  } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(byteLength, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString(stringBase));
        }
      });
    });
  }

  private createToken(idUser) {
    console.log('create token for ' + idUser);
    return this.generateToken().then(token => {
      const tokenHash = crypto
        .createHash('sha1')
        .update(token)
        .digest('hex');

      const userTokenEntity = this.app.entities.get('user_token');
      const expiresIn = new Date(new Date().getTime() + 3600 * 48 * 1000);
      return userTokenEntity
        .getQuery('create')
        .run(
          {
            id_user: idUser,
            expires_in: expiresIn,
            token: tokenHash,
            scope: '["*"]'
          },
          { raw: true }
        )
        .then(() => {
          return {
            access_token: token,
            expires_in: expiresIn
          };
        });
    });
  }

  private getEmptyValue(param) {
    if (param.type === 'text') {
      return 'undefined';
    } else if (param.type === 'date') {
      return new Date();
    } else if (param.type === 'boolean') {
      return false;
    } else if (param.type === 'number' || param.type === 'float') {
      return 0;
    }
  }

  private facebookDataToProfile(profile) {
    const signupQuery = this.app.entities.get('user').getQuery('signup');
    const params = {};
    signupQuery.params.forEach(param => {
      if (param.name !== 'email' && param.name !== 'password') {
        if (
          this.settings.profile_mapping &&
          this.settings.profile_mapping[param.name]
        ) {
          params[param.name] =
            profile._json[this.settings.profile_mapping[param.name]];
        } else {
          params[param.name] = profile._json[param.name];
        }
        if (!params[param.name] && param.required) {
          console.log(`required param missing (${param.name}).`);
          params[param.name] = this.getEmptyValue(param);
        }
      }
    });
    return params;
  }

  constructor(private app, private settings) {
    this.passport = app.server.passport;
    this.passport.use(
      'facebook-token',
      new FacebookTokenStrategy(
        {
          clientID: settings.app_id,
          clientSecret: settings.app_secret,
          fbGraphVersion: 'v3.1',
          enableProof: false
        },
        (accessToken, refreshToken, profile, done) => {
          const socialAccountEntity = this.app.entities.get('social_account');
          const userEntity = this.app.entities.get('user');
          console.log('start auth facebook');
          if (socialAccountEntity) {
            socialAccountEntity
              .getQuery('find')
              .run(
                {
                  provider: 'facebook',
                  social_user_id: profile.id
                },
                { raw: true }
              )
              .then(data => {
                console.log(data);
                if (data) {
                  console.log('found social account -> signin !', data);
                  userEntity
                    .getQuery('userInfo')
                    .run(
                      {
                        id_user: data.id_user
                      },
                      { raw: true }
                    )
                    .then(user => this.authenticate(user))
                    .then(user => done(null, user));
                } else {
                  console.log(
                    'social account not found, try to signup...',
                    profile
                  );
                  if (profile && profile._json && profile._json.email) {
                    userEntity
                      .getQuery('getByEmail')
                      .run(
                        {
                          email: profile._json.email
                        },
                        { raw: true }
                      )
                      .then(user => {
                        if (user) {
                          return done(
                            `The email ${
                              profile._json.email
                            } is already registered and is not linked with this Facebook account.
  Please, signin with your existing credentials and link your facebook account once connected to be able to connect with it later.`
                          );
                        } else {
                          const signupQuery = userEntity.getQuery('signup');
                          const params = this.facebookDataToProfile(profile);
                          const userData = Object.assign({}, params, {
                            email: profile._json.email,
                            password: Math.random()
                              .toString(36)
                              .substring(3)
                          });
                          signupQuery
                            .run(userData, { raw: true })
                            .then(userCreated => {
                              return socialAccountEntity
                                .getQuery('create')
                                .run(
                                  {
                                    id_user: userCreated.id_user,
                                    provider: 'facebook',
                                    social_user_id: profile.id,
                                    access_token: accessToken,
                                    refresh_token: refreshToken
                                  },
                                  { raw: true }
                                )
                                .then(() => userCreated);
                            })
                            .then(userCreated => this.authenticate(userCreated))
                            .then(userCreated => {
                              return done(null, userCreated);
                            })
                            .catch(err2 => {
                              console.log(err2);
                              return done(err2, null);
                            });
                        }
                      });
                  } else {
                    done(
                      'Email scope required (no email field found in Facebook response)'
                    );
                  }
                }
              });
          } else {
            done('No social_account entity found');
          }
        }
      )
    );
  }

  authenticate(user) {
    console.log('before', user);
    return this.createToken(user.id_user).then(token => {
      user.access_token = token.access_token;
      user.expires_in = token.expires_in;
      delete user.id_user_profile;
      console.log('after', user);
      return user;
    });
  }
}
