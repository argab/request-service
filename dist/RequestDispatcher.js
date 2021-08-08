"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestDispatcher = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Request = require("./Request");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RequestDispatcher = /*#__PURE__*/function () {
  function RequestDispatcher(_ref) {
    var request = _ref.request,
        service = _ref.service;
    (0, _classCallCheck2["default"])(this, RequestDispatcher);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    (0, _defineProperty2["default"])(this, "_service", void 0);
    (0, _defineProperty2["default"])(this, "_factory", void 0);
    if (false === request instanceof _Request.Request) throw 'The RequestDispatchers`s "request" is not an instance of "Request".';
    if (false === service instanceof _Request.RequestService) throw 'The RequestDispatchers`s "service" is not an instance of "RequestService".';
    this._request = request;
    this._service = service;
    this._factory = service._factory;
  }

  (0, _createClass2["default"])(RequestDispatcher, [{
    key: "push",
    value: function push() {
      this._request.data.log && this._service.log(this._request);
    }
  }, {
    key: "fetchData",
    value: function fetchData() {
      var _this = this;

      var data = this._request.data;

      var handlers = this._factory.getHandlers(data, function (handler) {
        handler.prototype.retry = function (resolve) {
          return _this.retry(resolve);
        };
      });

      this.resolveHandlers(data, handlers, 'before');

      var client = this._factory.getClient(data);

      var loader = this._factory.getLoader(data);

      var dataClient = data.stubData || client[data.method](data);

      var getLoader = function getLoader() {
        var _this$_service;

        loader && (loader.pending = (_this$_service = _this._service) === null || _this$_service === void 0 ? void 0 : _this$_service.getLog().filter(function (r) {
          return r.data.useLoader && !r.data.statusCode;
        }).length);
        return loader;
      };

      return {
        data: data,
        client: client,
        handlers: handlers,
        loader: loader,
        dataClient: dataClient,
        getLoader: getLoader
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _getLoader,
          _this2 = this;

      var _this$fetchData = this.fetchData(),
          data = _this$fetchData.data,
          handlers = _this$fetchData.handlers,
          dataClient = _this$fetchData.dataClient,
          getLoader = _this$fetchData.getLoader;

      var promise = dataClient instanceof Promise ? dataClient : new Promise(function (res) {
        return setTimeout(function () {
          return res(dataClient);
        }, 100);
      });
      (_getLoader = getLoader()) === null || _getLoader === void 0 ? void 0 : _getLoader.start();
      promise.then( /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(response) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _this2.onResponse(response, handlers);

                case 2:
                  data.statusCode || (data.statusCode = 200);

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }())["catch"]( /*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(error) {
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _this2.onCatch(error, handlers);

                case 2:
                  data.statusCode || (data.statusCode = 500);

                case 3:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }())["finally"]( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var _getLoader2;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (_getLoader2 = getLoader()) === null || _getLoader2 === void 0 ? void 0 : _getLoader2.end();
                _context3.next = 3;
                return _this2.onFinally(handlers);

              case 3:
                data.statusCode || (data.statusCode = 200);

                if (!(data.retryOnCatch || data.retry)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 7;
                return _this2.retry();

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })));
    }
  }, {
    key: "fetch",
    value: function fetch() {
      var request = this._request;
      var fetch = this.awaitResult();

      request._methods.forEach(function (method) {
        return request[method] instanceof Function && (fetch[method] = function (arg) {
          request.chain.push({
            method: method,
            args: [arg]
          });
          request[method](arg);
          return fetch;
        });
      });

      return fetch;
    }
  }, {
    key: "resolveHandlers",
    value: function resolveHandlers(data, handlers, action) {
      var result = undefined;
      handlers.forEach(function (handler) {
        if (handler[action] instanceof Function) {
          var _data = handler[action](data);

          _data === undefined || (result = _data);
        }
      });
      return result;
    }
  }, {
    key: "onResponse",
    value: function () {
      var _onResponse = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(response, handlers) {
        var request, _response, isSuccess, isError;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = this._request;
                this.resolveHandlers(response, handlers, 'after');
                _response = _objectSpread({}, response);
                isSuccess = this.resolveHandlers(_response, handlers, 'isSuccess');
                isError = this.resolveHandlers(_response, handlers, 'isError');

                if (!(isSuccess === true || isSuccess !== true && isError !== true)) {
                  _context4.next = 10;
                  break;
                }

                _context4.next = 8;
                return this.setResult(request.data.success instanceof Function ? request.data.success(response) : this.resolveHandlers(response, handlers, 'onSuccess'));

              case 8:
                _context4.next = 13;
                break;

              case 10:
                if (!(isError === true)) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 13;
                return this.setResult(request.data.error instanceof Function ? request.data.error(response) : this.resolveHandlers(response, handlers, 'onError'));

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function onResponse(_x3, _x4) {
        return _onResponse.apply(this, arguments);
      }

      return onResponse;
    }()
  }, {
    key: "onCatch",
    value: function () {
      var _onCatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(error, handlers) {
        var request;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                request = this._request;
                this.resolveHandlers(error, handlers, 'afterCatch');

                if (!(request.data["catch"] instanceof Function)) {
                  _context5.next = 16;
                  break;
                }

                _context5.prev = 3;
                request.data.dataError = error;
                _context5.next = 7;
                return this.setResult(request.data["catch"](error));

              case 7:
                _context5.next = 14;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](3);
                request.data.dataError = _context5.t0;
                _context5.next = 14;
                return this.setResult(this.resolveHandlers(_context5.t0, handlers, 'onCatch'));

              case 14:
                _context5.next = 19;
                break;

              case 16:
                request.data.dataError = error;
                _context5.next = 19;
                return this.setResult(this.resolveHandlers(error, handlers, 'onCatch'));

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 9]]);
      }));

      function onCatch(_x5, _x6) {
        return _onCatch.apply(this, arguments);
      }

      return onCatch;
    }()
  }, {
    key: "onFinally",
    value: function () {
      var _onFinally = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(handlers) {
        var request, result;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                request = this._request;
                this.resolveHandlers(request.data, handlers, 'afterFinally');
                result = null;

                if (request.data["finally"] instanceof Function) {
                  try {
                    result = request.data["finally"](request.data);
                  } catch (err) {
                    result = this.resolveHandlers(err, handlers, 'onCatch');
                  }
                } else {
                  result = this.resolveHandlers(request.data, handlers, 'onFinally');
                }

                _context6.t0 = request.data.result === null;

                if (!_context6.t0) {
                  _context6.next = 8;
                  break;
                }

                _context6.next = 8;
                return this.setResult(result);

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function onFinally(_x7) {
        return _onFinally.apply(this, arguments);
      }

      return onFinally;
    }()
  }, {
    key: "awaitResult",
    value: function awaitResult() {
      var withRetryCheck = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var request = this._request;
      return new Promise(function (resolve) {
        var interval = setInterval(function () {
          if (withRetryCheck && (request.data.retry || request.data.retryOnCatch)) {
            return;
          }

          if (request.data.statusCode) {
            clearInterval(interval);
            setTimeout(function () {
              return resolve(request.data.result);
            }, 10);
          }
        }, 1);
      });
    }
  }, {
    key: "setResult",
    value: function () {
      var _setResult = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(result) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                result === undefined && (result = null);

                if (!(result instanceof Promise)) {
                  _context7.next = 7;
                  break;
                }

                _context7.next = 4;
                return result;

              case 4:
                _context7.t0 = _context7.sent;
                _context7.next = 8;
                break;

              case 7:
                _context7.t0 = result;

              case 8:
                this._request.data.result = _context7.t0;

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function setResult(_x8) {
        return _setResult.apply(this, arguments);
      }

      return setResult;
    }()
  }, {
    key: "retry",
    value: function () {
      var _retry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(resolve) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.awaitResult(false);

              case 2:
                new this._service._retry({
                  request: this._request,
                  service: this._service,
                  resolve: resolve
                }).retry();

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function retry(_x9) {
        return _retry.apply(this, arguments);
      }

      return retry;
    }()
  }]);
  return RequestDispatcher;
}();

exports.RequestDispatcher = RequestDispatcher;