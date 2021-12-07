"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestService = exports.Request = exports.AbstractRequest = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _RequestFactory = require("./RequestFactory");

var _RequestMiddleware = require("./RequestMiddleware");

var _Decorators = require("./Decorators");

var _RequestManager = require("./RequestManager");

var _RequestRetry = require("./RequestRetry");

var _helpers = require("./helpers");

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var AbstractRequest = /*#__PURE__*/function () {
  function AbstractRequest() {
    (0, _classCallCheck2["default"])(this, AbstractRequest);
    (0, _defineProperty2["default"])(this, "_requests", []);
    (0, _defineProperty2["default"])(this, "_factory", void 0);
    (0, _defineProperty2["default"])(this, "_manager", void 0);
    (0, _defineProperty2["default"])(this, "_middleware", void 0);
    (0, _defineProperty2["default"])(this, "_retry", void 0);
    (0, _defineProperty2["default"])(this, "_getRepo", void 0);
    (0, _defineProperty2["default"])(this, "_getStub", void 0);
    (0, _defineProperty2["default"])(this, "_useStubs", void 0);
    (0, _defineProperty2["default"])(this, "_config", {
      handler: null,
      client: null,
      repo: null,
      repoPath: null,
      repoMethod: null,
      loader: null,
      useLoader: false,
      stubData: null,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      uri: '',
      params: {},
      method: 'get',
      statusCode: 0,
      retry: null,
      retryOnCatch: null,
      retryChain: null,
      retryMaxCount: 0,
      retryTimeout: 0,
      retryCount: 0,
      dataError: null,
      result: null,
      log: true
    });
    (0, _defineProperty2["default"])(this, "_extend", {
      middleware: null,
      request: null
    });
  }

  (0, _createClass2["default"])(AbstractRequest, [{
    key: "repo",
    value: function repo() {}
  }, {
    key: "stub",
    value: function stub() {}
  }, {
    key: "getLog",
    value: function getLog() {}
  }, {
    key: "log",
    value: function log() {}
  }, {
    key: "extends",
    value: function _extends() {}
  }]);
  return AbstractRequest;
}();

exports.AbstractRequest = AbstractRequest;

var _proxy = /*#__PURE__*/new WeakSet();

var RequestService = /*#__PURE__*/function (_AbstractRequest) {
  (0, _inherits2["default"])(RequestService, _AbstractRequest);

  var _super = _createSuper(RequestService);

  function RequestService(_ref) {
    var _this;

    var config = _ref.config,
        getRepo = _ref.getRepo,
        getStub = _ref.getStub,
        useStubs = _ref.useStubs,
        extend = _ref.extend,
        factory = _ref.factory,
        manager = _ref.manager,
        middleware = _ref.middleware,
        request = _ref.request,
        requestRetry = _ref.requestRetry;
    (0, _classCallCheck2["default"])(this, RequestService);
    _this = _super.call(this);

    _classPrivateMethodInitSpec((0, _assertThisInitialized2["default"])(_this), _proxy);

    _this._getRepo = getRepo instanceof Function ? getRepo : function () {
      return null;
    };
    _this._getStub = getStub instanceof Function ? getStub : function () {
      return null;
    };
    _this._useStubs = Boolean(useStubs);
    _this._factory = (0, _helpers.isPrototype)(_RequestFactory.RequestFactory, factory) ? factory : _RequestFactory.RequestFactory;
    _this._manager = (0, _helpers.isPrototype)(_RequestManager.RequestManager, manager) ? manager : _RequestManager.RequestManager;
    _this._middleware = (0, _helpers.isPrototype)(_RequestMiddleware.RequestMiddleware, middleware) ? middleware : _Decorators.RequestMiddlewareDecorator;
    _this._retry = (0, _helpers.isPrototype)(_RequestRetry.RequestRetry, requestRetry) ? requestRetry : _RequestRetry.RequestRetry;
    _this._factory = new _this._factory({
      request: request,
      service: (0, _assertThisInitialized2["default"])(_this)
    });
    config instanceof Object && Object.assign(_this._config, config);
    extend instanceof Object && Object.assign(_this._extend, extend);

    var _extend = _this["extends"]().middleware;

    _extend instanceof Object && Object.keys(_extend).forEach(function (key) {
      return _this._middleware.prototype[key] = _extend[key];
    });
    return (0, _possibleConstructorReturn2["default"])(_this, _classPrivateMethodGet((0, _assertThisInitialized2["default"])(_this), _proxy, _proxy2).call((0, _assertThisInitialized2["default"])(_this)));
  }

  (0, _createClass2["default"])(RequestService, [{
    key: "repo",
    value: function repo(path) {
      if (this._useStubs) {
        var stub = this.stub(path);
        if (stub) return stub;
      }

      return this._getRepo(path);
    }
  }, {
    key: "stub",
    value: function stub(path) {
      return this._getStub(path);
    }
  }, {
    key: "getLog",
    value: function getLog() {
      return this._requests;
    }
  }, {
    key: "log",
    value: function log(request) {
      this._requests.push(request);
    }
  }, {
    key: "extends",
    value: function _extends() {
      return _objectSpread({}, this._extend);
    }
  }]);
  return RequestService;
}(AbstractRequest);

