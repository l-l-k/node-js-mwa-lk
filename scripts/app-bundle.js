define('app',['exports', 'authorization-step'], function (exports, _authorizationStep) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      this.router = router;
      config.title = 'Postillion';
      config.addPipelineStep('authorize', _authorizationStep.AuthorizationStep);
      config.map([{ route: '', redirect: 'home' }, { route: 'home', name: 'home', moduleId: 'welcome-screen', nav: false }, { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'signup', nav: true, title: 'Signup' }, { route: 'account', name: 'account', moduleId: 'edit-account', nav: true, title: 'Edit Account' }, { route: 'tweet', name: 'tweet', moduleId: 'tweet', nav: true, title: 'Postoffice', settings: { logonRequired: true } }, { route: 'management', name: 'management', moduleId: 'management', nav: true, title: 'Management', settings: { restrictedToAdmins: true } }, { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout' }]);
      config.mapUnknownRoutes('not-found');
      config.fallbackRoute('home');
    };

    return App;
  }();
});
define('authorization-step',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AuthorizationStep = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AuthorizationStep = exports.AuthorizationStep = function () {
        function AuthorizationStep() {
            _classCallCheck(this, AuthorizationStep);
        }

        AuthorizationStep.prototype.run = function run(instruction, next) {
            var isRestrictedRoute = instruction.getAllInstructions().some(function (i) {
                return i.config.settings.restrictedToAdmins;
            });

            console.log('Is route restricted ? ' + isRestrictedRoute);
            if (isRestrictedRoute) {
                var isAdmin = false;
                console.log('Is Admin ? ' + isAdmin);
                if (!isAdmin) {
                    alert('Please register as administrator.');
                    console.log('Redirect to login');
                    return next.cancel(new _aureliaRouter.Redirect('login'));
                }
            }

            isRestrictedRoute = instruction.getAllInstructions().some(function (i) {
                return i.config.settings.logonRequired;
            });

            console.log('Is route restricted ? ' + isRestrictedRoute);
            if (isRestrictedRoute) {
                var isValidUser = false;
                console.log('Is valid User ? ' + isValidUser);
                if (!isValidUser) {
                    alert('Please login first.');
                    console.log('Redirect to login');
                    return next.cancel(new _aureliaRouter.Redirect('login'));
                }
            }

            return next();
        };

        return AuthorizationStep;
    }();
});
define('edit-account',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var EditAccount = exports.EditAccount = function EditAccount() {
        _classCallCheck(this, EditAccount);
    };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('login',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Login = exports.Login = function Login() {
        _classCallCheck(this, Login);
    };
});
define('logout',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Logout = exports.Logout = function Logout() {
        _classCallCheck(this, Logout);
    };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('management',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Management = exports.Management = function Management() {
    _classCallCheck(this, Management);
  };
});
define('not-found',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NotFound = exports.NotFound = function NotFound() {
    _classCallCheck(this, NotFound);
  };
});
define('signup',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Signup = exports.Signup = function Signup() {
    _classCallCheck(this, Signup);
  };
});
define('tweet',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Tweet = exports.Tweet = function Tweet() {
    _classCallCheck(this, Tweet);
  };
});
define('welcome-screen',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var WelcomeScreen = exports.WelcomeScreen = function WelcomeScreen() {
    _classCallCheck(this, WelcomeScreen);
  };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"app.css\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\"><span class=\"sr-only\">Toggle Navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-home\"></i> <span>${router.title}</span></a></div><div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\"><ul class=\"nav navbar-nav\"><li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\"><a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=\"loader\" if.bind=\"router.isNavigating\"><i class=\"fa fa-spinner fa-spin fa-2x\"></i></li></ul></div></nav><div class=\"page-host\"><router-view></router-view></div></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = ".page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}"; });
