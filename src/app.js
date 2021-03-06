import { AuthorizationStep } from 'authorization-step';

export class App {

  // Logout-Pipeline:  
  // => a navigation setting (here: logoutRequired) gets the route invoked
  //    each time a navigation request is issued, so the activate-method gets called
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
      { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout', settings: { logoutRequired: true } }
    ]);
    config.mapUnknownRoutes('not-found');
    config.fallbackRoute('home');
  }
}

//      { route: 'administration', name: 'administration', moduleId: 'administration/adm', nav: true, title: 'Management', settings: { restrictedToAdmins: true } },