// feature with child router : 
import { Router } from 'aurelia-router';

export function configure(config) {
    const router = config.container.get(Router);
    router.addRoute({
        route: 'administration', name: 'administration', moduleId: 'administration/main', nav: true, title: 'Administration'
    });
}