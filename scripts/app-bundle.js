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
      config.map([{ route: '', redirect: 'home' }, { route: 'home', name: 'home', moduleId: 'welcome-screen', nav: false }, { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'signup', nav: true, title: 'Signup' }, { route: 'account', name: 'account', moduleId: 'edit-account', nav: true, title: 'Edit Account' }, { route: 'tweet', name: 'tweet', moduleId: 'tweet', nav: true, title: 'Postoffice', settings: { logonRequired: true } }, { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout', settings: { logoutRequired: true } }]);
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

            var isRestrictedRoute = false;


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
    aurelia.use.standardConfiguration().plugin('aurelia-validation').feature('validation').feature('resources').feature('administration');

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
        function Signup(userGateway, user) {
            _classCallCheck(this, Signup);

            this.isBusy = false;
            this.validationFailed = false;
            this.addressExists = false;
            this.nameExists = false;
            this.isValidPassword = true;

            this.userGateway = userGateway;
            this.user = user;
            this.newUser = _aureliaFramework.NewInstance.of(_user.User);
            this.newUser.mail = "";
            this.newUser.name = "";
            this.newUser.password = "";
        }

        Signup.prototype.save = function save() {
            console.log("W");
            alert('SAVE');

            return this.newUser;
        };

        Signup.prototype.performSignup = function performSignup() {
            var msg = "Signup  " + this.newUser.toString();
            console.log(msg);

            this.validationFailed = this.newUser.mail.length == 0 || this.newUser.name.length == 0 || this.newUser.password.length == 0;
            if (this.validationFailed) {
                console.log("Input-Validation failed");

                return;
            }

            var existingUser = this.userGateway.getByMailAddress(this.newUser.mailAddress);

            this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
            this.nameExists = existingUser.name != null && existingUser.name.length > 0;

            if (!addressExists && !nameExists) {
                this.userGateway.add(this.newUser);
            }

            this.router.navigateToRoute('login');
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
define('x',['exports', 'aurelia-framework', './services/user-gateway', './models/user'], function (exports, _aureliaFramework, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.X = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var X = exports.X = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _user.User), _dec(_class = function () {
        function X(userGateway, user) {
            _classCallCheck(this, X);

            this.isBusy = false;
            this.validationFailed = false;
            this.addressExists = false;
            this.nameExists = false;
            this.isValidPassword = true;

            this.userGateway = userGateway;
            this.user = user;
            this.newUser = _aureliaFramework.NewInstance.of(_user.User);
            this.newUser.mail = "";
            this.newUser.name = "";
            this.newUser.password = "";
        }

        X.prototype.performSignup = function performSignup() {
            var msg = "Signup  " + newUser.user.toString();
            console.log(msg);

            this.validationFailed = this.newUser.mail.length == 0 || this.newUser.name.length == 0 || this.newUser.password.length == 0;
            if (this.validationFailed) {
                console.log("Input-Validation failed");

                return;
            }

            var existingUser = this.userGateway.getByMailAddress(this.newUser.mailAddress);

            this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
            this.nameExists = existingUser.name != null && existingUser.name.length > 0;

            if (!addressExists && !nameExists) {
                this.userGateway.add(this.newUser);
            }
        };

        return X;
    }()) || _class);
});
define('administration/index',['exports', 'aurelia-router'], function (exports, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;
    function configure(config) {
        var router = config.container.get(_aureliaRouter.Router);
        router.addRoute({
            route: 'administration', name: 'administration', moduleId: 'administration/main', nav: true, title: 'Administration'
        });
    }
});
define('administration/main',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Administration = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Administration = exports.Administration = (_dec = (0, _aureliaFramework.inlineView)('<template><router-view></router-view></template>'), _dec(_class = function () {
        function Administration() {
            _classCallCheck(this, Administration);
        }

        Administration.prototype.configureRouter = function configureRouter(config) {
            config.map([{ route: '', name: 'administration', moduleId: './components/admin-menu', title: '' }, { route: 'populate', name: 'populate', moduleId: './components/populate', title: 'Add User' }, { route: 'cleanup', name: 'cleanup', moduleId: './components/cleanup', title: "Cleanup" }, { route: 'statistics', name: 'statistics', moduleId: './components/statistics', title: "Statistics" }]);
        };

        return Administration;
    }()) || _class);
});
define('models/message',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Message = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Message = exports.Message = function () {
        Message.fromObject = function fromObject(src) {
            var msg = Object.assign(new Message(), src);
            return msg;
        };

        function Message() {
            _classCallCheck(this, Message);

            this.text = 'My very first tweet';
            this.image = null;
            this.day = '';
            this.time = '';
            this.userId = '';
        }

        Message.prototype.reset = function reset() {
            text = '';
            image = null;
            day = '';
            time = '';
            userId = '';
        };

        return Message;
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
            this.isAdmin = true;
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

        User.prototype.becomeFollower = function becomeFollower(id, isVeryImportantPerson) {
            if (isVeryImportantPerson) {
                this.vips.push(id);
            } else {
                this.nips.push(id);
            }
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
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./attributes/submit-task', './elements/group-list.html', './elements/list-editor', './elements/account-detail.html', './elements/login-data.html', './elements/submit-button.html', './value-converters/filter-by', './value-converters/group-by', './value-converters/order-by']);
  }
});
define('services/broadcast-gateway',['exports', 'aurelia-framework', 'aurelia-http-client', './user-gateway', './../models/user', './../environment'], function (exports, _aureliaFramework, _aureliaHttpClient, _userGateway, _user, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BroadcastGateway = undefined;

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

    var BroadcastGateway = exports.BroadcastGateway = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _userGateway.UserGateway), _dec(_class = function () {
        function BroadcastGateway(httpClient, userGateway) {
            _classCallCheck(this, BroadcastGateway);

            this.httpClient = httpClient.configure(function (config) {
                config.withBaseUrl(_environment2.default.usersUrl);
            });
            this.userGateway = userGateway;
        }

        BroadcastGateway.prototype.addVIP = function addVIP(myID, vipName) {
            var ToFollow = this.userGateway.getByName(vipName);

            var x;
            this.httpClient.get('/FollowerAdd/' + myID + '/' + ToFollow.id).then(function (res) {
                x = res.content;
                console.log(x);
                return x;
            });
        };

        BroadcastGateway.prototype.removeVIP = function removeVIP(myID, vipName) {
            var ToUnFollow = this.userGateway.getByName(vipName);
            var x;
            this.httpClient.get('/FollowerRemove/' + myID + '/' + ToUnFollow.id).then(function (res) {
                x = res.content;
                console.log(x);
                return x;
            });
        };

        BroadcastGateway.prototype.updateVIPStatus = function updateVIPStatus(myID, vipName, isVeryImportant) {
            var PriorityChanger = this.userGateway.getByName(vipName);

            var x;
            this.httpClient.get('/FollowerActivate/' + myID + '/' + PriorityChanger.id + '/' + isVeryImportant).then(function (res) {
                x = res.content;
                console.log(x);
                return x;
            });
        };

        return BroadcastGateway;
    }()) || _class);
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

            this.httpClient = httpClient.configure(function (config) {
                config.useStandardConfiguration().withBaseUrl(_environment2.default.usersUrl);
            });
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

            var x = this.httpClient.fetch('test').then(function (response) {
                return response.json();
            }).then(_user.User.fromObject);
            return x;
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
define('validation/bootstrap-form-validation-renderer',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BootstrapFormValidationRenderer = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var BootstrapFormValidationRenderer = exports.BootstrapFormValidationRenderer = function () {
    function BootstrapFormValidationRenderer() {
      _classCallCheck(this, BootstrapFormValidationRenderer);
    }

    BootstrapFormValidationRenderer.prototype.render = function render(instruction) {
      for (var _iterator = instruction.unrender, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var _ref5 = _ref2;
        var error = _ref5.error,
            elements = _ref5.elements;

        for (var _iterator3 = elements, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref6;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref6 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref6 = _i3.value;
          }

          var element = _ref6;

          this.remove(element, error);
        }
      }

      for (var _iterator2 = instruction.render, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref4 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref4 = _i2.value;
        }

        var _ref7 = _ref4;
        var error = _ref7.error,
            elements = _ref7.elements;

        for (var _iterator4 = elements, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
          var _ref8;

          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            _ref8 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            _ref8 = _i4.value;
          }

          var _element = _ref8;

          this.add(_element, error);
        }
      }
    };

    BootstrapFormValidationRenderer.prototype.add = function add(element, error) {
      var formGroup = element.closest('.form-group');
      if (!formGroup) {
        return;
      }

      formGroup.classList.add('has-error');

      var message = document.createElement('span');
      message.className = 'help-block validation-message';
      message.textContent = error.message;
      message.id = 'bs-validation-message-' + error.id;
      element.parentNode.insertBefore(message, element.nextSibling);
    };

    BootstrapFormValidationRenderer.prototype.remove = function remove(element, error) {
      var formGroup = element.closest('.form-group');
      if (!formGroup) {
        return;
      }

      var message = formGroup.querySelector('#bs-validation-message-' + error.id);
      if (message) {
        element.parentNode.removeChild(message);

        if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
          formGroup.classList.remove('has-error');
        }
      }
    };

    return BootstrapFormValidationRenderer;
  }();
});
define('validation/index',['exports', './bootstrap-form-validation-renderer', './rules'], function (exports, _bootstrapFormValidationRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.plugin('aurelia-validation');

    config.container.registerHandler('bootstrap-form', function (container) {
      return container.get(_bootstrapFormValidationRenderer.BootstrapFormValidationRenderer);
    });
  }
});
define('validation/rules',['aurelia-validation'], function (_aureliaValidation) {
  'use strict';

  _aureliaValidation.ValidationRules.customRule('date', function (value, obj) {
    return value === null || value === undefined || value === '' || !isNaN(Date.parse(value));
  }, '${$displayName} must be a valid date.');

  _aureliaValidation.ValidationRules.customRule('notEmpty', function (value, obj) {
    return value && value.length && value.length > 0;
  }, '${$displayName} must contain at least one item.');

  _aureliaValidation.ValidationRules.customRule('maxFileSize', function (value, obj, maxSize) {
    return !(value instanceof FileList) || value.length === 0 || Array.from(value).every(function (file) {
      return file.size <= maxSize;
    });
  }, '${$displayName} must be smaller than ${$config.maxSize} bytes.', function (maxSize) {
    return { maxSize: maxSize };
  });

  function hasOneOfExtensions(file, extensions) {
    var fileName = file.name.toLowerCase();
    return extensions.some(function (ext) {
      return fileName.endsWith(ext);
    });
  }

  function allHaveOneOfExtensions(files, extensions) {
    extensions = extensions.map(function (ext) {
      return ext.toLowerCase();
    });
    return Array.from(files).every(function (file) {
      return hasOneOfExtensions(file, extensions);
    });
  }

  _aureliaValidation.ValidationRules.customRule('fileExtension', function (value, obj, extensions) {
    return !(value instanceof FileList) || value.length === 0 || allHaveOneOfExtensions(value, extensions);
  }, '${$displayName} must have one of the following extensions: ${$config.extensions.join(\', \')}.', function (extensions) {
    return { extensions: extensions };
  });
});
define('administration/components/admin-menu',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AdminMenu = exports.AdminMenu = function () {
        function AdminMenu() {
            _classCallCheck(this, AdminMenu);
        }

        AdminMenu.prototype.tryAddUser = function tryAddUser() {};

        AdminMenu.prototype.tryDeleteUser = function tryDeleteUser() {
            if (confirm('Do you want to delete this user and all of his broadcasts?')) {}
        };

        return AdminMenu;
    }();
});
define('administration/components/cleanup-content',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var CleanupContent = exports.CleanupContent = function CleanupContent() {
        _classCallCheck(this, CleanupContent);
    };
});
define('administration/components/cleanup',['exports', 'aurelia-framework', 'aurelia-validation', './../../services/user-gateway', './../../models/user'], function (exports, _aureliaFramework, _aureliaValidation, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Cleanup = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Cleanup = exports.Cleanup = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function Cleanup(userGateway, validationController) {
            _classCallCheck(this, Cleanup);

            this.validationFailed = false;
            this.displayMessages = false;

            this.userGateway = userGateway;
            this.validationController = validationController;
            this.temporaryUser = _aureliaFramework.NewInstance.of(_user.User);
            this.temporaryUser.name = "X";
            this.temporaryUser.mail = 'a@b.c';
            this.temporaryUser.password = '1';
        }

        Cleanup.prototype.activateUser = function activateUser() {
            console.log("Activate user " + this.temporaryUser.name + " with messages : " + this.displayMessages);
        };

        Cleanup.prototype.processTask = function processTask() {
            console.log("Process deletion task for user : " + this.temporaryUser.name);
        };

        Cleanup.prototype.testSubmitButton3 = function testSubmitButton3() {
            console.log("Test Submit Buton 3 : ");
        };

        return Cleanup;
    }()) || _class);
});
define('administration/components/populate',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AddUser = exports.AddUser = function AddUser() {
        _classCallCheck(this, AddUser);
    };
});
define('administration/components/statistics',['exports', 'aurelia-framework', 'aurelia-validation', './../../services/user-gateway', './../../models/user'], function (exports, _aureliaFramework, _aureliaValidation, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Statistics = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Statistics = exports.Statistics = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function Statistics(userGateway, validationController) {
        _classCallCheck(this, Statistics);

        this.validationFailed = false;

        this.userGateway = userGateway;
        this.validationController = validationController;
    }) || _class);
});
define('broadcasts/components/vip-editor',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ListEditorCustomElement = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor, _descriptor2;

    var ListEditorCustomElement = exports.ListEditorCustomElement = (_class = function ListEditorCustomElement() {
        _classCallCheck(this, ListEditorCustomElement);

        _initDefineProp(this, 'items', _descriptor, this);

        _initDefineProp(this, 'addItem', _descriptor2, this);
    }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'items', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return [];
        }
    }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'addItem', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('broadcasts/components/vip',['exports', 'aurelia-framework', './../../services/broadcast-gateway', './../../models/user'], function (exports, _aureliaFramework, _broadcastGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.History = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var History = exports.History = (_dec = (0, _aureliaFramework.inject)(_broadcastGateway.BroadcastGateway, _user.User), _dec(_class = function () {
        function History(broadcastGateway, user) {
            _classCallCheck(this, History);

            this.vipName = "";
            this.isVeryImportant = false;

            this.user = _user.User;
            this.broadcastGateway = _broadcastGateway.BroadcastGateway;
        }

        History.prototype.addVIP = function addVIP(name, status) {
            var vip = _aureliaFramework.NewInstance.of(_user.User);
        };

        History.prototype.removeVIP = function removeVIP(name, status) {
            var vip = _aureliaFramework.NewInstance.of(_user.User);
        };

        return History;
    }()) || _class);
});
define('resources/attributes/submit-task',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SubmitTaskCustomAttribute = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var SubmitTaskCustomAttribute = exports.SubmitTaskCustomAttribute = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.DOM.Element), _dec(_class = function () {
    function SubmitTaskCustomAttribute(element) {
      _classCallCheck(this, SubmitTaskCustomAttribute);

      this.element = element;
      this.onSubmit = this.trySubmit.bind(this);
    }

    SubmitTaskCustomAttribute.prototype.attached = function attached() {
      this.element.addEventListener('submit', this.onSubmit);
      this.element.isSubmitTaskExecuting = false;
    };

    SubmitTaskCustomAttribute.prototype.trySubmit = function trySubmit(e) {
      var _this = this;

      e.preventDefault();
      if (this.task) {
        return;
      }

      this.element.isSubmitTaskExecuting = true;
      this.task = Promise.resolve(this.value()).then(function () {
        return _this.completeTask();
      }, function () {
        return _this.completeTask();
      });
    };

    SubmitTaskCustomAttribute.prototype.completeTask = function completeTask() {
      this.task = null;
      this.element.isSubmitTaskExecuting = false;
    };

    SubmitTaskCustomAttribute.prototype.detached = function detached() {
      this.element.removeEventListener('submit', this.onSubmit);
    };

    return SubmitTaskCustomAttribute;
  }()) || _class);
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
define('resources/elements/list-editor',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ListEditorCustomElement = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2;

  var ListEditorCustomElement = exports.ListEditorCustomElement = (_class = function ListEditorCustomElement() {
    _classCallCheck(this, ListEditorCustomElement);

    _initDefineProp(this, 'items', _descriptor, this);

    _initDefineProp(this, 'addItem', _descriptor2, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'items', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'addItem', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/elements/user-creation',['exports', 'aurelia-framework', './../../services/user-gateway', './../../models/user'], function (exports, _aureliaFramework, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserCreation = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserCreation = exports.UserCreation = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway), _dec(_class = function () {
        function UserCreation(userGateway) {
            _classCallCheck(this, UserCreation);

            this.isBusy = false;
            this.validationFailed = false;
            this.addressExists = false;
            this.nameExists = false;
            this.isValidPassword = true;

            this.userGateway = userGateway;
            this.newUser = _aureliaFramework.NewInstance.of(_user.User);
        }

        UserCreation.prototype.addUser = function addUser() {
            var msg = "Add user  " + newUser.user.toString();
            console.log(msg);

            this.validationFailed = this.newUser.mail.length == 0 || this.newUser.name.length == 0 || this.newUser.password.length == 0;
            if (this.validationFailed) {
                console.log("Input-Validation failed");

                return;
            }

            var existingUser = this.userGateway.getByMailAddress(this.newUser.mailAddress);

            this.addressExists = existingUser.mail != null && existingUser.mail.length > 0;
            this.nameExists = existingUser.name != null && existingUser.name.length > 0;

            if (!addressExists && !nameExists) {
                return this.userGateway.add(this.newUser);
            }
        };

        return UserCreation;
    }()) || _class);
});
define('resources/value-converters/filter-by',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var FilterByValueConverter = exports.FilterByValueConverter = function () {
    function FilterByValueConverter() {
      _classCallCheck(this, FilterByValueConverter);
    }

    FilterByValueConverter.prototype.toView = function toView(array, value) {
      for (var _len = arguments.length, properties = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        properties[_key - 2] = arguments[_key];
      }

      value = (value || '').trim().toLowerCase();

      if (!value) {
        return array;
      }
      return array.filter(function (item) {
        return properties.some(function (property) {
          return (item[property] || '').toLowerCase().includes(value);
        });
      });
    };

    return FilterByValueConverter;
  }();
});
define('resources/value-converters/group-by',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var GroupByValueConverter = exports.GroupByValueConverter = function () {
    function GroupByValueConverter() {
      _classCallCheck(this, GroupByValueConverter);
    }

    GroupByValueConverter.prototype.toView = function toView(array, property) {
      var groups = new Map();
      for (var _iterator = array, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var item = _ref;

        var key = item[property];
        var group = groups.get(key);
        if (!group) {
          group = { key: key, items: [] };
          groups.set(key, group);
        }
        group.items.push(item);
      }
      return Array.from(groups.values());
    };

    return GroupByValueConverter;
  }();
});
define('resources/value-converters/order-by',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var OrderByValueConverter = exports.OrderByValueConverter = function () {
    function OrderByValueConverter() {
      _classCallCheck(this, OrderByValueConverter);
    }

    OrderByValueConverter.prototype.toView = function toView(array, property) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'asc';

      array = array.slice(0);
      var directionFactor = direction === 'desc' ? -1 : 1;
      array.sort(function (item1, item2) {
        var value1 = item1[property];
        var value2 = item2[property];
        if (value1 > value2) {
          return directionFactor;
        } else if (value1 < value2) {
          return -directionFactor;
        } else {
          return 0;
        }
      });
      return array;
    };

    return OrderByValueConverter;
  }();
});
define('administration/components/statistics/summary',['exports', 'aurelia-framework', 'aurelia-validation', './../../../services/user-gateway', './../../../models/user'], function (exports, _aureliaFramework, _aureliaValidation, _userGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Statistics = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Statistics = exports.Statistics = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function Statistics(userGateway, validationController) {
            _classCallCheck(this, Statistics);

            this.validationFailed = false;
            this.displayMessages = false;

            this.userGateway = userGateway;
            this.validationController = validationController;
            this.user = _aureliaFramework.NewInstance.of(_user.User);
        }

        Statistics.prototype.retrieveSummary = function retrieveSummary() {
            console.log("Retrieve summary : ");
        };

        Statistics.prototype.emptyGrid = function emptyGrid() {
            console.log("Empty summary results : ");
        };

        return Statistics;
    }()) || _class);
});
define('broadcasts/components/broadcast/broadcast-image',['exports', 'aurelia-router', 'aurelia-validation', './../../../services/broadcast-gateway'], function (exports, _aureliaRouter, _aureliaValidation, _broadcastGateway) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BroadcastImage = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var BroadcastImage = exports.BroadcastImage = (_dec = inject(_broadcastGateway.BroadcastGateway, _aureliaRouter.Router, NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function BroadcastImage(broadcastGateway, router, validationController) {
        _classCallCheck(this, BroadcastImage);

        this.image = null;

        validationController.validateTrigger = _aureliaValidation.validateTrigger.change;
        this.broadcastGateway = broadcastGateway;
        this.router = router;
        this.validationController = validationController;
    }) || _class);
});
define('broadcasts/components/broadcast/broadcast',['exports', 'aurelia-framework', './../../../services/broadcast-gateway', './../../../models/user', './../../../models/message', './../../../models/toolkit'], function (exports, _aureliaFramework, _broadcastGateway, _user, _message, _toolkit) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Broadcast = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    var _dec, _dec2, _class, _desc, _value, _class2;

    var Broadcast = exports.Broadcast = (_dec = (0, _aureliaFramework.inject)(_broadcastGateway.BroadcastGateway, _user.User, _aureliaFramework.NewInstance.of(_message.Message)), _dec2 = (0, _aureliaFramework.computedFrom)('isImageAttached'), _dec(_class = (_class2 = function () {
        function Broadcast(broadcastGateway, user, message) {
            _classCallCheck(this, Broadcast);

            this.isSending = false;
            this.isImageAttached = false;
            this.imageUrl = null;
            this.selectedFiles = null;
            this.selectedImage = null;

            this.broadcastGateway = _broadcastGateway.BroadcastGateway;
            this.user = _user.User;
            this.message = message;
            this.toolkit = new _toolkit.Toolkit();
        }

        Broadcast.prototype.detachImage = function detachImage() {
            this.imageUrl = null;
            this.isImageAttached = false;
        };

        Broadcast.prototype.updateImageUrl = function updateImageUrl() {
            console.log("Update Image URL");
            if (this.selectedFiles.length > 0) {
                this.isImageAttached = false;
                this.selectedImage = this.selectedFiles[0];
                this.readFileURL(this.selectedImage, this);
                this.isImageAttached = this.imageUrl != null;
            } else {
                detachImage();
            }
        };

        Broadcast.prototype.updatePreview = function updatePreview() {
            console.log("Update Preview");
            this.updateImageUrl();
            console.log("Updated Image URL :" + this.imageUrl);
        };

        Broadcast.prototype.readFileURL = function readFileURL(selectedFile, broadcast) {
            var reader = new FileReader();
            reader.onload = function (selectedImage) {
                return function (e) {
                    console.log("Selected image :" + e.target.result);
                    broadcast.imageUrl = e.target.result;
                };
            }(selectedFile);

            reader.readAsDataURL(selectedFile);
        };

        Broadcast.prototype.sendMessage = function sendMessage() {
            isSending = true;
            console.log("Send message");
            if (isValidMessage()) {
                this.message.image = this.imageUrl;
                this.message.userId = this.user.id;
                this.message.day = this.toolkit.getDay();
                this.message.time = this.toolkit.getTime();

                this.message.reset();
            }
            isSending = false;
        };

        Broadcast.prototype.isValidMessage = function isValidMessage() {
            if (this.isImageAttached) {
                return true;
            } else {
                return this.message.text.length > 0;
            }
        };

        _createClass(Broadcast, [{
            key: 'computedImageUrl',
            get: function get() {
                console.log("Return image URL :" + this.imageUrl);
                return this.imageUrl;
            }
        }]);

        return Broadcast;
    }(), (_applyDecoratedDescriptor(_class2.prototype, 'computedImageUrl', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'computedImageUrl'), _class2.prototype)), _class2)) || _class);
});
define('broadcasts/components/broadcast/contact-photo',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-validation', './../../../services/user-gateway'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaValidation, _userGateway) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactPhoto = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ContactPhoto = exports.ContactPhoto = (_dec = (0, _aureliaFramework.inject)(_userGateway.UserGateway, _aureliaRouter.Router, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
    function ContactPhoto(userGateway, router, validationController) {
      _classCallCheck(this, ContactPhoto);

      this.photo = null;

      validationController.validateTrigger = _aureliaValidation.validateTrigger.change;
      this.userGateway = userGateway;
      this.router = router;
      this.validationController = validationController;
    }

    ContactPhoto.prototype.save = function save() {
      console.log("Save");
    };

    return ContactPhoto;
  }()) || _class);
});
define('broadcasts/components/broadcast/tweet',[], function () {
    'use strict';

    function tweetCreation() {
        var tweetsTable = document.getElementById("extractedTweets");
        var tweetTbl = new tweetTable(tweetsTable);
        var tableUpdateRequested = false;

        function addImage(selectedFile) {
            var reader = new FileReader();
            reader.onload = function (selectedImage) {
                return function (e) {
                    var img = document.getElementById('preview');
                    img.className = 'preview';
                    img.src = e.target.result;
                    img.title = selectedImage.name;

                    var preview = document.getElementById('attachedImage');
                    preview.className = "preview";
                    preview.insertBefore(img, null);
                };
            }(selectedFile);

            reader.readAsDataURL(selectedFile);
        }

        function tweetRecord(userID, day, time, message, picture) {
            this.userID = userID;
            this.day = day;
            this.time = time;
            this.message = message;
            this.attachment = picture;
        }

        var tweetCreationObject = {

            createTweet: function createTweet(userID, day, time, message, picture) {
                return new tweetRecord(userID, day, time, message, picture);
            },

            selectFile: function selectFile(e) {
                var openFileDialog = document.getElementById('addPicture');
                if (openFileDialog) {
                    openFileDialog.click();
                }
                e.preventDefault();
            },

            evaluateFileDialog: function evaluateFileDialog(e) {
                var selectedFiles = e.target.files;
                if (selectedFiles.length > 0) {
                    addImage(selectedFiles[0]);
                }
            },

            detachImage: function detachImage() {
                var preview = document.getElementById('attachedImage');
                preview.innerHTML = '';
                preview.className = 'hidden';
            },

            publishTweet: function publishTweet(e) {
                var msg = document.forms.defineTweet.elements.message.value.trim();
                var img = document.getElementById('preview');
                console.log(msg.value);
                console.log(img.currentSrc.substring(0, 10));

                var newTweet = new tweetRecord(activeUser.id, mwaToolset.getDay(), mwaToolset.getTime(), msg, img.currentSrc);

                if (storageWriter.uploadTweet(newTweet)) {
                    tableUpdateRequested = true;

                    if (tableUpdateRequested) {
                        tweets = availableTweets;
                        tweetTbl.updateTable(tweets);
                        tweetsTable.addEventListener('click', tweetTbl.findTweets, false);
                        tableUpdateRequested = false;
                    }
                } else {
                    alert("Publishing tweet failed. Please try again.");
                }
            }

        };
        return tweetCreationObject;
    }

    (function () {
        var tweetCreator = new tweetCreation();

        var uploadCommand = document.getElementById('sendMsg');
        uploadCommand.addEventListener('click', tweetCreator.publishTweet, false);

        var fileSelectorProxy = document.getElementById('camera');
        fileSelectorProxy.addEventListener('click', tweetCreator.selectFile, false);

        var fileSelector = document.getElementById('addPicture');
        fileSelector.addEventListener('change', tweetCreator.evaluateFileDialog, false);

        var wasteBasket = document.getElementById('detach');
        wasteBasket.addEventListener('click', tweetCreator.detachImage, false);
    })();
});
define('broadcasts/components/history/history',['exports', 'aurelia-framework', './../../../services/broadcast-gateway', './../../../models/user'], function (exports, _aureliaFramework, _broadcastGateway, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.History = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var History = exports.History = (_dec = (0, _aureliaFramework.inject)(_broadcastGateway.BroadcastGateway, _user.User), _dec(_class = function () {
        function History(broadcastGateway, user) {
            _classCallCheck(this, History);

            this.vipName = "";
            this.isVeryImportant = false;

            this.user = _user.User;
            this.broadcastGateway = _broadcastGateway.BroadcastGateway;
        }

        History.prototype.retrieveMessages = function retrieveMessages() {
            var persons = new array();
        };

        History.prototype.removeMessages = function removeMessages() {
            var messages = new array();
        };

        return History;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"app.css\"></require><compose view=\"nav-bar-main.html\"></compose><div class=\"page-host\"><router-view></router-view></div></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = ".page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}"; });
define('text!mwa.css', ['module'], function(module) { module.exports = "body {\r\n\t\t\t\tfont-family:  Arial, Verdana, sans-serif;\r\n\t\t\t\tcolor: #111111;}\r\n.visible {\r\n  visibility: visible;}\r\n\r\n.hidden {\r\n    display: none;\r\n}\r\n\r\nform {\r\n    display: inline-block;\r\n    margin-left: 10px;\r\n}\r\n\r\n\r\ndivv {\r\n  border-bottom: 0px solid #efefef;\r\n  margin: 10px;\r\n  padding-bottom: 0px;\r\n  width: 600px;\r\n}\r\n\r\n.memo {\r\n    border-bottom: 0px solid #efefef;\r\n    margin: 10px;\r\n    padding-bottom: 10px;\r\n    width: 600px;\r\n}\r\n\r\nlegend {\r\n    background-color: #efefef;\r\n    border: 1px solid #dcdcdc;\r\n    border-radius: 10px;\r\n    padding:10px 20px;\r\n    text-align: left;\r\n    margin: 10px;\r\n    width: 600px;\r\n}\r\n\r\n.inputLabel {\r\n    float: left;\r\n    width: 120px;\r\n    text-align: right;\r\n    padding-right: 10px;\r\n}\r\n\r\n.inputField {\r\n    width: 270px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n    background-color: #fffbf0;\r\n\tborder: 1px solid #e7c157;\r\n}\r\n\r\n\r\n.submit {\r\n    text-align: right;\r\n    margin-left: 130px;\r\n}\r\n.submitNotification {\r\n    text-align: left;\r\n    margin-left: 130px;\r\n}\r\n\r\n/* warnings */\r\n.warning {\r\n    background-image: url('../img/caution.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\n/* hints */\r\n.info {\r\n    background-image: url('../img/information.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\nfieldset[value]:disabled {\r\n    color: whitesmoke;\r\n}\r\n\r\n\r\n/*  ------------  tweet section  ------------  */\r\n/* bird section  */\r\n.bird {\r\n    background-image: url(\"../img/bird.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 200px auto;\r\n    width: 300px; \r\n    height: auto;\r\n    float: middle;\r\n    margin-right: 10px;\r\n    text-align: right top;\r\n}\r\n#nameOfCurrentUser {\r\n\t/*border: 3px dashed #F00;*/\r\n\theight: 180px;\r\n\tpadding: 10px;\r\n\tposition: relative;\r\n    left: 180px;\r\n\ttop: 0;\r\n\twidth: 320px;\r\n}\r\n\r\n\r\n/* message in textaerea */\r\n.tweet {\r\n    font-size: 120%;\r\n    width: 600px;\r\n}\r\n/* hint referring to textaerea */\r\n#charCounter {font-size: 80%;}\r\n#charCounter.warn b, #charCounter.error b {\r\n  border-radius: 16px;\r\n  padding-top: 4px;\r\n  width: 32px;\r\n  height: 28px;\r\n  display: inline-block;\r\n  font-weight: normal;\r\n  text-align: center;\r\n}\r\n.warn b {color: #ffff66; background-color: #333;}\r\n.error b {color: #ff9966; background-color: #000;}\r\n\r\n/* attached image */\r\n#camera {\r\n    position: 280px  center; \r\n}\r\n\r\n.attachedImage .preview {\r\n    width: 300px; \r\n    height: auto;\r\n    border: 1px solid #000;\r\n}\r\n\r\n.tweetDefinition {\r\n    width: 600px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n}\r\n\r\n.postTweet {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.filterTweets  {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.vipField {\r\n    border: none;\r\n    margin-left: 45px;\r\n    width: 555px;\r\n    text-align: left;\r\n}\r\n\r\n/* Character Counter */\r\n#charactersLeft {\r\n  color: #fff;\r\n  font-size: 24px;}\r\n#lastKey {\r\n  color: #fff;\r\n  margin-top: 10px;}\r\n\r\n.radio1 {\r\n    float: none;\r\n    margin-left: 35px;\r\n    font-size: 70%;\r\n}\r\n\r\n.radio11 {\r\n    float: none;\r\n    margin-left: 120px;\r\n    font-size: 80%;\r\n}\r\n\r\n/* ------------ data table ------------ */\r\nfieldset.tweetsTable fieldset.admTweetsTable {\r\n    border: none;\r\n}\r\ntable {\r\n    width: 600px;\r\n}\r\n\r\nth, td {\r\n    padding: 7px 10px 10px 10px;\r\n}\r\nth {\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.1em;\r\n    font-size: 90%;\r\n    border-bottom: 2px solid #111111;\r\n    border-top: 1px solid #999;\r\n    text-align: left;\r\n}\r\ntd {\r\n    font-size: 70%;\r\n}\r\ntr.even {\r\n    background-color: #efefef;\r\n}\r\ntd.summary {\r\n    text-transform: uppercase;\r\n    font-size: 90%;\r\n    border-top: 2px solid #111111;\r\n    border-bottom: 1px solid #999;\r\n}\r\ntr:hover {\r\n    background-color: #c3e6e5;\r\n}\r\ntr.selected {\r\n    background-color: #acbad9;\r\n    color: #FFF;\r\n}\r\ntr.even.selected {\r\n    background-color: #acbad1;\r\n    color: #FFF;\r\n}\r\n\r\n/* ------------ footer ------------ */\r\nfooter {\r\n    font-size: 80%;\r\n    background-color: mediumaquamarine;\r\n}\r\n\r\n.contact {\r\n    padding-top: 10px;\r\n}"; });
define('text!edit-account.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Edit your account data</h1><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\" submit-task.call=\"applyChanges()\"><compose view-model=\"./resources/elements/account-detail\" model.bind=\"temporaryUser\"></compose><br><br><submit-button>Update Account</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></section></template>"; });
define('text!css/mwa.css', ['module'], function(module) { module.exports = "body {\r\n\t\t\t\tfont-family:  Arial, Verdana, sans-serif;\r\n\t\t\t\tcolor: #111111;}\r\n.visible {\r\n  visibility: visible;}\r\n\r\n.hidden {\r\n    display: none;\r\n}\r\n\r\nform {\r\n    display: inline-block;\r\n    margin-left: 10px;\r\n}\r\n\r\n\r\ndivv {\r\n  border-bottom: 0px solid #efefef;\r\n  margin: 10px;\r\n  padding-bottom: 0px;\r\n  width: 600px;\r\n}\r\n\r\n.memo {\r\n    border-bottom: 0px solid #efefef;\r\n    margin: 10px;\r\n    padding-bottom: 10px;\r\n    width: 600px;\r\n}\r\n\r\nlegend {\r\n    background-color: #efefef;\r\n    border: 1px solid #dcdcdc;\r\n    border-radius: 10px;\r\n    padding:10px 20px;\r\n    text-align: left;\r\n    margin: 10px;\r\n    width: 600px;\r\n}\r\n\r\n.inputLabel {\r\n    float: left;\r\n    width: 120px;\r\n    text-align: right;\r\n    padding-right: 10px;\r\n}\r\n\r\n.inputField {\r\n    width: 270px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n    background-color: #fffbf0;\r\n\tborder: 1px solid #e7c157;\r\n}\r\n.inputHelp {\r\n    width: 470px;\r\n    text-align: left;\r\n    padding-left: 130px;\r\n}\r\n\r\n.column1of2{\r\nfloat: left;\r\nwidth:290px;\r\nmargin:10px;\r\nbackground-color:lavender;\r\n}\r\n\r\n.column2of2{\r\nfloat: left;\r\nwidth:280px;\r\nmargin:10px;\r\nbackground-color:lavenderblush;\r\n}\r\n\r\n.columnIndent{\r\n    padding-left:20px;\r\n}\r\n\r\n.submit {\r\n    text-align: right;\r\n    margin-left: 130px;\r\n}\r\n.submitNotification {\r\n    text-align: left;\r\n    margin-left: 130px;\r\n}\r\n\r\n/* warnings */\r\n.warning {\r\n    background-image: url('../img/caution.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\n/* hints */\r\n.info {\r\n    background-image: url('../img/information.svg');\r\n    background-repeat: no-repeat;\r\n    background-position: 100px top;\r\n    background-size: 20px 20px;\r\n    padding-left: 125px; \r\n}\r\n\r\nfieldset[value]:disabled {\r\n    color: whitesmoke;\r\n}\r\n\r\n\r\n/*  ------------  tweet section  ------------  */\r\n/* bird section  */\r\n.bird {\r\n    background-image: url(\"../img/bird.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 200px auto;\r\n    width: 300px; \r\n    height: auto;\r\n    float: middle;\r\n    margin-right: 10px;\r\n    text-align: right top;\r\n}\r\n#nameOfCurrentUser {\r\n\t/*border: 3px dashed #F00;*/\r\n\theight: 180px;\r\n\tpadding: 10px;\r\n\tposition: relative;\r\n    left: 180px;\r\n\ttop: 0;\r\n\twidth: 320px;\r\n}\r\n\r\n\r\n/* message in textaerea */\r\n.tweet {\r\n    font-size: 120%;\r\n    width: 290px;\r\n}\r\n/* hint referring to textaerea */\r\n#charCounter {font-size: 80%;}\r\n#charCounter.warn b, #charCounter.error b {\r\n  border-radius: 16px;\r\n  padding-top: 4px;\r\n  width: 32px;\r\n  height: 28px;\r\n  display: inline-block;\r\n  font-weight: normal;\r\n  text-align: center;\r\n}\r\n.warn b {color: #ffff66; background-color: #333;}\r\n.error b {color: #ff9966; background-color: #000;}\r\n\r\n/* attached image */\r\n#camera, .camera {\r\n    position:  280px  center; \r\n    margin-left: 170px;\r\n}\r\n.camera {\r\n    position:  20px  center; \r\n    margin-left: 20px;\r\n}\r\n\r\n.attachedImage .preview {\r\n    width: 280px; \r\n    height: auto;\r\n    max-width: 100%;\r\n    border: 1px solid #000;\r\n}\r\n\r\n.tweetDefinition {\r\n    width: 600px;\r\n    text-align: left;\r\n    padding-left: 10px;\r\n}\r\n\r\n.postTweet {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.filterTweets  {\r\n    border: none;\r\n    width: 600px;\r\n    text-align: left;\r\n}\r\n\r\n.vipField {\r\n    border: none;\r\n    margin-left: 45px;\r\n    width: 555px;\r\n    text-align: left;\r\n}\r\n\r\n/* Character Counter */\r\n#charactersLeft {\r\n  color: #fff;\r\n  font-size: 24px;}\r\n#lastKey {\r\n  color: #fff;\r\n  margin-top: 10px;}\r\n\r\n.radio1 {\r\n    float: none;\r\n    margin-left: 35px;\r\n    font-size: 70%;\r\n}\r\n\r\n.radio11 {\r\n    float: none;\r\n    margin-left: 120px;\r\n    font-size: 80%;\r\n}\r\n\r\n/* ------------ data table ------------ */\r\nfieldset.tweetsTable fieldset.admTweetsTable {\r\n    border: none;\r\n}\r\ntable {\r\n    width: 600px;\r\n}\r\n\r\nth, td {\r\n    padding: 7px 10px 10px 10px;\r\n}\r\nth {\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.1em;\r\n    font-size: 90%;\r\n    border-bottom: 2px solid #111111;\r\n    border-top: 1px solid #999;\r\n    text-align: left;\r\n}\r\ntd {\r\n    font-size: 70%;\r\n}\r\ntr.even {\r\n    background-color: #efefef;\r\n}\r\ntd.summary {\r\n    text-transform: uppercase;\r\n    font-size: 90%;\r\n    border-top: 2px solid #111111;\r\n    border-bottom: 1px solid #999;\r\n}\r\ntr:hover {\r\n    background-color: #c3e6e5;\r\n}\r\ntr.selected {\r\n    background-color: #acbad9;\r\n    color: #FFF;\r\n}\r\ntr.even.selected {\r\n    background-color: #acbad1;\r\n    color: #FFF;\r\n}\r\n\r\n/* ------------ footer ------------ */\r\nfooter {\r\n    font-size: 80%;\r\n    background-color: mediumaquamarine;\r\n}\r\n\r\n.contact {\r\n    padding-top: 10px;\r\n}"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Login</h1><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\" submit-task.call=\"performLogin()\"><compose view=\"./resources/elements/login-data.html\"></compose><br><br><submit-button>Login</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></section></template>"; });
define('text!logout.html', ['module'], function(module) { module.exports = "<template><h1>Thank you for using Postillion - Bye for now!</h1></template>"; });
define('text!management.html', ['module'], function(module) { module.exports = "<template><h1>Management</h1></template>"; });
define('text!nav-bar-main.html', ['module'], function(module) { module.exports = "<template><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\"><span class=\"sr-only\">Toggle Navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-home\"></i> <span>${router.title}</span></a></div><div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\"><ul class=\"nav navbar-nav\"><li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\"><a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=\"loader\" if.bind=\"router.isNavigating\"><i class=\"fa fa-spinner fa-spin fa-2x\"></i></li></ul></div></nav></template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Something is broken…</h1><p>The page cannot be found.</p></section></template>"; });
define('text!signup.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Sign up as new user</h1><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\" submit-task.call=\"performSignup()\"><compose view-model=\"./resources/elements/account-detail\" model.bind=\"newUser\"></compose><br><br><submit-button>Create Account</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></section></template>"; });
define('text!tweet.html', ['module'], function(module) { module.exports = "<template><require from=\"./css/mwa.css\"></require><section class=\"container\"><h1>Tweet</h1><compose view-model=\"./broadcasts/components/broadcast/broadcast\"></compose><compose view=\"./broadcasts/components/vip.html\"></compose><compose view=\"./broadcasts/components/history/history.html\"></compose></section></template>"; });
define('text!welcome-screen.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><div class=\"memo\"><h2>Welcome to Postillion!</h2></div><compose view=\"./resources/elements/blurb.html\"></compose></template>"; });
define('text!x.html', ['module'], function(module) { module.exports = "<template><require from=\"mwa.css\"></require><form submit.delegate=\"performSignup()\"><compose view-model=\"./resources/elements/account-detail\" model.bind=\"newUser\"></compose><br><br><input id=\"subscribe\" class=\"submit\" type=\"submit\" name=\"subscribe\" value=\"Create Account\" disabled.bind=\"isBusy\"><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></template>"; });
define('text!administration/components/admin-menu.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Admin's Toolkit</h1><div class=\"row\"><div class=\"col-sm-2\"><a route-href=\"route: populate\" class=\"btn btn-primary\"><i class=\"fa fa-plus-square-o\"></i> Add User</a></div><div class=\"col-sm-2\"><a route-href=\"route: cleanup\" class=\"btn btn-primary\"><i class=\"fa fa-trash-o\"></i> Cleanup</a></div><div class=\"col-sm-2\"><a route-href=\"route: statistics\" class=\"btn btn-primary\"><i class=\"fa fa-pencil-square-o\"></i> Statistics</a></div></div></section></template>"; });
define('text!administration/components/cleanup-content.html', ['module'], function(module) { module.exports = "<template><h1>Cleanup Content</h1></template>"; });
define('text!administration/components/cleanup.html', ['module'], function(module) { module.exports = "<template><require from=\"./../../css/mwa.css\"></require><section class=\"container\"><h1>Cleanup user or related items</h1><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\"><compose view=\"./cleanup/userSearch.html\" view-model.bind=\"{ user:temporaryUser }\"></compose><submit-button click.delegate=\"activateUser()\"><i slot=\"icon\" class=\"fa fa-trash\" aria-hidden=\"true\"></i>Activate user</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div><label class=\"col-sm-4 checkbox-inline\"><input type=\"checkbox\" checked.bind=\"displayMessages\">Show messages</label><compose view=\"./cleanup/taskSelection.html\"></compose><submit-button click.delegate=\"processTask()\"><i slot=\"icon\" class=\"fa fa-trash\" aria-hidden=\"true\"></i> Delete selected data</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div><br><br><compose view=\"./cleanup/displayMessages.html\"></compose></form></section></template>"; });
define('text!administration/components/populate.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Add a new user</h1><compose view-model=\"./../../resources/elements/user-creation\"></compose></section></template>"; });
define('text!administration/components/statistics.html', ['module'], function(module) { module.exports = "<template><require from=\"./../../css/mwa.css\"></require><section class=\"container\"><h1>Statistics</h1><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\"><compose view-model=\"./statistics/summary\"></compose></form></section></template>"; });
define('text!broadcasts/components/vip-editor.html', ['module'], function(module) { module.exports = "<template><div class=\"form-group\" repeat.for=\"item of items\"><template with.bind=\"item\"><template replaceable part=\"item\"><div class=\"col-sm-2 col-sm-offset-1\"><template replaceable part=\"label\"></template></div><div class=\"col-sm-8\"><template replaceable part=\"value\">${$this}</template></div><div class=\"col-sm-1\"><template replaceable part=\"remove-btn\"><button type=\"button\" class=\"btn btn-danger\" title=\"Remove\" click.delegate=\"items.splice($index, 1)\"><i class=\"fa fa-times\"></i></button></template></div></template></template></div><div class=\"form-group\" show.bind=\"addItem\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"button\" class=\"btn btn-primary\" click.delegate=\"addItem()\"><slot name=\"add-button-content\"><i class=\"fa fa-plus-square-o\"></i><slot name=\"add-button-label\">Add</slot></slot></button></div></div></template>"; });
define('text!broadcasts/components/vip.html', ['module'], function(module) { module.exports = "<template><fieldset><legend>Important persons to follow</legend><form><list-editor items.bind=\"contact.socialProfiles\" add-item.call=\"contact.addSocialProfile()\"><template replace-part=\"label\"><select value.bind=\"type & validate\" class=\"form-control\"><option value=\"GitHub\">GitHub</option><option value=\"Twitter\">Twitter</option></select></template><template replace-part=\"value\"><input type=\"text\" class=\"form-control\" placeholder=\"Username\" value.bind=\"username & validate\"></template><span slot=\"add-button-label\">Add an important person</span></list-editor><div class=\"row\"><div class=\"col-sm-9\"><submit-button click.delegate=\"addVip(name, status)\"><i slot=\"icon\" class=\"fa fa-search\" aria-hidden=\"true\"></i> Add or Change important person</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></div><div class=\"col-sm-2\"><submit-button click.delegate=\"removeVip(name)\"><i slot=\"icon\" class=\"fa fa-trash\" aria-hidden=\"true\"></i> Forget person</submit-button></div></div></form><br><br></fieldset></template>"; });
define('text!resources/elements/account-detail.html', ['module'], function(module) { module.exports = "<template><require from=\"./../../css/mwa.css\"></require><fieldset disabled.bind=\"isBusy\"><form><div><br><br><label for=\"mailAddress\" class=\"inputLabel\">Login-Name :</label><input id=\"mailAddress\" type=\"email\" name=\"mailAddress\" class=\"inputField\" placeholder=\"Type in a valid mail address ...\" required value.bind=\"user.mail\"><div show.bind=\"addressExists\">Address already exists.</div><br><br><label for=\"username\" class=\"inputLabel\">Username :</label><input id=\"username\" type=\"text\" name=\"username\" class=\"inputField\" minlength=\"2\" placeholder=\"Type in a name ...\" required value.bind=\"user.name\"><div show.bind=\"nameExists\">Name already exists. Please choose another.</div><br><br><label for=\"password\" class=\"inputLabel\">Password :</label><input type=\"password\" name=\"password\" class=\"inputField\" placeholder=\"Type in a password ...\" minlength=\"1\" maxlength=\"100\" required value.bind=\"user.password\"><div hide.bind=\"isValidPassword\">Please choose a more complex password</div></div></form></fieldset></template>"; });
define('text!resources/elements/blurb.html', ['module'], function(module) { module.exports = "<template><fieldset><legend class=\"note\"><h3>A Modern Web Application & Services using Node.js</h3><h3>Implemented as <abbr title=\"Single Page Application\">SPA</abbr>, based on Aurelia, Hapi and Heroku</h3><h3>Course - de Leastar</h3><h3><abbr title=\"Ostbayerische Technische Hochschule\">OTH</abbr> Regensburg, <abbr title=\"Medizinische Informatik\">IM</abbr> WiSe 16/17</h3></legend></fieldset></template>"; });
define('text!resources/elements/group-list.html', ['module'], function(module) { module.exports = "<template bindable=\"items, groupBy, orderBy\"><div repeat.for=\"group of items | groupBy:groupBy | orderBy:'key'\" class=\"panel panel-default\"><div class=\"panel-heading\">${group.key}</div><ul class=\"list-group\"><li repeat.for=\"item of group.items | orderBy:orderBy\" class=\"list-group-item\"><template with.bind=\"item\"><template replaceable part=\"item\">${$this}</template></template></li></ul></div></template>"; });
define('text!resources/elements/list-editor.html', ['module'], function(module) { module.exports = "<template><div class=\"form-group\" repeat.for=\"item of items\"><template with.bind=\"item\"><template replaceable part=\"item\"><div class=\"col-sm-2 col-sm-offset-1\"><template replaceable part=\"label\"></template></div><div class=\"col-sm-8\"><template replaceable part=\"value\">${$this}</template></div><div class=\"col-sm-1\"><template replaceable part=\"remove-btn\"><button type=\"button\" class=\"btn btn-danger\" title=\"Remove\" click.delegate=\"items.splice($index, 1)\"><i class=\"fa fa-times\"></i></button></template></div></template></template></div><div class=\"form-group\" show.bind=\"addItem\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"button\" class=\"btn btn-primary\" click.delegate=\"addItem()\"><slot name=\"add-button-content\"><i class=\"fa fa-plus-square-o\"></i><slot name=\"add-button-label\">Add</slot></slot></button></div></div></template>"; });
define('text!resources/elements/login-data.html', ['module'], function(module) { module.exports = "<template><require from=\"./../../css/mwa.css\"></require><fieldset><form><div><br><br><label for=\"mailAddress\" class=\"inputLabel\">Login-Name :</label><input id=\"mailAddress\" type=\"email\" name=\"mailAddress\" class=\"inputField\" placeholder=\"Type in your mail address ...\" required value.bind=\"user.mail\"><div hide.bind=\"addressExists\">Address unknown.</div><br><br><label for=\"password\" class=\"inputLabel\">Password :</label><input type=\"password\" name=\"password\" class=\"inputField\" placeholder=\"Type in your password ...\" required value.bind=\"user.password\"><div hide.bind=\"isValidPassword\">Invalid Password. Try again ...</div></div></form></fieldset></template>"; });
define('text!resources/elements/submit-button.html', ['module'], function(module) { module.exports = "<template bindable=\"disabled\"><button type=\"submit\" ref=\"button\" disabled.bind=\"disabled\" class=\"btn btn-success\"><span hide.bind=\"button.form.isSubmitTaskExecuting\"><slot name=\"icon\"><i class=\"fa fa-check\" aria-hidden=\"true\"></i></slot></span><i class=\"fa fa-spinner fa-spin\" aria-hidden=\"true\" show.bind=\"button.form.isSubmitTaskExecuting\"></i><slot>Submit</slot></button></template>"; });
define('text!resources/elements/user-creation.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\" submit-task.call=\"addUser()\"><compose view-model=\"./account-detail\" model.bind=\"newUser\"></compose><br><br><submit-button>Create Account</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></form></section></template>"; });
define('text!administration/components/cleanup/displayMessages.html', ['module'], function(module) { module.exports = "<template><table id=\"userRelatedTweets\"><thead><tr><th>Day</th><th>Time</th><th>Message</th></tr></thead><tbody></tbody></table></template>"; });
define('text!administration/components/cleanup/taskSelection.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><fieldset><form class=\"form-group\"><legend>Select deletion task</legend><p>Active user : ${user.name} / ${user.mail}</p><label class=\"radio-inline\"><input type=\"radio\" id=\"user\" name=\"optradio\">User (incl. all related data)</label><label class=\"radio-inline\"><input type=\"radio\" id=\"allMessages\" name=\"optradio\">All his messages</label><label class=\"radio-inline\"><input type=\"radio\" id=\"someMessages\" name=\"optradio\">Selected messages</label></form></fieldset></section></template>"; });
define('text!administration/components/cleanup/userSearch.html', ['module'], function(module) { module.exports = "<template><legend>Find user by mail or name</legend><fieldset><div class=\"form-group\"><label class=\"inputLabel\">Login-name :</label><input type=\"email\" class=\"inputField\" placeholder=\"Type in a mail-address ...\" value.bind=\"user.mail\"><br><br><label for=\"username\" class=\"inputLabel\">Display-name :</label><input id=\"username\" type=\"text\" name=\"username\" class=\"inputField\" placeholder=\"Type in a name ...\" value.bind=\"user.name\"></div></fieldset></template>"; });
define('text!administration/components/statistics/period.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><fieldset id=\"statistics\" class=\"visible\"><h4>Select Period for Statistic</h4><form clss=\"form-group\"><div><label for=\"startDate\" class=\"inputLabel\">From :</label><input type=\"date\" class=\"inputField\" placeholder=\"2000-12-30\" maxlength=\"10\" required> <span class=\"help-block inputHelp\">First day of time span to analyse</span><label for=\"endDate\" class=\"inputLabel\">To :</label><input type=\"date\" name=\"endDate\" class=\"inputField\" placeholder=\"2000-12-31\" maxlength=\"10\" required> <span class=\"help-block inputHelp\">Last day of time span to analyse</span></div></form></fieldset></section></template>"; });
define('text!administration/components/statistics/results.html', ['module'], function(module) { module.exports = "<template><table id=\"admStatisticsTable\"><thead><tr><th>Day</th><th>Time</th><th>Message</th></tr></thead><tbody></tbody></table></template>"; });
define('text!administration/components/statistics/summary.html', ['module'], function(module) { module.exports = "<template><fieldset id=\"statistics\" class=\"visible\"><legend>Amount of messages per user</legend><compose view=\"./period.html\"></compose><form><div class=\"row\"><div class=\"col-sm-9\"><submit-button click.delegate=\"retrieveSummary()\"><i slot=\"icon\" class=\"fa fa-search\" aria-hidden=\"true\"></i> Retrieve summary</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></div><div class=\"col-sm-2\"><submit-button click.delegate=\"emptyGrid()\"><i slot=\"icon\" class=\"fa fa-trash\" aria-hidden=\"true\"></i> Empty results view</submit-button></div></div></form><br><br><compose view=\"./results.html\"></compose></fieldset></template>"; });
define('text!broadcasts/components/broadcast/broadcast.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><fieldset><legend>New message</legend><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\"><div class=\"container-fluid row\"><div class=\"column1of2\"><textarea class=\"form-control tweet\" value.bind=\"message.text\" placeholder=\"Type in your message ...\" maxlength=\"140\" rows=\"6\"> </textarea><span id=\"charCounter\"></span><br><br><button type=\"button\" id=\"xcamera\" class=\"btn btn-default camera\" click.delegate=\"detachImage()\"><span class=\"glyphicon glyphicon-remove\"></span> Detach image</button><br><br><label for=\"picture\"><span class=\"glyphicon glyphicon-paperclip camera\"></span> Attach image :</label><input type=\"file\" id=\"picture\" name=\"picture\" class=\"camera\" accept=\"image/*\" files.bind=\"selectedFiles\" change.delegate=\"updatePreview()\"></div><div class=\"column2of2\"><img id=\"preview\" src.bind=\"computedImageUrl\" class=\"img-responsive preview\" alt=\"Photo\" width=\"280\"></div></div><div class=\"col-sm-9\"><submit-button click.delegate=\"sendMessage()\"><i slot=\"icon\" class=\"fa fa-send\" aria-hidden=\"true\"></i> Send Message</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></div></form></fieldset></section></template>"; });
define('text!broadcasts/components/broadcast/contact-photo.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>contact.fullName</h1><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\" submit.delegate=\"save()\"><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"photo\">Photo</label><div class=\"col-sm-9\"><input type=\"file\" id=\"photo\" accept=\"image/*\" files.bind=\"photo & validate\"></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"submit\" class=\"btn btn-success\">Save</button> <a class=\"btn btn-danger\">Cancel</a></div></div></form></section></template>"; });
define('text!broadcasts/components/history/history.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><fieldset><legend>History</legend><form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\"><compose view=\"./userSelection.html\"></compose><div class=\"row\"><div class=\"col-sm-9\"><submit-button click.delegate=\"retrieveMessages()\"><i slot=\"icon\" class=\"fa fa-search\" aria-hidden=\"true\"></i> Retrieve Messages</submit-button><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></div><div class=\"col-sm-2\"><submit-button click.delegate=\"removeMessages()\"><i slot=\"icon\" class=\"fa fa-trash\" aria-hidden=\"true\"></i> Delete selected messages</submit-button></div><div class=\"col-sm-2\"><submit-button click.delegate=\"removeMessages()\"><i slot=\"icon\" class=\"fa fa-trash\" aria-hidden=\"true\"></i> Delete all my messages</submit-button></div></div></form><br><br></fieldset></section></template>"; });
define('text!broadcasts/components/history/userSelection.html', ['module'], function(module) { module.exports = "<template><section><fieldset><form class=\"form-group\"><h4>Define filter</h4><div class=\"container-fluid\"><div class=\"row\"><div class=\"column1of2\" style=\"background-color:#e6e6fa\"><label class=\"radio columnIndent\"><input type=\"radio\" id=\"user\" name=\"optradio\">None</label><label class=\"radio columnIndent\"><input type=\"radio\" id=\"allMessages\" name=\"optradio\">My tweets</label><label class=\"radio columnIndent\"><input type=\"radio\" id=\"someMessages\" name=\"optradio\">Tweets of :</label><input id=\"username\" type=\"text\" name=\"username\" class=\"inputField columnIndent\" placeholder=\"Type in a user's name ...\" value.bind=\"user.name\"></div><div class=\"column1of2 columnIndent\" style=\"background-color:#fff0f5\"><label class=\"checkbox\"><input type=\"checkbox\" checked.bind=\"includeVips\">Include seleted VIPs</label></div></div></div></form></fieldset></section></template>"; });
//# sourceMappingURL=app-bundle.js.map