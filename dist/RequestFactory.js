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
      var _this = this;

      var method = _ref2.method,
          uri = _ref2.uri,
          params = _ref2.params,
          config = _ref2.config;
      config instanceof Object || (config = {});

      if (this._requestService) {
        var extend = this._requestService._extend.request;
        extend instanceof Object && Object.keys(extend).forEach(function (key) {
          return _this._request.prototype[key] = extend[key];
        });
      }

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
      var result = undefined;
      handlers.forEach(function (handler) {
        if (handler[action] instanceof Function) {
          var _data = handler[action](_data);

          _data === undefined || (result = _data);
        }
      });
      return result;
    }
  }, {
    key: "resolveClient",
    value: function resolveClient(client, request) {
      var _this2 = this,
          _getLoader;

      var handlers = this.getHandlers(request.data);
      this.resolveHandlers(request.data, handlers, 'before');
      var dataClient = request.data.stubData || client[request.data.method](request.data);
      var promise = dataClient instanceof Promise ? dataClient : new Promise(function (res) {
        return setTimeout(function () {
          return res(dataClient);
        }, 100);
      });
      var Loader = request.data.useLoader && (_Interfaces.RequestLoader.isPrototypeOf(request.data.loader) || _Interfaces.RequestLoader.prototype === request.data.loader.prototype) ? new request.data.loader(request.data) : null;

      var getLoader = function getLoader() {
        var _this2$_requestServic;

        Loader && (Loader.pending = (_this2$_requestServic = _this2._requestService) === null || _this2$_requestServic === void 0 ? void 0 : _this2$_requestServic._requests.filter(function (r) {
          return r.data.useLoader && !r.data.statusCode;
        }).length);
        return Loader;
      };

      (_getLoader = getLoader()) === null || _getLoader === void 0 ? void 0 : _getLoader.start();
      promise.then(function (response) {
        _this2.resolveClientOnResponse(response, request, handlers);

        request.data.statusCode || (request.data.statusCode = 200);
      })["catch"](function (error) {
        _this2.resolveClientOnCatch(error, request, handlers);

        request.data.statusCode || (request.data.statusCode = 500);
      })["finally"](function () {
        var _getLoader2;

        _this2.resolveClientOnFinally(request, handlers);

        request.data.statusCode || (request.data.statusCode = 200);
        (_getLoader2 = getLoader()) === null || _getLoader2 === void 0 ? void 0 : _getLoader2.end();
      });
    }
  }, {
    key: "resolveClientOnResponse",
    value: function resolveClientOnResponse(response, request, handlers) {
      this.resolveHandlers(response, handlers, 'after');

      var _response = _objectSpread({}, response);

      var isSuccess = this.resolveHandlers(_response, handlers, 'isSuccess');
      var isError = this.resolveHandlers(_response, handlers, 'isError');

      if (isSuccess === true || isSuccess !== true && isError !== true) {
        this.setRequestResult(request, request.data.success instanceof Function ? request.data.success(response) : this.resolveHandlers(response, handlers, 'onSuccess'));
      } else if (isError === true) {
        this.setRequestResult(request, request.data.error instanceof Function ? request.data.error(response) : this.resolveHandlers(response, handlers, 'onError'));
      }
    }
  }, {
    key: "resolveClientOnCatch",
    value: function resolveClientOnCatch(error, request, handlers) {
      this.resolveHandlers(error, handlers, 'afterCatch');

      if (request.data["catch"] instanceof Function) {
        try {
          this.setRequestResult(error, request.data["catch"](error));
          request.data.dataError = error;
        } catch (err) {
          this.setRequestResult(err, this.resolveHandlers(err, handlers, 'onCatch'));
          request.data.dataError = err;
        }
      } else {
        this.setRequestResult(request, this.resolveHandlers(error, handlers, 'onCatch'));
      }
    }
  }, {
    key: "resolveClientOnFinally",
    value: function resolveClientOnFinally(request, handlers) {
      this.resolveHandlers(request.data, handlers, 'afterFinally');
      var result = null;

      if (request.data["finally"] instanceof Function) {
        try {
          result = request.data["finally"](request.data);
        } catch (err) {
          result = this.resolveHandlers(err, handlers, 'onCatch');
        }
      } else {
        result = this.resolveHandlers(request.data, handlers, 'onFinally');
      }

      request.data.result === null && this.setRequestResult(request, result);
    }
  }, {
    key: "setRequestResult",
    value: function setRequestResult(request, result) {
      request.data.result = result === undefined ? null : result;
      return this;
    }
  }]);
  return RequestFactory;
}();

exports.RequestFactory = RequestFactory;