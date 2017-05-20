import { AuthorizationStep } from 'authorization-step';

export class App {

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Postillion';
   config.addPipelineStep('authorize', AuthorizationStep);
    config.map([
      { route: '', redirect: 'home' },
      { route: 'home', name: 'home', moduleId: 'welcome-screen', nav: false },
      { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'signup', nav: true, title: 'Signup' },
      { route: 'account', name: 'account', moduleId: 'edit-account', nav: true, title: 'Edit Account' },
      { route: 'tweet', name: 'tweet', moduleId: 'tweet', nav: true, title: 'Postoffice', settings: { logonRequired: true } },
      { route: 'management', name: 'management', moduleId: 'management', nav: true, title: 'Management', settings: { restrictedToAdmins:true } },
      { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout' }
    ]);
    config.mapUnknownRoutes('not-found');
    config.fallbackRoute('home');
  }
}
