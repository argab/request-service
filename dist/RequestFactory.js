"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestFactory = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Interfaces = require("./Interfaces");
var _Request = require("./Request");
var _helpers = require("./helpers");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var RequestFactory = /*#__PURE__*/function () {
  function RequestFactory(_ref) {
    var client = _ref.client,
      handler = _ref.handler,
      request = _ref.request,
      service = _ref.service;
    (0, _classCallCheck2["default"])(this, RequestFactory);
    (0, _defineProperty2["default"])(this, "_handler", void 0);
    (0, _defineProperty2["default"])(this, "_client", void 0);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    (0, _defineProperty2["default"])(this, "_service", void 0);
    this._handler = (0, _helpers.isPrototype)(_Interfaces.RequestHandler, handler) ? handler : _Interfaces.RequestHandler;
    this._client = (0, _helpers.isPrototype)(_Interfaces.RequestClient, client) ? client : _Interfaces.RequestClient;
    this._request = (0, _helpers.isPrototype)(_Request.Request, request) ? request : _Request.Request;
    _Request.AbstractRequest.prototype.isPrototypeOf(Object.getPrototypeOf(service || {})) && (this._service = service);
  }
  (0, _createClass2["default"])(RequestFactory, [{
    key: "create",
    value: function create(_ref2) {
      var method = _ref2.method,
        uri = _ref2.uri,
        params = _ref2.params,
        config = _ref2.config;
      var request = new this._request(_objectSpread(_objectSpread({}, config), {
        uri: uri,
        params: params,
        method: method
      }));
      if (this._service) {
        var extend = this._service["extends"]().request;
        extend instanceof Object && Object.keys(extend).forEach(function (key) {
          request.methods = key;
          request[key] = extend[key];
        });
      }
      return request;
    }
  }, {
    key: "createOrAssign",
    value: function createOrAssign(request, data, config) {
      data || (data = {});
      config || (config = {});
      if (request && request instanceof _Request.Request) {
        request.chain = [];
        request.data = (0, _helpers.mergeDeep)(request.data, data);
        Object.assign(request.data, {
          method: data.method,
          uri: data.uri,
          params: data.params,
          repo: null,
          repoPath: null,
          repoMethod: null,
          statusCode: 0,
          dataError: null,
          result: null
        });
        return request;
      }
      return this.create({
        method: data.method,
        uri: data.uri,
        params: data.params,
        config: config
      });
    }
  }, {
    key: "getClient",
    value: function getClient(data) {
      var client = this.getClientPrototype(data);
      return new client(data);
    }
  }, {
    key: "getClientPrototype",
    value: function getClientPrototype(data) {
      return (0, _helpers.isPrototype)(_Interfaces.RequestClient, data.client) ? data.client : this._client;
    }
  }, {
    key: "getHandlers",
    value: function getHandlers(data, appendDataFunc) {
      var output = [];
      var handlers = data.handler || this._handler;
      Array.isArray(handlers) || (handlers = [handlers]);
      handlers.forEach(function (handler) {
        if ((0, _helpers.isPrototype)(_Interfaces.RequestHandler, handler)) {
          appendDataFunc instanceof Function && appendDataFunc(handler);
          output.push(new handler(data));
        }
      });
      return output;
    }
  }, {
    key: "getLoader",
    value: function getLoader(data) {
      return data.useLoader && (0, _helpers.isPrototype)(_Interfaces.RequestLoader, data.loader) ? new data.loader(data) : null;
    }
  }]);
  return RequestFactory;
}();
exports.RequestFactory = RequestFactory;