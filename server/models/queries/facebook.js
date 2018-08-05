const graph = require('fbgraph');

class FacebookModel {
  constructor(app, entity) {
    this.app = app;
    this.entity = entity;

    if (this.app.addons.addonsConfig['@materia/facebook']) {
    }
  }

  me(params) {
	graph.setAccessToken(params.access_token)
	return new Promise((resolve, reject) => {
		graph.get('me', (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		})
	})
  }
}

module.exports = FacebookModel;
