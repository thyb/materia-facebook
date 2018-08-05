class AuthCtrl {
  constructor(app) {
    this.app = app;
    this.passport = this.app.server.passport;
    this.config = this.app.addons.addonsConfig['@materia/facebook'];
    this.usersConfig = this.app.addons.addonsConfig['@materia/users'];
  }

  connect(req, res, next) {
    
  }

  signin(req, res, next) {
    const opts = this.usersConfig.method == 'token'
      ? { session: false }
      : {};

    console.log('startup signin facebook endpoint', opts, req.body);
    // req.body.access_token = Buffer.from(req.body.access_token).toString('base64')
    this.passport.authenticate('facebook-token', opts, (err, user, info) => {
      if (!err && user) {
        res.status(200).json(user);
      } else {
        res.status(401).json({
          error: true,
          message: `Unauthorized: ${err && err.message || err}`
        })
      }
    })(req, res);
    // const access_token = req.body.access_token;
    // const additionalData = Object.keys(req.body).filter(k => k != 'access_token');

    // const facebookEntity = this.app.entities.get('facebook');
    // return facebookEntity.getQuery('me').run({
    //   access_token: access_token
    // }).then(me => {
    //   console.log(me);
    //   // const userEntity = this.app.api.get('post', '');

    //   const socialAccountEntity = this.app.entities.get('social_account');
    //   const userEntity = this.app.entities.get('user');
    //   const permissions = this.app.permissions;

    //   if (socialAccountEntity) {
    //     return socialAccountEntity.getQuery('find').run({
    //       provider: 'facebook',
    //       social_user_id: me.id
    //     }).then(data => {
    //       //signin
    //       this.signin(data.id_user);
    //     }).catch(e => {
    //       if (me.email) {
    //         userEntity.getQuery('findByEmail').run({
    //           email: me.email
    //         }).then(user => {
    //           permissions.check(['authenticated'])(req, res, (err) => {
    //             if (!err && user.id_user === req.user.id_user) {
    //               return socialAccountEntity.getQuery('create').run({
    //                 social_user_id: me.id,
    //                 provider: 'facebook',
    //                 id_user: user.id_user
    //               })
    //             }
    //           })
    //         })
    //         .catch(e => {
    //           const signupQuery = userEntity.getQuery('signup');
    //           const params = {};
    //           signupQuery.params.forEach((param) => {
    //             if (param.name != 'email' && param.name != 'password') {
    //               params[param.name] = me[param.name] || additionalData[param.name];
    //               if (params[param.name] === null && param.required) {
    //                 console.log(`required param missing (${param.name}).`);
    //               }
    //             }
    //           })
    //           signupQuery.run(Object.assign({}, params, {
    //             email: me.email,
    //             password: Math.random().toString(36).substring(3),
    //           })).then(user => {
    //             this._signin(user.id_user);
    //           });
    //         });
    //       } else {
    //         res.status(400).send('Email scope required (no email field found in Facebook response)');
    //       }
    //     })
    //   }
    // })
  }

  logout(req, res, next) {}
}

module.exports = AuthCtrl;
