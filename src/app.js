// import { AuthenticatedStep } from 'authenticated-step';

    // config.addPipelineStep('administer', AuthenticatedStep);
      // { route: 'admin', name: 'manage', moduleId: 'admin-tools', nav: true, title: 'Signup', settings: { secured:true } },

export class App {
  
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Postillion';
    config.map([
      { route: '', redirect: 'welcome' },
      { route: 'welcome', name: 'welcome', moduleId: 'welcome-screen', nav: false },
      { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'signup', nav: true, title: 'Signup'  },
      { route: 'account', name: 'account', moduleId: 'edit-account', nav: true, title: 'Edit Account' },
      { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout'},
    ]);
    config.mapUnknownRoutes('not-found');
  }
  
}
