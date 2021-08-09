"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestRetry = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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
    if (false === request instanceof _Request.Request) throw 'The RequestRetry`s "request" is not an instance of "Request".';
    if (false === service instanceof _Request.RequestService) throw 'The RequestRetry`s "service" is not an instance of "RequestService".';
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
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                request = this.request;

                if (this.resolve !== undefined) {
                  resolve = this.resolve;
                  this.retryUnset();
                } else {
                  resolve = request.data.retryOnCatch && request.data.dataError ? request.data.retryOnCatch : null;
                  resolve === null && (resolve = request.data.retry || null);
                }

                retry = resolve === true || (resolve instanceof Function ? resolve(request.data) : false);
                _context.t0 = retry instanceof Promise;

                if (!_context.t0) {
                  _context.next = 8;
                  break;
                }

                _context.next = 7;
                return retry;

              case 7:
                retry = _context.sent;

              case 8:
                return _context.abrupt("return", retry);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getRetry() {
        return _getRetry.apply(this, arguments);
      }

      return getRetry;
    }()
  }, {
    key: "retryUnset",
    value: function retryUnset() {
      this.request.data.retry = null;
      this.request.data.retryOnCatch = null;
    }
  }, {
    key: "retryChain",
    value: function retryChain() {
      this.setRetryChain();
      var request = this.request;
      var chain = request.retryChainSet.length ? request.retryChainSet : request.chain;
      var middleware = new this.service._middleware(this.service, request);
      request.chain = [];
      request.retryChainSet = [];
      var pipe = middleware[chain[0].method](chain[0].args[0], chain[0].args[1], chain[0].args[2], chain[0].args[3]);
      chain.shift();
      chain.forEach(function (_ref2) {
        var method = _ref2.method,
            args = _ref2.args;
        pipe[method] instanceof Function && (pipe = pipe[method](args[0], args[1], args[2], args[3]));
      });
    }
  }, {
    key: "setRetryChain",
    value: function setRetryChain() {
      var request = this.request;
      var set = (0, _helpers.proxy)({}, null, function (state, method, args) {
        request.retryChainSet.push({
          method: method,
          args: args
        });
        return set;
      });

      if (request.data.retryChain instanceof Function) {
        request.retryChainSet = [];
        var chain = request.data.retryChain({
          set: set,
          chain: (0, _toConsumableArray2["default"])(request.chain),
          data: request.data
        });
        Array.isArray(chain) && (request.retryChainSet = chain);
      }
    }
  }, {
    key: "retry",
    value: function () {
      var _retry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this = this;

        var request, retryMaxCount, retryCount, retry;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                request = this.request;
                retryMaxCount = request.data.retryMaxCount;
                retryCount = request.data.retryCount;

                if (!(retryMaxCount && retryCount >= retryMaxCount)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", this.retryUnset(request));

              case 5:
                _context2.next = 7;
                return this.getRetry(request);

              case 7:
                retry = _context2.sent;

                if (!(Boolean(retry) === false)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", this.retryUnset(request));

              case 10:
                Object.assign(request.data, {
                  repo: null,
                  repoPath: null,
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