"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Interfaces = require("./Interfaces");

var _RequestFactory = require("./RequestFactory");

var _Mediators = require("./Mediators");

var _Decorators = require("./Decorators");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Request = /*#__PURE__*/function () {
  function Request(_ref) {
    var config = _ref.config,
        getRepo = _ref.getRepo,
        getStub = _ref.getStub,
        useStubs = _ref.useStubs,
        factory = _ref.factory,
        _ref$mediator = _ref.mediator,
        mediator = _ref$mediator === void 0 ? _Mediators.RequestMediatorDecorator : _ref$mediator;
    (0, _classCallCheck2["default"])(this, Request);
    (0, _defineProperty2["default"])(this, "_requests", []);
    (0, _defineProperty2["default"])(this, "_factory", void 0);
    (0, _defineProperty2["default"])(this, "_mediator", void 0);
    (0, _defineProperty2["default"])(this, "_getRepo", void 0);
    (0, _defineProperty2["default"])(this, "_getStub", void 0);
    (0, _defineProperty2["default"])(this, "_useStubs", void 0);
    (0, _defineProperty2["default"])(this, "_config", {
      handler: null,
      client: null,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      uri: '',
      params: {},
      method: 'get',
      success: null,
      error: null,
      "finally": null,
      "catch": null,
      done: null,
      alert: null,
      useLoader: false
    });
    this._getRepo = getRepo instanceof Function ? getRepo : function () {
      return null;
    };
    this._getStub = getStub instanceof Function ? getStub : function () {
      return null;
    };
    this._useStubs = Boolean(useStubs);
    this._factory = factory instanceof _RequestFactory.RequestFactory ? factory : _RequestFactory.RequestFactory;
    this._mediator = mediator instanceof _Mediators.RequestMediator ? mediator : _Mediators.RequestMediatorDecorator;
    config instanceof Object && Object.assign(this._config, config);
    return this._proxy();
  }

  (0, _createClass2["default"])(Request, [{
    key: "repo",
    value: function repo(path) {
      if (this._useStubs) {
        var stub = this.stub(path);

        if (stub) {
          return stub;
        }
      }

      var repo = this._getRepo(path);

      repo instanceof _Interfaces.RequestRepository && (repo.client = this);
      return repo;
    }
  }, {
    key: "stub",
    value: function stub(path) {
      var repo = this._getStub(path);

      repo instanceof _Interfaces.RequestRepository && (repo.client = this);
      return repo;
    }
  }, {
    key: "_proxy",
    value: function _proxy(stagedData) {
      return new Proxy(this, {
        get: function get(Req, method) {
          return function () {
            stagedData instanceof Object || (stagedData = {});
            var mediator = Req._mediator;
            mediator = Request._setPrototypeOf(mediator, Req._mediator);
            mediator = new mediator(stagedData);

            if (mediator instanceof _Mediators.RequestMediator && mediator[method] instanceof Function) {
              mediator[method](arguments.length <= 0 ? undefined : arguments[0]);
              return Req._proxy(mediator.staged);
            }

            var factory = typeof Req._factory.prototype === 'undefined' ? Req._factory : new Req._factory({
              client: stagedData.client || Req._config.client,
              handler: stagedData.handler || Req._config.handler
            });

            if (factory._client instanceof _Decorators.ClientDecorator && factory._client[method] instanceof Function) {
              var data = Req._config;
              var uri = arguments.length <= 0 ? undefined : arguments[0];
              var params = arguments.length <= 1 ? undefined : arguments[1];
              var config = (arguments.length <= 2 ? undefined : arguments[2]) instanceof Object ? arguments.length <= 2 ? undefined : arguments[2] : {};
              var request = factory.create({
                method: method,
                uri: uri,
                params: params,
                config: _objectSpread(_objectSpread(_objectSpread({}, data), config), stagedData)
              });

              Req._requests.push(request);

              return factory.dispatch(request);
            }
          };
        }
      });
    }
  }], [{
    key: "_setPrototypeOf",
    value: function _setPrototypeOf(subject, target) {
      if (typeof subject.prototype === 'undefined') {
        subject = function subject() {};

        subject.prototype = Object.getPrototypeOf(target);
      }

      return subject;
    }
  }]);
  return Request;
}();

exports.Request = Request;