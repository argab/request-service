"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractRequest = exports.Request = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Interfaces = require("./Interfaces");

var _RequestFactory = require("./RequestFactory");

var _Mediators = require("./Mediators");

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
      done: null,
      alert: null,
      useLoader: false
    });
  }

  (0, _createClass2["default"])(AbstractRequest, [{
    key: "repo",
    value: function repo() {}
  }, {
    key: "stub",
    value: function stub() {}
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
        mediator = _ref.mediator;
    (0, _classCallCheck2["default"])(this, Request);
    _this = _super.call(this);
    _this._getRepo = getRepo instanceof Function ? getRepo : function () {
      return null;
    };
    _this._getStub = getStub instanceof Function ? getStub : function () {
      return null;
    };
    _this._useStubs = Boolean(useStubs);
    _this._factory = _RequestFactory.RequestFactory.isPrototypeOf(factory) ? factory : _RequestFactory.RequestFactory;
    _this._mediator = _Mediators.RequestMediator.isPrototypeOf(mediator) ? mediator : _Mediators.RequestMediatorDecorator;
    config instanceof Object && Object.assign(_this._config, config);
    return (0, _possibleConstructorReturn2["default"])(_this, _this._proxy());
  }

  (0, _createClass2["default"])(Request, [{
    key: "_proxy",
    value: function _proxy(stagedData) {
      return new Proxy(this, {
        get: function get(Req, method) {
          return function () {
            var stub = function stub(path) {
              var repo = Req._getStub(path);

              repo instanceof _Interfaces.RequestRepository && (repo.client = Req._proxy());
              return repo;
            };

            var repo = function repo(path) {
              if (Req._useStubs) {
                var _stub = stub(path);

                if (_stub) {
                  return _stub;
                }
              }

              var repo = Req._getRepo(path);

              repo instanceof _Interfaces.RequestRepository && (repo.client = Req._proxy());
              return repo;
            };

            if (method === 'repo') {
              return repo(arguments.length <= 0 ? undefined : arguments[0]);
            }

            if (method === 'stub') {
              return stub(arguments.length <= 0 ? undefined : arguments[0]);
            }

            stagedData instanceof Object || (stagedData = {});
            var mediator = new Req._mediator(stagedData);

            if (mediator instanceof _Mediators.RequestMediator && mediator[method] instanceof Function) {
              mediator[method](arguments.length <= 0 ? undefined : arguments[0]);
              return Req._proxy(mediator.staged);
            }

            var factory = new Req._factory(stagedData);

            if (factory instanceof _RequestFactory.RequestFactory && factory._client.prototype[method] instanceof Function) {
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
  }]);
  return Request;
}(AbstractRequest);

exports.Request = Request;