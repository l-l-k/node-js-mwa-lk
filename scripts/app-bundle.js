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
      config.map([{ route: '', redirect: 'home' }, { route: 'home', name: 'home', moduleId: 'welcome-screen', nav: false }, { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'signup', nav: true, title: 'Signup' }, { route: 'account', name: 'account', moduleId: 'edit-account', nav: true, title: 'Edit Account' }, { route: 'tweet', name: 'tweet', moduleId: 'tweet', nav: true, title: 'Postoffice', settings: { logonRequired: true } }, { route: 'management', name: 'management', moduleId: 'management', nav: true, title: 'Management', settings: { restrictedToAdmins: true } }, { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout', settings: { logoutRequired: true } }]);
      config.mapUnknownRoutes('not-found');
      config.fallbackRoute('home');
    };

    return App;
  }();
});
define('authorization-step',['exports', 'aurelia-framework', 'aurelia-router', './models/user'], function (exports, _aureliaFramework, _aureliaRouter, _user) {
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

    var _dec, _class;

    var AuthorizationStep = exports.AuthorizationStep = (_dec = (0, _aureliaFramework.inject)(_user.User), _dec(_class = function () {
        function AuthorizationStep(user) {
            _classCallCheck(this, AuthorizationStep);

            this.user = user;
        }

        AuthorizationStep.prototype.run = function run(instruction, next) {
            console.log("Checking route permissions of user " + this.user.mail);
            var instructions = instruction.getAllInstructions();

            var isRestrictedRoute = instructions.some(function (i) {
                return i.config.settings.restrictedToAdmins;
            });

            console.log('Is route restricted for admins ? ' + isRestrictedRoute);
            if (isRestrictedRoute) {
                console.log(this.user.toString());
                var isAdmin = this.user.isAdmin;
                console.log('Is Admin ? ' + isAdmin);
                if (!isAdmin) {
                    alert('Please register as administrator.');
                    console.log('Redirect to login');
                    return next.cancel(new _aureliaRouter.Redirect('login'));
                }
            }

            isRestrictedRoute = instructions.some(function (i) {
                return i.config.settings.logonRequired;
            });

            console.log('Does route require login ? ' + isRestrictedRoute);
            if (isRestrictedRoute) {
                console.log(this.user.toString());
                var isValidUser = this.user.isAuthenticated;
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
    }()) || _class);
});
define('edit-account',['exports', 'aurelia-framework', './services/user-gateway', './models/user'], function (exports, _aureliaFramework, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EditAccount = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var EditAccount = exports.EditAccount = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _user.User), _dec(_class = function () {
        function EditAccount(userGateway, user) {
            _classCallCheck(this, EditAccount);

            this.isBusy = false;
            this.validationFailed = false;
            this.addressExists = false;
            this.nameExists = false;
            this.isValidPassword = true;

            this.userGateway = userGateway;
            this.user = user;
            this.temporaryUser = _aureliaFramework.NewInstance.of(_user.User);
            this.temporaryUser.mail = this.user.mail;
            this.temporaryUser.name = this.user.name;
            this.temporaryUser.password = this.user.password;
        }

        EditAccount.prototype.applyChanges = function applyChanges() {
            var msg1 = "Original user : " + this.user.toString();
            console.log(msg1);
            var msg = "Input :  " + this.temporaryUser.mail + " " + this.temporaryUser.name + " " + this.temporaryUser.password;
            console.log(msg);

            this.validateInputFields();
            if (this.validationFailed) {
                console.log("Input-Validation failed : Empty fields");
                return;
            }

            if (!this.hasValidChanges()) {
                return;
            }

            if (this.userGateway.update(this.user, this.temporaryUser)) {
                this.user.mail = this.temporaryUser.mail;
                this.user.name = this.temporaryUser.name;
                this.user.password = this.temporaryUser.password;

                console.log("Changed user data : " + this.user.toString());
            }
        };

        EditAccount.prototype.validateInputFields = function validateInputFields() {
            this.validationFailed = this.temporaryUser.mail.length == 0 || this.temporaryUser.name.length == 0 || this.temporaryUser.password.length == 0;
        };

        EditAccount.prototype.hasValidChanges = function hasValidChanges() {
            var hasAdressChanged = this.user.mail.toLwerCase() !== this.temporaryUser.mail.toLwerCase();
            var hasNameChanged = this.user.name.toLwerCase() !== this.temporaryUser.name.toLwerCase();
            var hasPasswordChanged = this.user.password !== this.temporaryUser.password;

            var hasChanges = hasAdressChanged || hasNameChanged || hasPasswordChanged;
            if (!hasChanges) {
                console.log("Input-Validation result : No changes");
                return false;
            }

            var anyUser = _user.User;
            if (hasAdressChanged) {
                anyUser = this.userGateway.getByMailAddress(this.temporaryUser.mailAddress);
                this.addressExists = this.user.id !== anyUser.id;
            }

            if (hasNameChanged) {
                anyUser = this.userGateway.getByName(this.temporaryUser.name);
                this.nameExists = this.user.id !== anyUser.id;
            }

            if (addressExists || nameExists || !hasPasswordChanged) {
                console.log("Input-Validation result : Invalid changes");
                return false;
            }
        };

        return EditAccount;
    }()) || _class);
});
define('environment',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true,
    usersUrl: 'http://localhost:3000/'
  };
});
define('login',['exports', 'aurelia-framework', './services/user-gateway', './models/user'], function (exports, _aureliaFramework, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _user.User), _dec(_class = function () {
        function Login(userGateway, user) {
            _classCallCheck(this, Login);

            this.isBusy = false;
            this.validationFailed = false;
            this.addressExists = true;
            this.isValidPassword = true;

            this.userGateway = userGateway;
            this.user = user;
        }

        Login.prototype.performLogin = function performLogin() {
            var msg = "Before Login : " + this.user.toString();
            console.log(msg);

            this.validationFailed = this.user.mail.length == 0 || this.user.password.length == 0;
            if (this.validationFailed) {
                console.log("Input-Validation failed : Empty fields");
                return;
            }

            this.user.isAuthenticated = true;
            this.user.isAdmin = true;


            msg = "After Login : " + this.user.toString();
            console.log(msg);
        };

        return Login;
    }()) || _class);
});
define('logout',['exports', 'aurelia-framework', './models/user'], function (exports, _aureliaFramework, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Logout = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_user.User), _dec(_class = function () {
        function Logout(user) {
            _classCallCheck(this, Logout);

            this.user = user;
            console.log("Logout Route initialised with " + this.user.mail);
        }

        Logout.prototype.activate = function activate() {
            console.log("activated: Logout " + this.user.mail);
            if (this.user !== null) {
                console.log("Before Reset: " + this.user.mail);
                this.user.reset();
                console.log("After Reset: " + this.user.mail);
            }
        };

        return Logout;
    }()) || _class);
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
    aurelia.use.standardConfiguration().plugin('aurelia-validation').feature('resources');

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
define('signup',['exports', 'aurelia-framework', './services/user-gateway', './models/user'], function (exports, _aureliaFramework, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Signup = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _user.User), _dec(_class = function () {
        function Signup(userGateway, user, validationController) {
            _classCallCheck(this, Signup);

            this.isBusy = false;
            this.validationFailed = false;
            this.addressExists = false;
            this.nameExists = false;
            this.isValidPassword = true;

            this.userGateway = userGateway;
            this.user = user;
        }

        Signup.prototype.performSignup = function performSignup() {
            var msg = "Signup  " + this.user.toString();
            console.log(msg);

            this.validationFailed = this.user.mail.length == 0 || this.user.name.length == 0 || this.user.password.length == 0;
            if (this.validationFailed) {
                console.log("Input-Validation failed");

                return;
            }

            var existingUser = this.userGateway.getByMailAddress(this.user.mailAddress);

            this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
            this.nameExists = existingUser.name != null && existingUser.name.length > 0;

            if (!addressExists && !nameExists) {
                this.userGateway.add(this.user);
            }
        };

        return Signup;
    }()) || _class);
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
define('models/broadcast',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Tweet = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Tweet = exports.Tweet = function () {
        Tweet.fromObject = function fromObject(src) {
            var user = Object.assign(new Tweet(), src);
            return user;
        };

        function Tweet() {
            _classCallCheck(this, Tweet);

            this.message = '';
            this.image = '';
            this.timestamp = '';
            this.id = '';

            _aureliaValidation.ValidationRules.on(this);
        }

        return Tweet;
    }();
});
define('models/user',['exports', './toolkit'], function (exports, _toolkit) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.User = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var User = exports.User = function () {
        User.fromObject = function fromObject(src) {
            var user = Object.assign(new User(), src);
            return user;
        };

        function User() {
            _classCallCheck(this, User);

            this.mail = 'a@b.c';
            this.name = 'otto';
            this.password = '1';
            this.id = "0";
            this.isAuthenticated = false;
            this.isAdmin = false;
            this.vips = [];
            this.nips = [];

            var tool = new _toolkit.Toolkit();
            this.id = tool.createGuid();
            console.log("User created : " + this.toString());
        }

        User.prototype.toString = function toString() {
            var msg = "Current user (ID = " + this.id + ") : " + this.mail + " " + this.name + " " + this.password;
            return msg;
        };

        User.prototype.reset = function reset() {
            this.mail = '';
            this.name = '';
            this.password = '';
            this.id = '0';

            this.isAuthenticated = false;
            this.isAdmin = false;

            this.vips = [];
            this.nips = [];
        };

        return User;
    }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/user-gateway',['exports', 'aurelia-framework', 'aurelia-fetch-client', './../models/user', './../environment'], function (exports, _aureliaFramework, _aureliaFetchClient, _user, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserGateway = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserGateway = exports.UserGateway = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
        function UserGateway(httpClient) {
            _classCallCheck(this, UserGateway);
        }

        UserGateway.prototype.add = function add(user) {};

        UserGateway.prototype.update = function update(currentUser, modifiedUser) {
            var success = true;

            if (currentUser.mail.toLwerCase() !== modifiedUser.mail.toLwerCase()) {
                var existingUser = getByMailAddress(modifi);
            }
            var hasChanges = this.user.mail.toLwerCase() !== this.temporaryUser.mail.toLwerCase() || this.user.name.toLwerCase() !== this.temporaryUser.name.toLwerCase() || this.user.password !== this.temporaryUser.password;

            var existingUser = getByMailAddress(modifi);
            return success;
        };

        UserGateway.prototype.verify = function verify(user) {
            console.log("Called : getLoginDummy");
            var existingUser = _aureliaFramework.NewInstance.of(_user.User);
            existingUser.mail = 'm@w.a';
            console.log("Created : " + existingUser.mail);
            existingUser.name = 'dummy';
            existingUser.password = '1';
            existingUser.id = '1';

            existingUser.isAuthenticated = true;
            existingUser.isAdmin = false;
            var msg = "Return : " + existingUser.isAuthenticated;
            console.log(msg);

            return existingUser.isAuthenticated;
        };

        UserGateway.prototype.getByMailAddress = function getByMailAddress(mailAddress) {
            var existingUser = _aureliaFramework.NewInstance.of(_user.User);

            return existingUser;
        };

        UserGateway.prototype.getByName = function getByName(name) {
            var existingUser = _aureliaFramework.NewInstance.of(_user.User);

            return existingUser;
        };

        UserGateway.prototype.getAll = function getAll() {
            return this.httpClient.fetch('users').then(function (response) {
                return response.json();
            }).then(function (dto) {
                return dto.map(_user.User.fromObject);
            });
        };

        UserGateway.prototype.getById = function getById(id) {
            return this.httpClient.fetch('users/' + id).then(function (response) {
                return response.json();
            }).then(_user.User.fromObject);
        };

        return UserGateway;
    }()) || _class);
});
define('validation/index',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;
    function configure(config) {
        config.plugin('aurelia-validation');
    }
});
define('resources/elements/account-detail',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AccountDetail = exports.AccountDetail = function () {
        function AccountDetail() {
            _classCallCheck(this, AccountDetail);
        }

        AccountDetail.prototype.activate = function activate(temporaryUser) {
            this.user = temporaryUser;
        };

        return AccountDetail;
    }();
});
define('models/toolkit',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Toolkit = exports.Toolkit = function () {
        function Toolkit() {
            _classCallCheck(this, Toolkit);
        }

        Toolkit.prototype.createGuid = function createGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        };

        Toolkit.prototype.getDay = function getDay() {
            var now = new Date();
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var day = ("0" + now.getDate()).slice(-2);
            return now.getFullYear() + "-" + month + "-" + day;
        };

        Toolkit.prototype.getTime = function getTime() {
            var now = new Date();
            return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        };

        Toolkit.prototype.isEven = function isEven(number) {
            return number % 2 == 0;
        };

        Toolkit.prototype.resetSelectionRange = function resetSelectionRange() {
            selectionRange = [-1, -1];
        };

        return Toolkit;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"app.css\"></require><compose view=\"nav-bar-main.html\"></compose><div class=\"page-host\"><router-view></router-view></div></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = ".page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}"; });
