"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestMiddleware = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _helpers = require("./helpers");

var _Request = require("./Request");

var _Interfaces = require("./Interfaces");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RequestMiddleware = /*#__PURE__*/function () {
  function RequestMiddleware(service) {
    var request = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck2["default"])(this, RequestMiddleware);
    (0, _defineProperty2["default"])(this, "_staged", {});
    (0, _defineProperty2["default"])(this, "_chain", []);
    (0, _defineProperty2["default"])(this, "_service", void 0);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    (0, _defineProperty2["default"])(this, "_repo", null);
    (0, _defineProperty2["default"])(this, "_repoPath", null);
    (0, _defineProperty2["default"])(this, "_runRepo", false);
    if (false === service instanceof _Request.RequestService) throw 'The RequestMiddleware`s "service" is not an instance of "RequestService".';
    if (request && false === request instanceof _Request.Request) throw 'The RequestMiddleware`s "request" is not an instance of "Request".';
    this._service = service;
    this._request = request;

    var _proxy = function _proxy(state) {
      return (0, _helpers.proxy)(state, null, function (state, method, args) {
        var _state$_request;

        if (state._runRepo) {
          state._runRepo = false;

          state._chain.push({
            method: method,
            args: args
          });

          return state._repo[method](args[0], args[1], args[2], args[3]);
        }

        if (['repo', 'stub'].includes(method)) {
          state._chain.push({
            method: method,
            args: args
          });

          state._repo = state._service[method](args[0], args[1], args[2], args[3]);
          state._repo instanceof _Interfaces.RequestRepository && (state._repo.client = _proxy(state));
          state._repoPath = args[0];
          state._runRepo = true;
          return _proxy(state);
        }

        var client = state._staged.client || ((_state$_request = state._request) === null || _state$_request === void 0 ? void 0 : _state$_request.data.client) || state._service._config.client;

        if (state._service._factory.getClientPrototype({
          client: client
        }).prototype[method] instanceof Function) {
          var uri = args[0];
          var params = args[1];

          if (state._request) {
            state._request.chain = [];
            state._request.data = (0, _helpers.mergeDeep)(state._request.data, state._staged);
            Object.assign(state._request.data, {
              method: method,
              uri: uri,
              params: params,
              repo: null,
              repoPath: null,
              statusCode: 0,
              dataError: null,
              result: null
            });
          } else {
            state._request = state._service._factory.create({
              method: method,
              uri: uri,
              params: params,
              config: (0, _helpers.mergeDeep)(_objectSpread({}, state._service._config), state._staged)
            });
          }

          Object.assign(state._request.data, {
            repo: state._repo,
            repoPath: state._repoPath
          });
          var manager = new state._service._manager({
            request: state._request,
            service: state._service
          });

          state._chain.push({
            method: method,
            args: args
          });

          state._request.chain = state._chain;
          state._request._fetch || manager.save();
          manager.send();
          return manager.fetch();
        }

        if (state[method] instanceof Function) {
          state._chain.push({
            method: method,
            args: args
          });

          state[method](args[0], args[1], args[2], args[3]);
          return _proxy(state);
        }
      });
    };

    return _proxy(this);
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