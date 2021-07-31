"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestMediatorDecorator = exports.RequestMediator = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _helpers = require("./helpers");

var _Request = require("./Request");

var _RequestFactory = require("./RequestFactory");

var _Interfaces = require("./Interfaces");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RequestMediator = /*#__PURE__*/function () {
  function RequestMediator(Service, Factory) {
    (0, _classCallCheck2["default"])(this, RequestMediator);
    (0, _defineProperty2["default"])(this, "_staged", {});
    (0, _defineProperty2["default"])(this, "_chain", []);
    if (false === Service instanceof _Request.AbstractRequest) throw 'The RequestMediator`s "service" is not an instance of "AbstractRequest".';
    if (false === (0, _helpers.isPrototype)(_RequestFactory.RequestFactory, Factory)) throw 'The RequestMediator`s "factory" is not a prototype of "RequestFactory.prototype".';

    var _proxy = function _proxy(state) {
      return (0, _helpers.proxy)(state, null, function (state, method, args) {
        var staged = state._staged;
        var requestService = staged.requestService || Service;
        var requestDecorator = staged.requestDecorator;
        var handler = staged.handler;
        var client = staged.client;
        staged.requestService && delete staged.requestService;
        staged.requestDecorator && delete staged.requestDecorator;

        if (['repo', 'stub'].includes(method)) {
          var Repo = Service[method](args[0], args[1], args[2], args[3]);
          Repo instanceof _Interfaces.RequestRepository && (Repo.client = _proxy(state));
          return Repo;
        }

        if (state[method] instanceof Function) {
          state._chain.push({
            method: method,
            args: args
          });

          state[method](args[0], args[1], args[2], args[3]);
          return _proxy(state);
        }

        var factory = new Factory({
          handler: handler,
          client: client,
          requestService: requestService,
          requestDecorator: requestDecorator
        });

        if (factory._client.prototype[method] instanceof Function) {
          var uri = args[0];
          var params = args[1];
          var request = factory.create({
            method: method,
            uri: uri,
            params: params,
            config: (0, _helpers.mergeDeep)(_objectSpread({}, Service._config), staged)
          });

          state._chain.push({
            method: method,
            args: args
          });

          state._chain.forEach(function (item) {
            return request.chainPush(item);
          });

          request.data.log && Service.log(request);
          return factory.dispatch(request);
        }
      });
    };

    return _proxy(this);
  }

  (0, _createClass2["default"])(RequestMediator, [{
    key: "config",
    value: function config(data) {
      data instanceof Object && (this._staged = (0, _helpers.mergeDeep)(this._staged, data));
    }
  }]);
  return RequestMediator;
}();

exports.RequestMediator = RequestMediator;

var RequestMediatorDecorator = /*#__PURE__*/function (_RequestMediator) {
  (0, _inherits2["default"])(RequestMediatorDecorator, _RequestMediator);

  var _super = _createSuper(RequestMediatorDecorator);

  function RequestMediatorDecorator() {
    (0, _classCallCheck2["default"])(this, RequestMediatorDecorator);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(RequestMediatorDecorator, [{
    key: "stubData",
    value: function stubData(_stubData) {
      this.config({
        stubData: _stubData
      });
    }
  }, {
    key: "unlog",
    value: function unlog() {
      this.config({
        log: false
      });
    }
  }, {
    key: "headers",
    value: function headers(_headers) {
      this.config({
        headers: _headers
      });
    }
  }, {
    key: "encode",
    value: function encode() {
      this.config({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
  }, {
    key: "form",
    value: function form() {
      this.config({
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  }, {
    key: "json",
    value: function json() {
      this.config({
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });
    }
  }, {
    key: "html",
    value: function html() {
      this.config({
        headers: {
          'Accept': 'text/html'
        }
      });
    }
  }, {
    key: "useLoader",
    value: function useLoader() {
      var _useLoader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.config({
        useLoader: Boolean(_useLoader)
      });
    }
  }, {
    key: "bg",
    value: function bg() {
      this.config({
        useLoader: false
      });
    }
  }]);
  return RequestMediatorDecorator;
}(RequestMediator);

exports.RequestMediatorDecorator = RequestMediatorDecorator;