define('text!edit-account.html', ['module'], function(module) { module.exports = "<template><h1>Manage your data</h1></template>"; });
define('text!mwa.css', ['module'], function(module) { module.exports = "body {\r\n\t\t\t\tfont-family:  Arial, Verdana, sans-serif;\r\n\t\t\t\tcolor: #111111;}\r\n.visible {\r\n  visibility: visible;}\r\n\r\n.hidden {\r\n    display: none;\r\n}\r\n\r\nform {\r\n    display: inline-block;\r\n    margin-left: 10px;\r\n}\r\n\r\n\r\ndivv {\r\n  border-bottom: 0px solid #efefef;\r\n  margin: 10px;\r\n  padding-bottom: 0px;\r\n  width: 600px;\r\n}\r\n\r\n.memo {\r\n    border-bottom: 0px solid #efefef;\r\n    margin: 10px;\r\n    padding-bottom: 10px;\r\n    width: 600px;\r\n}\r\n\r\nlegend {\r\n    background-color: #efefef;\r\n    border: 1px solid #dcdcdc;\r\n    border-radius: 10px;\r\n    padding:10px 20px;\r\n    text-align: left;\r\n    margin: 10px;\r\n    width: 600px;\r\n}\r\n\r\n.inputLabel {\r\n    float: left;\r\n    width: 100px;\r\n    text-align: right;\r\n    padding-right: 10px;\r\n}\r\n\r\n.inputField {\r\n    width: 250px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n    background-color: #fffbf0;\r\n\tborder: 1px solid #e7c157;\r\n}\r\n\r\n\r\n.submit {\r\n    text-align: right;\r\n    margin-left: 120px;\r\n}\r\n\r\n/* warnings */\r\n.warning {\r\n    background-image: url('../img/caution.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\n/* hints */\r\n.info {\r\n    background-image: url('../img/information.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\nfieldset[value]:disabled {\r\n    color: whitesmoke;\r\n}\r\n\r\n\r\n/*  ------------  tweet section  ------------  */\r\n/* bird section  */\r\n.bird {\r\n    background-image: url(\"../img/bird.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 200px auto;\r\n    width: 300px; \r\n    height: auto;\r\n    float: middle;\r\n    margin-right: 10px;\r\n    text-align: right top;\r\n}\r\n#nameOfCurrentUser {\r\n\t/*border: 3px dashed #F00;*/\r\n\theight: 180px;\r\n\tpadding: 10px;\r\n\tposition: relative;\r\n    left: 180px;\r\n\ttop: 0;\r\n\twidth: 320px;\r\n}\r\n\r\n\r\n/* message in textaerea */\r\n.tweet {\r\n    font-size: 120%;\r\n    width: 600px;\r\n}\r\n/* hint referring to textaerea */\r\n#charCounter {font-size: 80%;}\r\n#charCounter.warn b, #charCounter.error b {\r\n  border-radius: 16px;\r\n  padding-top: 4px;\r\n  width: 32px;\r\n  height: 28px;\r\n  display: inline-block;\r\n  font-weight: normal;\r\n  text-align: center;\r\n}\r\n.warn b {color: #ffff66; background-color: #333;}\r\n.error b {color: #ff9966; background-color: #000;}\r\n\r\n/* attached image */\r\n#camera {\r\n    position: 280px  center; \r\n}\r\n\r\n.attachedImage .preview {\r\n    width: 300px; \r\n    height: auto;\r\n    border: 1px solid #000;\r\n}\r\n\r\n.tweetDefinition {\r\n    width: 600px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n}\r\n\r\n.postTweet {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.filterTweets  {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.vipField {\r\n    border: none;\r\n    margin-left: 45px;\r\n    width: 555px;\r\n    text-align: left;\r\n}\r\n\r\n/* Character Counter */\r\n#charactersLeft {\r\n  color: #fff;\r\n  font-size: 24px;}\r\n#lastKey {\r\n  color: #fff;\r\n  margin-top: 10px;}\r\n\r\n.radio1 {\r\n    float: none;\r\n    margin-left: 35px;\r\n    font-size: 70%;\r\n}\r\n\r\n.radio11 {\r\n    float: none;\r\n    margin-left: 120px;\r\n    font-size: 80%;\r\n}\r\n\r\n/* ------------ data table ------------ */\r\nfieldset.tweetsTable fieldset.admTweetsTable {\r\n    border: none;\r\n}\r\ntable {\r\n    width: 600px;\r\n}\r\n\r\nth, td {\r\n    padding: 7px 10px 10px 10px;\r\n}\r\nth {\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.1em;\r\n    font-size: 90%;\r\n    border-bottom: 2px solid #111111;\r\n    border-top: 1px solid #999;\r\n    text-align: left;\r\n}\r\ntd {\r\n    font-size: 70%;\r\n}\r\ntr.even {\r\n    background-color: #efefef;\r\n}\r\ntd.summary {\r\n    text-transform: uppercase;\r\n    font-size: 90%;\r\n    border-top: 2px solid #111111;\r\n    border-bottom: 1px solid #999;\r\n}\r\ntr:hover {\r\n    background-color: #c3e6e5;\r\n}\r\ntr.selected {\r\n    background-color: #acbad9;\r\n    color: #FFF;\r\n}\r\ntr.even.selected {\r\n    background-color: #acbad1;\r\n    color: #FFF;\r\n}\r\n\r\n/* ------------ footer ------------ */\r\nfooter {\r\n    font-size: 80%;\r\n    background-color: mediumaquamarine;\r\n}\r\n\r\n.contact {\r\n    padding-top: 10px;\r\n}"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template><h1>Login</h1></template>"; });
define('text!logout.html', ['module'], function(module) { module.exports = "<template><h1>Thank you for using Postillion - Bye for now!</h1></template>"; });
define('text!management.html', ['module'], function(module) { module.exports = "<template><h1>Management</h1></template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Something is broken…</h1><p>The page cannot be found.</p></section></template>"; });
define('text!signup.html', ['module'], function(module) { module.exports = "<template><h1>Signup</h1></template>"; });
define('text!tweet.html', ['module'], function(module) { module.exports = "<template><h1>Tweet</h1></template>"; });
define('text!welcome-screen.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><div class=\"memo\"><h2>Welcome to Postillion!</h2></div><fieldset><legend class=\"legend\"><h3>A Modern Web Application & Services using Node.js</h3><h3>Implemented as <abbr title=\"Single Page Application\">SPA</abbr>, based on Aurelia, Hapi and Heroku</h3><h3>Course - de Leastar</h3><h3><abbr title=\"Ostbayerische Technische Hochschule\">OTH</abbr> Regensburg, <abbr title=\"Medizinische Informatik\">IM</abbr> WiSe 16/17</h3></legend></fieldset></template>"; });
//# sourceMappingURL=app-bundle.js.map