exports.RequestService = RequestService;

function _proxy2() {
  return (0, _helpers.proxy)(this, null, function (state, method, args) {
    if (false === ['repo', 'stub'].includes(method) && state[method] instanceof Function) {
      return state[method](args[0]);
    }

    return (0, _helpers.applyCall)(new state._middleware(state), method, args);
  });
}

var _methods = /*#__PURE__*/new WeakMap();

var _resolveMethods = /*#__PURE__*/new WeakMap();

var Request = /*#__PURE__*/function () {
  function Request(data) {
    (0, _classCallCheck2["default"])(this, Request);
    (0, _defineProperty2["default"])(this, "data", {});
    (0, _defineProperty2["default"])(this, "chain", []);
    (0, _defineProperty2["default"])(this, "_fetch", void 0);
    (0, _defineProperty2["default"])(this, "_resolve", void 0);

    _classPrivateFieldInitSpec(this, _methods, {
      writable: true,
      value: ['then', 'catch', 'finally', 'success', 'error', 'retry', 'retryOnCatch', 'retryChain', 'retryMaxCount', 'retryTimeout']
    });

    _classPrivateFieldInitSpec(this, _resolveMethods, {
      writable: true,
      value: ['then', 'catch', 'finally', 'success', 'error']
    });

    this.data = data;
  }
  /*
  * Method is Abstract.
  * */


  (0, _createClass2["default"])(Request, [{
    key: "methods",
    get: function get() {
      return (0, _classPrivateFieldGet2["default"])(this, _methods).slice();
    },
    set: function set(name) {
      return (0, _classPrivateFieldGet2["default"])(this, _methods).push(name);
    }
  }, {
    key: "resolveMethods",
    get: function get() {
      return (0, _classPrivateFieldGet2["default"])(this, _resolveMethods).slice();
    }
  }, {
    key: "then",
    value: function then(callback) {}
    /*
    * Method is Abstract.
    * */

  }, {
    key: "catch",
    value: function _catch(callback) {}
    /*
    * Method is Abstract.
    * */

  }, {
    key: "finally",
    value: function _finally(callback) {}
    /*
    * Method is Abstract.
    * */

  }, {
    key: "success",
    value: function success(callback) {}
    /*
    * Method is Abstract.
    * */

  }, {
    key: "error",
    value: function error(callback) {}
    /*
    * This method doesn't restarts the request, it brings the Function that
    * takes the request data as an argument and initiates the request restarting method.
    * The Function executes at the end of a Promise.prototype.finally()
    * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
    * returning Boolean that whenever is TRUE then restarts the request
    * @return: void
    * */

  }, {
    key: "retry",
    value: function retry(resolve) {
      this.data.retry = resolve;
    }
    /*
    * The request retry error handler.
    * The Function executes at the end of a Promise.prototype.finally()
    * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
    * returning Boolean that whenever is TRUE then restarts the request
    * @return: void
    * */

  }, {
    key: "retryOnCatch",
    value: function retryOnCatch(resolve) {
      this.data.retryOnCatch = resolve;
    }
    /*
    * Overrides the current request`s methods call chain on retry.
    * The Function executes within a retry method.
    * @example: ....retryChain(({set}) => set.json()
    *   .post('http://some.url', {params})
    *   .success(...).error(...).catch(...))
    * @param: {Function}({set, chain, data}):<void|Array>
    *     - @property "set" creates a new set
    *       of the current request`s methods call.
    *     - @property "chain" provides an Array
    *       [{method, args}, {method, args}, ....]
    *       containing the current request`s methods call chain.
    *     - @property "data" - current request`s data.
    * @return: void
    * */

  }, {
    key: "retryChain",
    value: function retryChain(callback) {
      this.data.retryChain = callback;
    }
    /*
    * Sets a max number of retry attempts
    * @param: {Number}
    * @return: void
    * */

  }, {
    key: "retryMaxCount",
    value: function retryMaxCount(count) {
      this.data.retryMaxCount = Number.isNaN(+count) ? 0 : +count;
    }
    /*
    * Sets the timeout between retry attempts
    * @param: {Number}
    * @return: void
    * */

  }, {
    key: "retryTimeout",
    value: function retryTimeout(miliseconds) {
      this.data.retryTimeout = Number.isNaN(+miliseconds) ? 0 : +miliseconds;
    }
  }]);
  return Request;
}();

exports.Request = Request;