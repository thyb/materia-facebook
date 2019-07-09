import { addSigninTokenEndpoint } from './init/add-signin-token.endpoint';
import { FacebookAuth } from './auth/facebook-auth';

export default class Facebook {
  public static displayName = 'Facebook';
  public static logo =
    'https://materiahq.github.io/materia-website-content/logo/addons/facebook.png';

  public static installSettings = false;

  auth: any;

  constructor(private app: any, private settings: any) {}

  afterLoadAPI() {
    const socialAccountEntity = this.app.entities.get('social_account');
    if (this.settings && this.settings.social_connect && socialAccountEntity) {
      addSigninTokenEndpoint(this.app);
    }
    return Promise.resolve();
  }

  start() {
    if (this.settings && this.settings.app_id && this.settings.app_secret) {
      this.auth = new FacebookAuth(this.app, this.settings);
    }
    return Promise.resolve();
  }

  uninstall(app) {}
}
