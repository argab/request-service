"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestRetry = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Request = require("./Request");
var _helpers = require("./helpers");
var RequestRetry = /*#__PURE__*/function () {
  function RequestRetry(_ref) {
    var request = _ref.request,
      service = _ref.service,
      resolve = _ref.resolve;
    (0, _classCallCheck2["default"])(this, RequestRetry);
    (0, _defineProperty2["default"])(this, "request", void 0);
    (0, _defineProperty2["default"])(this, "service", void 0);
    (0, _defineProperty2["default"])(this, "resolve", void 0);
    if (!(request instanceof _Request.Request)) throw 'The RequestRetry`s "request" is not an instance of "Request".';
    if (!(service instanceof _Request.RequestService)) throw 'The RequestRetry`s "service" is not an instance of "RequestService".';
    this.request = request;
    this.service = service;
    this.resolve = resolve;
    var maxCount = this.request.data.retryMaxCount;
    var timeout = this.request.data.retryTimeout;
    var retryCount = this.request.data.retryCount;
    this.request.data.retryMaxCount = Number.isNaN(+maxCount) ? 0 : +maxCount;
    this.request.data.retryTimeout = Number.isNaN(+timeout) ? 0 : +timeout;
    this.request.data.retryCount = Number.isNaN(+retryCount) ? 0 : +retryCount;
  }
  (0, _createClass2["default"])(RequestRetry, [{
    key: "getRetry",
    value: function () {
      var _getRetry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var request, resolve, retry;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              request = this.request;
              if (this.resolve !== undefined) {
                resolve = this.resolve;
              } else {
                resolve = request.data.retryOnCatch && request.data.dataError ? request.data.retryOnCatch : null;
                resolve === null && (resolve = request.data.retry || null);
              }
              retry = resolve instanceof Function ? resolve(request.data) : resolve;
              if (!(retry instanceof Promise)) {
                _context.next = 9;
                break;
              }
              _context.next = 6;
              return retry;
            case 6:
              _context.t0 = _context.sent;
              _context.next = 10;
              break;
            case 9:
              _context.t0 = retry;
            case 10:
              return _context.abrupt("return", _context.t0);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getRetry() {
        return _getRetry.apply(this, arguments);
      }
      return getRetry;
    }()
  }, {
    key: "retryChain",
    value: function retryChain() {
      this.setRetryChain();
      var request = this.request;
      var chain = request.chain;
      var middleware = new this.service._middleware(this.service, request);
      request.chain = [];
      var pipe = (0, _helpers.applyCall)(middleware, chain[0].method, chain[0].args);
      chain.shift();
      chain.forEach(function (_ref2) {
        var method = _ref2.method,
          args = _ref2.args;
        pipe[method] instanceof Function && (pipe = (0, _helpers.applyCall)(pipe, method, args));
      });
    }
  }, {
    key: "setRetryChain",
    value: function setRetryChain() {
      var request = this.request;
      var set = (0, _helpers.proxy)({}, null, function (state, method, args) {
        request.chain.push({
          method: method,
          args: args
        });
        return set;
      });
      if (request.data.retryChain instanceof Function) {
        var chain = request.chain.slice();
        request.chain = [];
        var _chain = request.data.retryChain({
          set: set,
          chain: chain,
          data: request.data
        });
        Array.isArray(_chain) && (request.chain = _chain);
        request.chain.length || (request.chain = chain);
      }
    }
  }, {
    key: "retry",
    value: function () {
      var _retry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this = this;
        var request, retryMaxCount, retryCount, retry;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              request = this.request;
              retryMaxCount = request.data.retryMaxCount;
              retryCount = request.data.retryCount;
              if (!(retryMaxCount && retryCount >= retryMaxCount)) {
                _context2.next = 5;
                break;
              }
              return _context2.abrupt("return", request._resolve());
            case 5:
              _context2.next = 7;
              return this.getRetry(request);
            case 7:
              retry = _context2.sent;
              if (!(Boolean(retry) === false)) {
                _context2.next = 10;
                break;
              }
              return _context2.abrupt("return", request._resolve());
            case 10:
              Object.assign(request.data, {
                repo: null,
                repoPath: null,
                repoMethod: null,
                statusCode: 0,
                retry: request.data.retry,
                retryOnCatch: request.data.retryOnCatch,
                retryCount: retryCount + 1,
                retryMaxCount: retryMaxCount,
                dataError: null,
                result: null
              });
              setTimeout(function () {
                return _this.retryChain();
              }, request.data.retryTimeout);
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function retry() {
        return _retry.apply(this, arguments);
      }
      return retry;
    }()
  }]);
  return RequestRetry;
}();
exports.RequestRetry = RequestRetry;