"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestManager = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Request = require("./Request");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RequestManager = /*#__PURE__*/function () {
  function RequestManager(_ref) {
    var request = _ref.request,
        service = _ref.service;
    (0, _classCallCheck2["default"])(this, RequestManager);
    (0, _defineProperty2["default"])(this, "_request", void 0);
    (0, _defineProperty2["default"])(this, "_service", void 0);
    (0, _defineProperty2["default"])(this, "_factory", void 0);
    (0, _defineProperty2["default"])(this, "_resolve", []);
    (0, _defineProperty2["default"])(this, "_retry", void 0);
    if (false === request instanceof _Request.Request) throw 'The RequestManager`s "request" is not an instance of "Request".';
    if (false === service instanceof _Request.RequestService) throw 'The RequestManager`s "service" is not an instance of "RequestService".';
    this._request = request;
    this._service = service;
    this._factory = service._factory;
  }

  (0, _createClass2["default"])(RequestManager, [{
    key: "save",
    value: function save() {
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
                  return _this2.setResult(response);

                case 2:
                  _context.next = 4;
                  return _this2.onResponse(response, handlers);

                case 4:
                  data.statusCode || _this2.setStatusCode(response, 200);

                case 5:
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
                  _this2.setError(error);

                  _context2.next = 3;
                  return _this2.onCatch(error, handlers);

                case 3:
                  data.statusCode || _this2.setStatusCode(error, 500);

                case 4:
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

        var retry;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (_getLoader2 = getLoader()) === null || _getLoader2 === void 0 ? void 0 : _getLoader2.end();
                _context3.next = 3;
                return _this2.onFinally(handlers);

              case 3:
                data.statusCode || _this2.setStatusCode(null, 200);
                retry = _this2._retry instanceof Function ? _this2._retry() : _this2.retry();
                retry === false && _this2._request._resolve();

              case 6:
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
      var _this3 = this;

      var request = this._request;
      if (request._fetch instanceof Promise) return request._fetch;
      request._fetch = new Promise(function (resolve) {
        return request._resolve = function () {
          return resolve(request.data.result);
        };
      });

      request._methods.forEach(function (method) {
        return request[method] instanceof Function && (request._fetch[method] = function (arg) {
          _this3._resolve.push({
            method: method,
            arg: arg
          });

          request.chain.push({
            method: method,
            args: [arg]
          });
          _Request.REQUEST_RESOLVE_METHODS.includes(method) || request[method](arg);
          return request._fetch;
        });
      });

      return request._fetch;
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
    key: "resolveRequest",
    value: function resolveRequest(methods, data, handlers) {
      var _this4 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(resolve) {
          var source, fetch;
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  source = _this4._resolve.filter(function (r) {
                    return methods.includes(r.method);
                  });

                  if (!(source.length === 0)) {
                    _context5.next = 3;
                    break;
                  }

                  return _context5.abrupt("return", resolve(false));

                case 3:
                  fetch = /*#__PURE__*/function () {
                    var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
                      return _regenerator["default"].wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (!(source.length === 0)) {
                                _context4.next = 2;
                                break;
                              }

                              return _context4.abrupt("return", resolve(true));

                            case 2:
                              _context4.prev = 2;
                              _context4.next = 5;
                              return _this4.setResult(source[0].arg(data));

                            case 5:
                              _context4.next = 11;
                              break;

                            case 7:
                              _context4.prev = 7;
                              _context4.t0 = _context4["catch"](2);
                              _context4.next = 11;
                              return _this4.handleError(_context4.t0, handlers);

                            case 11:
                              source.shift();
                              _context4.next = 14;
                              return fetch(_this4._request.data.result);

                            case 14:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4, null, [[2, 7]]);
                    }));

                    return function fetch(_x4) {
                      return _ref6.apply(this, arguments);
                    };
                  }();

                  _context5.next = 6;
                  return fetch(data);

                case 6:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x3) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "handleError",
    value: function handleError(error, handlers) {
      var _this5 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(resolve) {
          var onCatch, fetch;
          return _regenerator["default"].wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  onCatch = _this5._resolve.filter(function (r) {
                    return r.method === 'catch';
                  });

                  if (!(onCatch.length === 0)) {
                    _context7.next = 6;
                    break;
                  }

                  _this5.setError(error);

                  _context7.next = 5;
                  return _this5.setResult(_this5.resolveHandlers(error, handlers, 'onCatch'));

                case 5:
                  return _context7.abrupt("return", resolve());

                case 6:
                  fetch = /*#__PURE__*/function () {
                    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(error) {
                      return _regenerator["default"].wrap(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              if (!(onCatch.length === 0)) {
                                _context6.next = 2;
                                break;
                              }

                              return _context6.abrupt("return", resolve());

                            case 2:
                              _context6.prev = 2;

                              _this5.setError(error);

                              _context6.next = 6;
                              return _this5.setResult(onCatch[0].arg(error));

                            case 6:
                              _context6.next = 14;
                              break;

                            case 8:
                              _context6.prev = 8;
                              _context6.t0 = _context6["catch"](2);

                              _this5.setError(_context6.t0);

                              _context6.next = 13;
                              return _this5.setResult(_this5.resolveHandlers(_context6.t0, handlers, 'onCatch'));

                            case 13:
                              error = _context6.t0;

                            case 14:
                              onCatch.shift();
                              _context6.next = 17;
                              return fetch(error);

                            case 17:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      }, _callee6, null, [[2, 8]]);
                    }));

                    return function fetch(_x6) {
                      return _ref8.apply(this, arguments);
                    };
                  }();

                  _context7.next = 9;
                  return fetch(error);

                case 9:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        return function (_x5) {
          return _ref7.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "setError",
    value: function setError(error) {
      this._request.data.dataError = error;
    }
  }, {
    key: "onResponse",
    value: function () {
      var _onResponse = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(response, handlers) {
        var _response, isSuccess, isError, resolved, _resolved;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.resolveHandlers(response, handlers, 'after');
                _response = _objectSpread({}, response);
                isSuccess = this.resolveHandlers(_response, handlers, 'isSuccess');
                isError = this.resolveHandlers(_response, handlers, 'isError');

                if (!(isSuccess === true || isSuccess !== true && isError !== true)) {
                  _context8.next = 14;
                  break;
                }

                _context8.next = 7;
                return this.resolveRequest(['success', 'then'], response, handlers);

              case 7:
                resolved = _context8.sent;
                _context8.t0 = resolved;

                if (_context8.t0) {
                  _context8.next = 12;
                  break;
                }

                _context8.next = 12;
                return this.setResult(this.resolveHandlers(response, handlers, 'onSuccess'));

              case 12:
                _context8.next = 22;
                break;

              case 14:
                if (!(isError === true)) {
                  _context8.next = 22;
                  break;
                }

                _context8.next = 17;
                return this.resolveRequest(['error'], response, handlers);

              case 17:
                _resolved = _context8.sent;
                _context8.t1 = _resolved;

                if (_context8.t1) {
                  _context8.next = 22;
                  break;
                }

                _context8.next = 22;
                return this.setResult(this.resolveHandlers(response, handlers, 'onError'));

              case 22:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function onResponse(_x7, _x8) {
        return _onResponse.apply(this, arguments);
      }

      return onResponse;
    }()
  }, {
    key: "onCatch",
    value: function () {
      var _onCatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(error, handlers) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                this.resolveHandlers(error, handlers, 'afterCatch');
                _context9.next = 3;
                return this.handleError(error, handlers);

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function onCatch(_x9, _x10) {
        return _onCatch.apply(this, arguments);
      }

      return onCatch;
    }()
  }, {
    key: "onFinally",
    value: function () {
      var _onFinally = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(handlers) {
        var request, resolved;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                request = this._request;
                this.resolveHandlers(request.data, handlers, 'afterFinally');
                _context10.next = 4;
                return this.resolveRequest(['finally'], request.data, handlers);

              case 4:
                resolved = _context10.sent;
                _context10.t0 = resolved;

                if (_context10.t0) {
                  _context10.next = 9;
                  break;
                }

                _context10.next = 9;
                return this.setResult(this.resolveHandlers(request.data, handlers, 'onFinally'));

              case 9:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function onFinally(_x11) {
        return _onFinally.apply(this, arguments);
      }

      return onFinally;
    }()
  }, {
    key: "setResult",
    value: function () {
      var _setResult = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(result) {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.t0 = result === undefined;

                if (_context11.t0) {
                  _context11.next = 10;
                  break;
                }

                if (!(result instanceof Promise)) {
                  _context11.next = 8;
                  break;
                }

                _context11.next = 5;
                return result;

              case 5:
                _context11.t1 = _context11.sent;
                _context11.next = 9;
                break;

              case 8:
                _context11.t1 = result;

              case 9:
                this._request.data.result = _context11.t1;

              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function setResult(_x12) {
        return _setResult.apply(this, arguments);
      }

      return setResult;
    }()
  }, {
    key: "setStatusCode",
    value: function setStatusCode(source, def) {
      def = Number.isNaN(+def) ? 0 : +def;
      this._request.data.statusCode = Number.isNaN(+(source === null || source === void 0 ? void 0 : source.status)) ? def : +source.status;
    }
  }, {
    key: "retry",
    value: function retry(resolve) {
      var _this6 = this;

      var request = this._request;

      var retry = function retry() {
        new _this6._service._retry({
          request: request,
          service: _this6._service,
          resolve: resolve
        }).retry();
      };

      if (resolve !== undefined) return this._retry = retry;
      if (request.data.retry || request.data.retryOnCatch) return retry();
      return false;
    }
  }]);
  return RequestManager;
}();

exports.RequestManager = RequestManager;