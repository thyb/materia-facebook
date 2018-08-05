export function addSigninTokenEndpoint(app) {
  app.api.add(
    {
      method: 'post',
      url: '/user/signin/facebook',
      controller: 'auth',
      action: 'signin',
      parent: 'Facebook',
      params: [
        {
          name: 'access_token',
          type: 'text',
          required: true,
          component: 'input'
        }
      ]
    },
    {
      fromAddon: app.addons.get('@materia/facebook'),
      save: false,
      apply: true
    }
  );
}
