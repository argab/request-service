"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestMiddleware = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));
var _helpers = require("./helpers");
var _Request = require("./Request");
var _Interfaces = require("./Interfaces");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
var _repo = /*#__PURE__*/new WeakMap();
var _chain = /*#__PURE__*/new WeakMap();
var _proxy = /*#__PURE__*/new WeakSet();
var _runRepo = /*#__PURE__*/new WeakSet();
var _runManager = /*#__PURE__*/new WeakSet();
var RequestMiddleware = /*#__PURE__*/function () {
  function RequestMiddleware(service) {
    var request = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck2["default"])(this, RequestMiddleware);
    _classPrivateMethodInitSpec(this, _runManager);
    _classPrivateMethodInitSpec(this, _runRepo);
    _classPrivateMethodInitSpec(this, _proxy);
    (0, _defineProperty2["default"])(this, "_staged", {});
    (0, _defineProperty2["default"])(this, "_service", void 0);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    _classPrivateFieldInitSpec(this, _repo, {
      writable: true,
      value: {
        instance: null,
        path: null,
        method: null,
        run: false
      }
    });
    _classPrivateFieldInitSpec(this, _chain, {
      writable: true,
      value: []
    });
    if (!(service instanceof _Request.RequestService)) throw 'The RequestMiddleware`s "service" is not an instance of "RequestService".';
    if (request && !(request instanceof _Request.Request)) throw 'The RequestMiddleware`s "request" is not an instance of "Request".';
    this._service = service;
    this._request = request;
    return _classPrivateMethodGet(this, _proxy, _proxy2).call(this);
  }
  (0, _createClass2["default"])(RequestMiddleware, [{
    key: "config",
    value: function config(data) {
      data instanceof Object && (this._staged = (0, _helpers.mergeDeep)(this._staged, data));
    }
  }]);
  return RequestMiddleware;
}();
exports.RequestMiddleware = RequestMiddleware;
function _proxy2() {
  return (0, _helpers.proxy)(this, null, function (state, method, args) {
    var _state$_request;
    var runRepo = _classPrivateMethodGet(state, _runRepo, _runRepo2).call(state, method, args);
    if (runRepo) return runRepo;
    var client = state._staged.client || ((_state$_request = state._request) === null || _state$_request === void 0 ? void 0 : _state$_request.data.client) || state._service._config.client;
    if (state._service._factory.getClientPrototype({
      client: client
    }).prototype[method] instanceof Function) {
      return _classPrivateMethodGet(state, _runManager, _runManager2).call(state, method, args);
    }
    if (state[method] instanceof Function) {
      (0, _classPrivateFieldGet2["default"])(state, _chain).push({
        method: method,
        args: args
      });
      (0, _helpers.applyCall)(state, method, args);
      return _classPrivateMethodGet(state, _proxy, _proxy2).call(state);
    }
  });
}
function _runRepo2(method, args) {
  if ((0, _classPrivateFieldGet2["default"])(this, _repo).run) {
    (0, _classPrivateFieldGet2["default"])(this, _repo).run = false;
    (0, _classPrivateFieldGet2["default"])(this, _repo).method = method;
    (0, _classPrivateFieldGet2["default"])(this, _chain).push({
      method: method,
      args: args
    });
    return (0, _helpers.applyCall)((0, _classPrivateFieldGet2["default"])(this, _repo).instance, method, args);
  }
  if (['repo', 'stub'].includes(method)) {
    (0, _classPrivateFieldGet2["default"])(this, _chain).push({
      method: method,
      args: args
    });
    (0, _classPrivateFieldGet2["default"])(this, _repo).instance = (0, _helpers.applyCall)(this._service, method, args);
    (0, _classPrivateFieldGet2["default"])(this, _repo).instance instanceof _Interfaces.RequestRepository && ((0, _classPrivateFieldGet2["default"])(this, _repo).instance.client = _classPrivateMethodGet(this, _proxy, _proxy2).call(this));
    (0, _classPrivateFieldGet2["default"])(this, _repo).path = args[0];
    (0, _classPrivateFieldGet2["default"])(this, _repo).run = true;
    return _classPrivateMethodGet(this, _proxy, _proxy2).call(this);
  }
}
function _runManager2(method, args) {
  this._request = this._service._factory.createOrAssign(this._request, _objectSpread(_objectSpread({}, this._staged), {}, {
    uri: args[0],
    params: args[1],
    method: method
  }), (0, _helpers.mergeDeep)(_objectSpread({}, this._service._config), this._staged));
  Object.assign(this._request.data, {
    repo: (0, _classPrivateFieldGet2["default"])(this, _repo).instance,
    repoPath: (0, _classPrivateFieldGet2["default"])(this, _repo).path,
    repoMethod: (0, _classPrivateFieldGet2["default"])(this, _repo).method
  });
  var manager = new this._service._manager({
    request: this._request,
    service: this._service
  });
  (0, _classPrivateFieldGet2["default"])(this, _chain).push({
    method: method,
    args: args
  });
  this._request.chain = (0, _classPrivateFieldGet2["default"])(this, _chain);
  this._request._fetch || manager.save();
  manager.send();
  return manager.fetch();
}