define('text!edit-account.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><form submit.delegate=\"applyChanges()\"><compose view-model=\"./resources/elements/account-detail\" model.bind=\"temporaryUser\"></compose><br><br><input id=\"subscribe\" class=\"submit\" type=\"submit\" name=\"subscribe\" value=\"Update Account\" disabled.bind=\"isBusy\"><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></template>"; });
define('text!mwa.css', ['module'], function(module) { module.exports = "body {\r\n\t\t\t\tfont-family:  Arial, Verdana, sans-serif;\r\n\t\t\t\tcolor: #111111;}\r\n.visible {\r\n  visibility: visible;}\r\n\r\n.hidden {\r\n    display: none;\r\n}\r\n\r\nform {\r\n    display: inline-block;\r\n    margin-left: 10px;\r\n}\r\n\r\n\r\ndivv {\r\n  border-bottom: 0px solid #efefef;\r\n  margin: 10px;\r\n  padding-bottom: 0px;\r\n  width: 600px;\r\n}\r\n\r\n.memo {\r\n    border-bottom: 0px solid #efefef;\r\n    margin: 10px;\r\n    padding-bottom: 10px;\r\n    width: 600px;\r\n}\r\n\r\nlegend {\r\n    background-color: #efefef;\r\n    border: 1px solid #dcdcdc;\r\n    border-radius: 10px;\r\n    padding:10px 20px;\r\n    text-align: left;\r\n    margin: 10px;\r\n    width: 600px;\r\n}\r\n\r\n.inputLabel {\r\n    float: left;\r\n    width: 120px;\r\n    text-align: right;\r\n    padding-right: 10px;\r\n}\r\n\r\n.inputField {\r\n    width: 270px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n    background-color: #fffbf0;\r\n\tborder: 1px solid #e7c157;\r\n}\r\n\r\n\r\n.submit {\r\n    text-align: right;\r\n    margin-left: 130px;\r\n}\r\n.submitNotification {\r\n    text-align: left;\r\n    margin-left: 130px;\r\n}\r\n\r\n/* warnings */\r\n.warning {\r\n    background-image: url('../img/caution.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\n/* hints */\r\n.info {\r\n    background-image: url('../img/information.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\nfieldset[value]:disabled {\r\n    color: whitesmoke;\r\n}\r\n\r\n\r\n/*  ------------  tweet section  ------------  */\r\n/* bird section  */\r\n.bird {\r\n    background-image: url(\"../img/bird.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 200px auto;\r\n    width: 300px; \r\n    height: auto;\r\n    float: middle;\r\n    margin-right: 10px;\r\n    text-align: right top;\r\n}\r\n#nameOfCurrentUser {\r\n\t/*border: 3px dashed #F00;*/\r\n\theight: 180px;\r\n\tpadding: 10px;\r\n\tposition: relative;\r\n    left: 180px;\r\n\ttop: 0;\r\n\twidth: 320px;\r\n}\r\n\r\n\r\n/* message in textaerea */\r\n.tweet {\r\n    font-size: 120%;\r\n    width: 600px;\r\n}\r\n/* hint referring to textaerea */\r\n#charCounter {font-size: 80%;}\r\n#charCounter.warn b, #charCounter.error b {\r\n  border-radius: 16px;\r\n  padding-top: 4px;\r\n  width: 32px;\r\n  height: 28px;\r\n  display: inline-block;\r\n  font-weight: normal;\r\n  text-align: center;\r\n}\r\n.warn b {color: #ffff66; background-color: #333;}\r\n.error b {color: #ff9966; background-color: #000;}\r\n\r\n/* attached image */\r\n#camera {\r\n    position: 280px  center; \r\n}\r\n\r\n.attachedImage .preview {\r\n    width: 300px; \r\n    height: auto;\r\n    border: 1px solid #000;\r\n}\r\n\r\n.tweetDefinition {\r\n    width: 600px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n}\r\n\r\n.postTweet {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.filterTweets  {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.vipField {\r\n    border: none;\r\n    margin-left: 45px;\r\n    width: 555px;\r\n    text-align: left;\r\n}\r\n\r\n/* Character Counter */\r\n#charactersLeft {\r\n  color: #fff;\r\n  font-size: 24px;}\r\n#lastKey {\r\n  color: #fff;\r\n  margin-top: 10px;}\r\n\r\n.radio1 {\r\n    float: none;\r\n    margin-left: 35px;\r\n    font-size: 70%;\r\n}\r\n\r\n.radio11 {\r\n    float: none;\r\n    margin-left: 120px;\r\n    font-size: 80%;\r\n}\r\n\r\n/* ------------ data table ------------ */\r\nfieldset.tweetsTable fieldset.admTweetsTable {\r\n    border: none;\r\n}\r\ntable {\r\n    width: 600px;\r\n}\r\n\r\nth, td {\r\n    padding: 7px 10px 10px 10px;\r\n}\r\nth {\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.1em;\r\n    font-size: 90%;\r\n    border-bottom: 2px solid #111111;\r\n    border-top: 1px solid #999;\r\n    text-align: left;\r\n}\r\ntd {\r\n    font-size: 70%;\r\n}\r\ntr.even {\r\n    background-color: #efefef;\r\n}\r\ntd.summary {\r\n    text-transform: uppercase;\r\n    font-size: 90%;\r\n    border-top: 2px solid #111111;\r\n    border-bottom: 1px solid #999;\r\n}\r\ntr:hover {\r\n    background-color: #c3e6e5;\r\n}\r\ntr.selected {\r\n    background-color: #acbad9;\r\n    color: #FFF;\r\n}\r\ntr.even.selected {\r\n    background-color: #acbad1;\r\n    color: #FFF;\r\n}\r\n\r\n/* ------------ footer ------------ */\r\nfooter {\r\n    font-size: 80%;\r\n    background-color: mediumaquamarine;\r\n}\r\n\r\n.contact {\r\n    padding-top: 10px;\r\n}"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><form submit.delegate=\"performLogin()\"><compose view=\"./resources/elements/login-data.html\"></compose></form></template>"; });
define('text!logout.html', ['module'], function(module) { module.exports = "<template><h1>Thank you for using Postillion - Bye for now!</h1></template>"; });
define('text!management.html', ['module'], function(module) { module.exports = "<template><h1>Management</h1></template>"; });
define('text!nav-bar-main.html', ['module'], function(module) { module.exports = "<template><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\"><span class=\"sr-only\">Toggle Navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-home\"></i> <span>${router.title}</span></a></div><div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\"><ul class=\"nav navbar-nav\"><li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\"><a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=\"loader\" if.bind=\"router.isNavigating\"><i class=\"fa fa-spinner fa-spin fa-2x\"></i></li></ul></div></nav></template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Something is broken…</h1><p>The page cannot be found.</p></section></template>"; });
define('text!signup.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><form submit.delegate=\"performSignup()\"><compose view=\"./resources/elements/account-detail.html\"></compose><br><br><input id=\"subscribe\" class=\"submit\" type=\"submit\" name=\"subscribe\" value=\"Create Account\" disabled.bind=\"isBusy\"><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></template>"; });
define('text!tweet.html', ['module'], function(module) { module.exports = "<template><h1>Tweet</h1></template>"; });
define('text!welcome-screen.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><div class=\"memo\"><h2>Welcome to Postillion!</h2></div><compose view=\"./resources/elements/blurb.html\"></compose></template>"; });
define('text!resources/elements/account-detail.html', ['module'], function(module) { module.exports = "<template><fieldset disabled.bind=\"isBusy\"><form><div><br><br><label for=\"mailAddress\" class=\"inputLabel\">Login-Name :</label><input id=\"mailAddress\" type=\"email\" name=\"mailAddress\" class=\"inputField\" placeholder=\"Type in a valid mail address ...\" required value.bind=\"user.mail\"><div show.bind=\"addressExists\">Address already exists.</div><br><br><label for=\"username\" class=\"inputLabel\">Username :</label><input id=\"username\" type=\"text\" name=\"username\" class=\"inputField\" minlength=\"2\" placeholder=\"Type in a name ...\" required value.bind=\"user.name\"><div show.bind=\"nameExists\">Name already exists. Please choose another.</div><br><br><label for=\"password\" class=\"inputLabel\">Password :</label><input type=\"password\" name=\"password\" class=\"inputField\" placeholder=\"Type in a password ...\" minlength=\"1\" maxlength=\"100\" required value.bind=\"user.password\"><div hide.bind=\"isValidPassword\">Please choose a more complex password</div></div></form></fieldset></template>"; });
define('text!resources/elements/blurb.html', ['module'], function(module) { module.exports = "<template><fieldset><legend class=\"note\"><h3>A Modern Web Application & Services using Node.js</h3><h3>Implemented as <abbr title=\"Single Page Application\">SPA</abbr>, based on Aurelia, Hapi and Heroku</h3><h3>Course - de Leastar</h3><h3><abbr title=\"Ostbayerische Technische Hochschule\">OTH</abbr> Regensburg, <abbr title=\"Medizinische Informatik\">IM</abbr> WiSe 16/17</h3></legend></fieldset></template>"; });
define('text!resources/elements/login-data.html', ['module'], function(module) { module.exports = "<template><fieldset><form><div><br><br><label for=\"mailAddress\" class=\"inputLabel\">Login-Name :</label><input id=\"mailAddress\" type=\"email\" name=\"mailAddress\" class=\"inputField\" placeholder=\"Type in your mail address ...\" required value.bind=\"user.mail\"><div hide.bind=\"addressExists\">Address unknown.</div><br><br><label for=\"password\" class=\"inputLabel\">Password :</label><input type=\"password\" name=\"password\" class=\"inputField\" placeholder=\"Type in your password ...\" required value.bind=\"user.password\"><div hide.bind=\"isValidPassword\">Invalid Password. Try again ...</div></div></form><br><br><input class=\"submit\" type=\"submit\" name=\"login\" value=\"Login\"><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></fieldset></template>"; });
//# sourceMappingURL=app-bundle.js.map