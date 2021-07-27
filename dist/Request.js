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
    _this._factory = _RequestFactory.RequestFactory.isPrototypeOf(factory) ? factory : _RequestFactory.RequestFactory;
    _this._mediator = _Mediators.RequestMediator.isPrototypeOf(mediator) ? mediator : _Mediators.RequestMediatorDecorator;
    config instanceof Object && Object.assign(_this._config, config);
    extend instanceof Object && Object.assign(_this._extend, extend);
    return (0, _possibleConstructorReturn2["default"])(_this, _this._proxy());
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

      repo instanceof _Interfaces.RequestRepository && (repo.client = this._proxy());
      return repo;
    }
  }, {
    key: "stub",
    value: function stub(path) {
      var repo = this._getStub(path);

      repo instanceof _Interfaces.RequestRepository && (repo.client = this._proxy());
      return repo;
    }
  }, {
    key: "getLog",
    value: function getLog() {
      return this._requests;
    }
  }, {
    key: "_proxy",
    value: function _proxy(stagedData, chain) {
      return new Proxy(this, {
        get: function get(Req, method) {
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (Req[method] instanceof Function) return Req[method](args[0]);
            stagedData instanceof Object || (stagedData = {});
            Array.isArray(chain) || (chain = []);

            if (_Mediators.RequestMediator.isPrototypeOf(Req._mediator)) {
              var extend = Req._extend.mediator;
              extend instanceof Object && Object.keys(extend).forEach(function (key) {
                Req._mediator.prototype[key] = extend[key];
              });

              if (Req._mediator.prototype[method] instanceof Function) {
                var mediator = new Req._mediator(stagedData);
                mediator[method](args[0], args[1], args[2], args[3]);
                chain.push({
                  method: method,
                  args: args
                });
                return Req._proxy(mediator.staged, chain);
              }
            }

            stagedData.requestService || Object.assign(stagedData, {
              requestService: Req
            });
            var factory = new Req._factory(stagedData);

            if (factory instanceof _RequestFactory.RequestFactory && factory._client.prototype[method] instanceof Function) {
              var data = _objectSpread({}, Req._config);

              var uri = args[0];
              var params = args[1];
              var request = factory.create({
                method: method,
                uri: uri,
                params: params,
                config: (0, _helpers.mergeDeep)(data, stagedData)
              });
              chain.push({
                method: method,
                args: args
              });
              chain.forEach(function (item) {
                return request.chainPush(item);
              });
              request.data.log && Req._requests.push(request);
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