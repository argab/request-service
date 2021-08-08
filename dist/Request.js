"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractRequest = exports.Request = exports.RequestService = void 0;

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

var _RequestDispatcher = require("./RequestDispatcher");

var _RequestRetry = require("./RequestRetry");

var _helpers = require("./helpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AbstractRequest = /*#__PURE__*/function () {
  function AbstractRequest() {
    (0, _classCallCheck2["default"])(this, AbstractRequest);
    (0, _defineProperty2["default"])(this, "_requests", []);
    (0, _defineProperty2["default"])(this, "_factory", void 0);
    (0, _defineProperty2["default"])(this, "_dispatcher", void 0);
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
      success: null,
      error: null,
      "finally": null,
      "catch": null,
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
        dispatcher = _ref.dispatcher,
        middleware = _ref.middleware,
        requestDecorator = _ref.requestDecorator,
        requestRetry = _ref.requestRetry;
    (0, _classCallCheck2["default"])(this, RequestService);
    _this = _super.call(this);
    _this._getRepo = getRepo instanceof Function ? getRepo : function () {
      return null;
    };
    _this._getStub = getStub instanceof Function ? getStub : function () {
      return null;
    };
    _this._useStubs = Boolean(useStubs);
    _this._factory = (0, _helpers.isPrototype)(_RequestFactory.RequestFactory, factory) ? factory : _RequestFactory.RequestFactory;
    _this._dispatcher = (0, _helpers.isPrototype)(_RequestDispatcher.RequestDispatcher, dispatcher) ? dispatcher : _RequestDispatcher.RequestDispatcher;
    _this._middleware = (0, _helpers.isPrototype)(_RequestMiddleware.RequestMiddleware, middleware) ? middleware : _Decorators.RequestMiddlewareDecorator;
    _this._retry = (0, _helpers.isPrototype)(_RequestRetry.RequestRetry, requestRetry) ? requestRetry : _RequestRetry.RequestRetry;
    config instanceof Object && Object.assign(_this._config, config);
    extend instanceof Object && Object.assign(_this._extend, extend);
    _this._factory = new _this._factory({
      requestDecorator: requestDecorator,
      service: (0, _assertThisInitialized2["default"])(_this)
    });

    var _extend = _this["extends"]().middleware;

    _extend instanceof Object && Object.keys(_extend).forEach(function (key) {
      _this._middleware.prototype[key] = _extend[key];
    });
    return (0, _possibleConstructorReturn2["default"])(_this, (0, _helpers.proxy)((0, _assertThisInitialized2["default"])(_this), null, function (state, method, args) {
      if (false === ['repo', 'stub'].includes(method) && state[method] instanceof Function) {
        return state[method](args[0]);
      }

      return new state._middleware(state)[method](args[0], args[1], args[2], args[3]);
    }));
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

var Request = /*#__PURE__*/function () {
  function Request(data) {
    (0, _classCallCheck2["default"])(this, Request);
    (0, _defineProperty2["default"])(this, "data", {});
    (0, _defineProperty2["default"])(this, "chain", []);
    (0, _defineProperty2["default"])(this, "retryChainSet", []);
    (0, _defineProperty2["default"])(this, "_methods", ['retry', 'retryOnCatch', 'retryChain', 'retryMaxCount', 'retryTimeout']);
    this.data = data;
  }
  /*
  * This method doesn't restarts the request, it brings the Function that
  * takes the request data as an argument and initiates the request restarting method.
  * The Function executes at the end of a Promise.prototype.finally()
  * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
  * returning Boolean that whenever is TRUE then restarts the request
  * @return: void
  * */


  (0, _createClass2["default"])(Request, [{
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
    *       of the current request`s methods call
    *       staged as an Array in a property named "retryChainSet".
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