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
        requestDecorator = _ref.requestDecorator;
    (0, _classCallCheck2["default"])(this, RequestFactory);
    (0, _defineProperty2["default"])(this, "_handler", void 0);
    (0, _defineProperty2["default"])(this, "_client", void 0);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    this._handler = handler instanceof _Interfaces.RequestHandler ? handler : _Interfaces.RequestHandler;
    this._client = client instanceof _Decorators.ClientDecorator ? client : _Decorators.ClientDecorator;
    this._request = requestDecorator instanceof _Decorators.RequestDecorator ? requestDecorator : _Decorators.RequestDecorator;
    this._request = _Request.Request._setPrototypeOf(this._request, requestDecorator);
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
      var client = data.client instanceof _Decorators.ClientDecorator ? data.client : this._client;
      client = _Request.Request._setPrototypeOf(client, data.client);
      return new client(data);
    }
  }, {
    key: "getHandlers",
    value: function getHandlers(data) {
      var _this = this;

      var output = [];
      var handlers = data.handler || this._handler;
      Array.isArray(handlers) || (handlers = [handlers]);
      handlers.forEach(function (hr) {
        var handler = hr instanceof _Interfaces.RequestHandler ? hr : _this._handler;
        handler = _Request.Request._setPrototypeOf(handler, hr);
        output.push(new handler(data));
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
      var _this2 = this;

      var handlers = this.getHandlers(request.data);
      request.data = this.resolveHandlers(request.data, handlers, 'before');
      var dataClient = client[request.data.method](request.data);
      var promise = dataClient instanceof Promise ? dataClient : new Promise(function (res) {
        return setTimeout(function () {
          return res(dataClient);
        }, 100);
      });
      promise.then(function (response) {
        return _this2.resolveClientOnResponse(response, request);
      })["catch"](function (error) {
        return _this2.resolveClientOnCatch(error, request);
      })["finally"](function () {
        return _this2.resolveClientOnFinally(request);
      });
    }
  }, {
    key: "resolveClientOnResponse",
    value: function resolveClientOnResponse(response, request) {
      var handlers = this.getHandlers(request.data);
      this.resolveHandlers(response, handlers, 'after');
      var isSuccess = this.resolveHandlers(response, handlers, 'isSuccess');
      var isError = this.resolveHandlers(response, handlers, 'isError');

      if (isSuccess === true || isSuccess === undefined && !isError) {
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