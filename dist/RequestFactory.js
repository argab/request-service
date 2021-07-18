"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestFactory = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Decorators = require("./Decorators");

var _Interfaces = require("./Interfaces");

var _Request = require("./Request");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RequestFactory = /*#__PURE__*/function () {
  function RequestFactory(_ref) {
    var client = _ref.client,
        handler = _ref.handler,
        requestDecorator = _ref.requestDecorator,
        requestService = _ref.requestService;
    (0, _classCallCheck2["default"])(this, RequestFactory);
    (0, _defineProperty2["default"])(this, "_handler", void 0);
    (0, _defineProperty2["default"])(this, "_client", void 0);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    (0, _defineProperty2["default"])(this, "_requestService", void 0);
    this._handler = _Interfaces.RequestHandler.isPrototypeOf(handler) ? handler : _Interfaces.RequestHandler;
    this._client = _Decorators.ClientDecorator.isPrototypeOf(client) ? client : _Decorators.ClientDecorator;
    this._request = _Decorators.RequestDecorator.isPrototypeOf(requestDecorator) ? requestDecorator : _Decorators.RequestDecorator;
    _Request.AbstractRequest.prototype.isPrototypeOf(Object.getPrototypeOf(requestService)) && (this._requestService = requestService);
  }

  (0, _createClass2["default"])(RequestFactory, [{
    key: "create",
    value: function create(_ref2) {
      var method = _ref2.method,
          uri = _ref2.uri,
          params = _ref2.params,
          config = _ref2.config;
      config instanceof Object || (config = {});
      return new this._request(_objectSpread(_objectSpread({}, config), {
        uri: uri,
        params: params,
        method: method
      }));
    }
  }, {
    key: "dispatch",
    value: function dispatch(request) {
      if (false === request instanceof _Decorators.RequestDecorator) {
        return;
      }

      var client = this.getClient(request.data);
      client[request.data.method] instanceof Function && this.resolveClient(client, request);
      return request;
    }
  }, {
    key: "getClient",
    value: function getClient(data) {
      var client = _Decorators.ClientDecorator.isPrototypeOf(data.client) ? data.client : this._client;
      return new client(data);
    }
  }, {
    key: "getHandlers",
    value: function getHandlers(data) {
      var output = [];
      var handlers = data.handler || this._handler;
      Array.isArray(handlers) || (handlers = [handlers]);
      handlers.forEach(function (handler) {
        (_Interfaces.RequestHandler.isPrototypeOf(handler) || _Interfaces.RequestHandler.prototype === handler.prototype) && output.push(new handler(data));
      });
      return output;
    }
  }, {
    key: "resolveHandlers",
    value: function resolveHandlers(data, handlers, action) {
      var resolve = data;
      handlers.forEach(function (handler) {
        if (handler[action] instanceof Function) {
          var _data = handler[action](resolve);

          _data === undefined || (resolve = _data);
        }
      });
      return resolve;
    }
  }, {
    key: "resolveClient",
    value: function resolveClient(client, request) {
      var _this = this,
          _getLoader;

      var handlers = this.getHandlers(request.data);
      request.data = this.resolveHandlers(request.data, handlers, 'before');
      var dataClient = request.data.stubData || client[request.data.method](request.data);
      var promise = dataClient instanceof Promise ? dataClient : new Promise(function (res) {
        return setTimeout(function () {
          return res(dataClient);
        }, 100);
      });

      var getLoader = function getLoader() {
        var _this$_requestService;

        var loader = request.data.useLoader && (_Interfaces.RequestLoader.isPrototypeOf(request.data.loader) || _Interfaces.RequestLoader.prototype === request.data.loader.prototype) ? new request.data.loader(request.data) : null;
        loader && (loader.pending = (_this$_requestService = _this._requestService) === null || _this$_requestService === void 0 ? void 0 : _this$_requestService._requests.filter(function (r) {
          return r.data.useLoader && !r.data.statusCode;
        }).length);
        return loader;
      };

      (_getLoader = getLoader()) === null || _getLoader === void 0 ? void 0 : _getLoader.start();
      promise.then(function (response) {
        _this.resolveClientOnResponse(response, request);

        request.data.statusCode || (request.data.statusCode = 200);
      })["catch"](function (error) {
        _this.resolveClientOnCatch(error, request);

        request.data.statusCode || (request.data.statusCode = 500);
      })["finally"](function () {
        var _getLoader2;

        _this.resolveClientOnFinally(request);

        request.data.statusCode || (request.data.statusCode = 200);
        (_getLoader2 = getLoader()) === null || _getLoader2 === void 0 ? void 0 : _getLoader2.end();
      });
    }
  }, {
    key: "resolveClientOnResponse",
    value: function resolveClientOnResponse(response, request) {
      var handlers = this.getHandlers(request.data);
      this.resolveHandlers(response, handlers, 'after');
      var isSuccess = this.resolveHandlers(_objectSpread({}, response), handlers, 'isSuccess');
      var isError = this.resolveHandlers(_objectSpread({}, response), handlers, 'isError');

      if (isSuccess === true || isSuccess !== true && isError !== true) {
        request.data.success instanceof Function ? request.data.success(response) : this.resolveHandlers(response, handlers, 'onSuccess');
      } else if (isError === true) {
        request.data.error instanceof Function ? request.data.error(response) : this.resolveHandlers(response, handlers, 'onError');
      }

      return response;
    }
  }, {
    key: "resolveClientOnCatch",
    value: function resolveClientOnCatch(error, request) {
      var handlers = this.getHandlers(request.data);

      if (request.data["catch"] instanceof Function) {
        try {
          request.data["catch"](error);
        } catch (err) {
          this.resolveHandlers(err, handlers, 'onCatch');
        }
      } else {
        this.resolveHandlers(error, handlers, 'onCatch');
      }

      return error;
    }
  }, {
    key: "resolveClientOnFinally",
    value: function resolveClientOnFinally(request) {
      var handlers = this.getHandlers(request.data);

      if (request.data["finally"] instanceof Function) {
        try {
          request.data["finally"](request.data);
        } catch (err) {
          this.resolveHandlers(err, handlers, 'onCatch');
        }
      } else {
        this.resolveHandlers(request.data, handlers, 'onFinally');
      }
    }
  }]);
  return RequestFactory;
}();

exports.RequestFactory = RequestFactory;