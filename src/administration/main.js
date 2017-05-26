// child router inside feature : 
import { inlineView } from 'aurelia-framework';

@inlineView('<template><router-view></router-view></template>')
export class Administration {
    configureRouter(config) {
        config.map([
            { route: '', name: 'administration', moduleId: './components/admin-menu', title: '' },
            { route: 'populate', name: 'populate', moduleId: './components/populate', title: 'Add User' },
            { route: 'cleanup', name: 'cleanup', moduleId: './components/cleanup', title: "Cleanup" },
            { route: 'statistics', name: 'statistics', moduleId: './components/statistics', title: "Statistics" },
        ]);
    }
}