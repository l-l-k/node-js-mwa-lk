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
define('administration/adm-home',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AdmHome = exports.AdmHome = function AdmHome() {
    _classCallCheck(this, AdmHome);
  };
});
define('administration/adm',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Adm = exports.Adm = function Adm() {
    _classCallCheck(this, Adm);
  };
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
            route: 'administration', name: 'administration', moduleId: 'administration/main', nav: true, title: 'xAdministration'
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
            config.map([{ route: '', name: 'administration', moduleId: './components/admin-menu', title: 'Toolkit' }, { route: 'populate', name: 'populate', moduleId: './components/populate', title: 'Add User' }, { route: 'cleanup', name: 'cleanup', moduleId: './components/cleanup', title: "Cleanup" }, { route: 'statistics', name: 'statistics', moduleId: './components/statistics', title: "Statistics" }]);
        };

        return Administration;
    }()) || _class);
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
define('administration/components/adm-home',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AdmHome = exports.AdmHome = function AdmHome() {
    _classCallCheck(this, AdmHome);
  };
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
define('administration/components/admin',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Adm = exports.Adm = function Adm() {
    _classCallCheck(this, Adm);
  };
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
define('administration/components/cleanup',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Cleanup = exports.Cleanup = function Cleanup() {
        _classCallCheck(this, Cleanup);
    };
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
define('administration/components/remove-user',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var RemoveUser = exports.RemoveUser = function RemoveUser() {
        _classCallCheck(this, RemoveUser);
    };
});
define('administration/components/statistics',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Statistics = exports.Statistics = function Statistics() {
        _classCallCheck(this, Statistics);
    };
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
define('text!administration/adm.html', ['module'], function(module) { module.exports = "<template><require from=\"./../app.css\"></require><h1>ADMIN's adm component</h1></template>"; });
define('text!administration/components/adm-home.html', ['module'], function(module) { module.exports = "<template><require from=\"./../../app.css\"></require><h1>ADMIN's home page</h1></template>"; });
define('text!administration/components/admin-menu.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Admin's Toolkit</h1><div class=\"row\"><div class=\"col-sm-2\"><a route-href=\"route: populate\" class=\"btn btn-primary\"><i class=\"fa fa-plus-square-o\"></i> Add User</a></div><div class=\"col-sm-2\"><a route-href=\"route: cleanup\" class=\"btn btn-primary\"><i class=\"fa fa-trash-o\"></i> Cleanup</a></div><div class=\"col-sm-2\"><a route-href=\"route: statistics\" class=\"btn btn-primary\"><i class=\"fa fa-pencil-square-o\"></i> Statistics</a></div></div></section></template>"; });
define('text!administration/components/admin.html', ['module'], function(module) { module.exports = ""; });
define('text!administration/components/cleanup-content.html', ['module'], function(module) { module.exports = "<template><h1>Cleanup Content</h1></template>"; });
define('text!administration/components/cleanup.html', ['module'], function(module) { module.exports = "<template><h1>Cleanup</h1></template>"; });
define('text!administration/components/populate.html', ['module'], function(module) { module.exports = "<template><h1>Add User</h1></template>"; });
define('text!administration/components/remove-user.html', ['module'], function(module) { module.exports = "<template><h1>Remove User</h1></template>"; });
define('text!administration/components/statistics.html', ['module'], function(module) { module.exports = "<template><h1>Statistics</h1></template>"; });
define('text!resources/elements/account-detail.html', ['module'], function(module) { module.exports = "<template><fieldset disabled.bind=\"isBusy\"><form><div><br><br><label for=\"mailAddress\" class=\"inputLabel\">Login-Name :</label><input id=\"mailAddress\" type=\"email\" name=\"mailAddress\" class=\"inputField\" placeholder=\"Type in a valid mail address ...\" required value.bind=\"user.mail\"><div show.bind=\"addressExists\">Address already exists.</div><br><br><label for=\"username\" class=\"inputLabel\">Username :</label><input id=\"username\" type=\"text\" name=\"username\" class=\"inputField\" minlength=\"2\" placeholder=\"Type in a name ...\" required value.bind=\"user.name\"><div show.bind=\"nameExists\">Name already exists. Please choose another.</div><br><br><label for=\"password\" class=\"inputLabel\">Password :</label><input type=\"password\" name=\"password\" class=\"inputField\" placeholder=\"Type in a password ...\" minlength=\"1\" maxlength=\"100\" required value.bind=\"user.password\"><div hide.bind=\"isValidPassword\">Please choose a more complex password</div></div></form></fieldset></template>"; });
define('text!resources/elements/blurb.html', ['module'], function(module) { module.exports = "<template><fieldset><legend class=\"note\"><h3>A Modern Web Application & Services using Node.js</h3><h3>Implemented as <abbr title=\"Single Page Application\">SPA</abbr>, based on Aurelia, Hapi and Heroku</h3><h3>Course - de Leastar</h3><h3><abbr title=\"Ostbayerische Technische Hochschule\">OTH</abbr> Regensburg, <abbr title=\"Medizinische Informatik\">IM</abbr> WiSe 16/17</h3></legend></fieldset></template>"; });
define('text!resources/elements/login-data.html', ['module'], function(module) { module.exports = "<template><fieldset><form><div><br><br><label for=\"mailAddress\" class=\"inputLabel\">Login-Name :</label><input id=\"mailAddress\" type=\"email\" name=\"mailAddress\" class=\"inputField\" placeholder=\"Type in your mail address ...\" required value.bind=\"user.mail\"><div hide.bind=\"addressExists\">Address unknown.</div><br><br><label for=\"password\" class=\"inputLabel\">Password :</label><input type=\"password\" name=\"password\" class=\"inputField\" placeholder=\"Type in your password ...\" required value.bind=\"user.password\"><div hide.bind=\"isValidPassword\">Invalid Password. Try again ...</div></div></form><br><br><input class=\"submit\" type=\"submit\" name=\"login\" value=\"Login\"><div show.bind=\"validationFailed\" class=\"submitNotification\">Mission impossible. Check your input, please.</div></fieldset></template>"; });
//# sourceMappingURL=app-bundle.js.map