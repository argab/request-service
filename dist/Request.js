"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractRequest = exports.Request = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _RequestFactory = require("./RequestFactory");

var _Mediators = require("./Mediators");

var _Interfaces = require("./Interfaces");

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
    (0, _defineProperty2["default"])(this, "_mediator", void 0);
    (0, _defineProperty2["default"])(this, "_getRepo", void 0);
    (0, _defineProperty2["default"])(this, "_getStub", void 0);
    (0, _defineProperty2["default"])(this, "_useStubs", void 0);
    (0, _defineProperty2["default"])(this, "_config", {
      handler: null,
      client: null,
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
      dataError: null,
      result: null,
      log: true
    });
    (0, _defineProperty2["default"])(this, "_extend", {
      mediator: null,
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

var Request = /*#__PURE__*/function (_AbstractRequest) {
  (0, _inherits2["default"])(Request, _AbstractRequest);

  var _super = _createSuper(Request);

  function Request(_ref) {
    var _this;

    var config = _ref.config,
        getRepo = _ref.getRepo,
        getStub = _ref.getStub,
        useStubs = _ref.useStubs,
        factory = _ref.factory,
        mediator = _ref.mediator,
        extend = _ref.extend;
    (0, _classCallCheck2["default"])(this, Request);
    _this = _super.call(this);
    _this._getRepo = getRepo instanceof Function ? getRepo : function () {
      return null;
    };
    _this._getStub = getStub instanceof Function ? getStub : function () {
      return null;
    };
    _this._useStubs = Boolean(useStubs);
    _this._factory = (0, _helpers.isPrototype)(_RequestFactory.RequestFactory, factory) ? factory : _RequestFactory.RequestFactory;
    _this._mediator = (0, _helpers.isPrototype)(_Mediators.RequestMediator, mediator) ? mediator : _Mediators.RequestMediatorDecorator;
    config instanceof Object && Object.assign(_this._config, config);
    extend instanceof Object && Object.assign(_this._extend, extend);
    return (0, _possibleConstructorReturn2["default"])(_this, (0, _helpers.proxy)((0, _assertThisInitialized2["default"])(_this), null, function (state, method, args) {
      var extend = state["extends"]().mediator;
      extend instanceof Object && Object.keys(extend).forEach(function (key) {
        state._mediator.prototype[key] = extend[key];
      });

      if (['repo', 'stub'].includes(method)) {
        var Repo = state[method](args[0]);
        Repo instanceof _Interfaces.RequestRepository && (Repo.client = new state._mediator(state, state._factory));
        return Repo;
      }

      if (state[method] instanceof Function) return state[method](args[0]);

      if (state._mediator.prototype[method] instanceof Function) {
        var _mediator = new state._mediator(state, state._factory);

        return _mediator[method](args[0], args[1], args[2], args[3]);
      }
    }));
  }

  (0, _createClass2["default"])(Request, [{
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
  return Request;
}(AbstractRequest);

exports.Request = Request;