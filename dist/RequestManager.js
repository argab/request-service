"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestManager = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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
    if (!(request instanceof _Request.Request)) throw 'The RequestManager`s "request" is not an instance of "Request".';
    if (!(service instanceof _Request.RequestService)) throw 'The RequestManager`s "service" is not an instance of "RequestService".';
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
    value: function () {
      var _fetchData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this = this;

        var data, $this, handlers, client, loader, dataClient, getLoader;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = this._request.data;
                $this = this;
                handlers = this._factory.getHandlers(data, function (handler) {
                  handler.prototype.retry = function (resolve) {
                    return $this.retry(resolve);
                  };
                });
                _context.next = 5;
                return this.resolveHandlers(data, handlers, 'before');

              case 5:
                client = this._factory.getClient(data);
                loader = this._factory.getLoader(data);
                dataClient = data.stubData || client[data.method](data);

                getLoader = function getLoader() {
                  var _this$_service;

                  loader && (loader.pending = (_this$_service = _this._service) === null || _this$_service === void 0 ? void 0 : _this$_service.getLog().filter(function (r) {
                    return r.data.useLoader && !r.data.statusCode;
                  }).length);
                  return loader;
                };

                return _context.abrupt("return", {
                  data: data,
                  client: client,
                  handlers: handlers,
                  loader: loader,
                  dataClient: dataClient,
                  getLoader: getLoader
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchData() {
        return _fetchData.apply(this, arguments);
      }

      return fetchData;
    }()
  }, {
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var _getLoader,
            _this2 = this;

        var _yield$this$fetchData, data, handlers, dataClient, getLoader, promise;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.fetchData();

              case 2:
                _yield$this$fetchData = _context5.sent;
                data = _yield$this$fetchData.data;
                handlers = _yield$this$fetchData.handlers;
                dataClient = _yield$this$fetchData.dataClient;
                getLoader = _yield$this$fetchData.getLoader;
                promise = dataClient instanceof Promise ? dataClient : new Promise(function (res) {
                  return setTimeout(function () {
                    return res(dataClient);
                  }, 100);
                });
                (_getLoader = getLoader()) === null || _getLoader === void 0 ? void 0 : _getLoader.start();
                promise.then(function (response) {
                  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this2.setResult(response);

                          case 2:
                            _context2.next = 4;
                            return _this2.onResponse(response, handlers);

                          case 4:
                            data.statusCode || _this2.setStatusCode(response, 200);

                          case 5:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }))();
                })["catch"](function (error) {
                  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _this2.setError(error);

                            _context3.next = 3;
                            return _this2.handleError(error, handlers);

                          case 3:
                            data.statusCode || _this2.setStatusCode((error === null || error === void 0 ? void 0 : error.response) || error, 500);

                          case 4:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }))();
                })["finally"](function () {
                  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                    var _getLoader2;

                    var retry;
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            (_getLoader2 = getLoader()) === null || _getLoader2 === void 0 ? void 0 : _getLoader2.end();
                            _context4.next = 3;
                            return _this2.onFinally(handlers);

                          case 3:
                            data.statusCode || _this2.setStatusCode(null, 200);
                            retry = _this2._retry instanceof Function ? _this2._retry() : _this2.retry();
                            retry === false && _this2._request._resolve();

                          case 6:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }))();
                });

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function send() {
        return _send.apply(this, arguments);
      }

      return send;
    }()
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
      request.methods.forEach(function (method) {
        return request[method] instanceof Function && (request._fetch[method] = function (arg) {
          request.resolveMethods.includes(method) ? arg instanceof Function || (arg = function arg() {}) : request[method](arg);

          _this3._resolve.push({
            method: method,
            arg: arg
          });

          request.chain.push({
            method: method,
            args: [arg]
          });
          return request._fetch;
        });
      });
      return request._fetch;
    }
  }, {
    key: "resolveHandlers",
    value: function () {
      var _resolveHandlers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data, handlers, action) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", new Promise(function (resolve) {
                  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                    var source, result, fetch;
                    return _regenerator["default"].wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            source = (0, _toConsumableArray2["default"])(handlers);
                            result = undefined;

                            fetch = /*#__PURE__*/function () {
                              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                                return _regenerator["default"].wrap(function _callee6$(_context6) {
                                  while (1) {
                                    switch (_context6.prev = _context6.next) {
                                      case 0:
                                        if (!(source.length === 0)) {
                                          _context6.next = 2;
                                          break;
                                        }

                                        return _context6.abrupt("return", resolve(result));

                                      case 2:
                                        source[0][action] instanceof Function && (result = source[0][action](data));
                                        _context6.t0 = result instanceof Promise;

                                        if (!_context6.t0) {
                                          _context6.next = 8;
                                          break;
                                        }

                                        _context6.next = 7;
                                        return result;

                                      case 7:
                                        result = _context6.sent;

                                      case 8:
                                        source.shift();
                                        _context6.next = 11;
                                        return fetch();

                                      case 11:
                                      case "end":
                                        return _context6.stop();
                                    }
                                  }
                                }, _callee6);
                              }));

                              return function fetch() {
                                return _ref6.apply(this, arguments);
                              };
                            }();

                            _context7.next = 5;
                            return fetch();

                          case 5:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }))();
                }));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function resolveHandlers(_x, _x2, _x3) {
        return _resolveHandlers.apply(this, arguments);
      }

      return resolveHandlers;
    }()
  }, {
    key: "resolveRequest",
    value: function resolveRequest(methods, data, handlers) {
      var _this4 = this;

      return new Promise(function (resolve) {
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
          var source, fetch;
          return _regenerator["default"].wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  source = _this4._resolve.filter(function (r) {
                    return methods.includes(r.method);
                  });

                  if (!(source.length === 0)) {
                    _context10.next = 3;
                    break;
                  }

                  return _context10.abrupt("return", resolve(false));

                case 3:
                  fetch = /*#__PURE__*/function () {
                    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(data) {
                      return _regenerator["default"].wrap(function _callee9$(_context9) {
                        while (1) {
                          switch (_context9.prev = _context9.next) {
                            case 0:
                              if (!(source.length === 0)) {
                                _context9.next = 2;
                                break;
                              }

                              return _context9.abrupt("return", resolve(true));

                            case 2:
                              _context9.prev = 2;
                              _context9.t0 = source[0].arg instanceof Function;

                              if (!_context9.t0) {
                                _context9.next = 7;
                                break;
                              }

                              _context9.next = 7;
                              return _this4.setResult(source[0].arg(data));

                            case 7:
                              _context9.next = 13;
                              break;

                            case 9:
                              _context9.prev = 9;
                              _context9.t1 = _context9["catch"](2);
                              _context9.next = 13;
                              return _this4.handleError(_context9.t1, handlers);

                            case 13:
                              source.shift();
                              _context9.next = 16;
                              return fetch(_this4._request.data.result);

                            case 16:
                            case "end":
                              return _context9.stop();
                          }
                        }
                      }, _callee9, null, [[2, 9]]);
                    }));

                    return function fetch(_x4) {
                      return _ref8.apply(this, arguments);
                    };
                  }();

                  _context10.next = 6;
                  return fetch(data);

                case 6:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10);
        }))();
      });
    }
  }, {
    key: "handleError",
    value: function handleError(error, handlers) {
      var _this5 = this;

      return new Promise(function (resolve) {
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
          var onCatch, fetch;
          return _regenerator["default"].wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return _this5.resolveHandlers(error, handlers, 'afterCatch');

                case 2:
                  onCatch = _this5._resolve.filter(function (r) {
                    return r.method === 'catch';
                  });

                  if (!(onCatch.length === 0)) {
                    _context12.next = 8;
                    break;
                  }

                  _this5.setError(error);

                  _context12.next = 7;
                  return _this5.setResult(_this5.resolveHandlers(error, handlers, 'onCatch'));

                case 7:
                  return _context12.abrupt("return", resolve());

                case 8:
                  fetch = /*#__PURE__*/function () {
                    var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(error) {
                      return _regenerator["default"].wrap(function _callee11$(_context11) {
                        while (1) {
                          switch (_context11.prev = _context11.next) {
                            case 0:
                              if (!(onCatch.length === 0)) {
                                _context11.next = 2;
                                break;
                              }

                              return _context11.abrupt("return", resolve());

                            case 2:
                              _context11.prev = 2;

                              _this5.setError(error);

                              _context11.t0 = onCatch[0].arg instanceof Function;

                              if (!_context11.t0) {
                                _context11.next = 8;
                                break;
                              }

                              _context11.next = 8;
                              return _this5.setResult(onCatch[0].arg(error));

                            case 8:
                              _context11.next = 16;
                              break;

                            case 10:
                              _context11.prev = 10;
                              _context11.t1 = _context11["catch"](2);

                              _this5.setError(_context11.t1);

                              _context11.next = 15;
                              return _this5.setResult(_this5.resolveHandlers(_context11.t1, handlers, 'onCatch'));

                            case 15:
                              error = _context11.t1;

                            case 16:
                              onCatch.shift();
                              _context11.next = 19;
                              return fetch(error);

                            case 19:
                            case "end":
                              return _context11.stop();
                          }
                        }
                      }, _callee11, null, [[2, 10]]);
                    }));

                    return function fetch(_x5) {
                      return _ref10.apply(this, arguments);
                    };
                  }();

                  _context12.next = 11;
                  return fetch(error);

                case 11:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12);
        }))();
      });
    }
  }, {
    key: "setError",
    value: function setError(error) {
      this._request.data.dataError = error;
    }
  }, {
    key: "onResponse",
    value: function () {
      var _onResponse = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(response, handlers) {
        var _response, isSuccess, isError, resolved, _resolved;

        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.resolveHandlers(response, handlers, 'after');

              case 2:
                _response = _objectSpread({}, response);
                _context13.next = 5;
                return this.resolveHandlers(_response, handlers, 'isSuccess');

              case 5:
                isSuccess = _context13.sent;
                _context13.next = 8;
                return this.resolveHandlers(_response, handlers, 'isError');

              case 8:
                isError = _context13.sent;

                if (!(isSuccess === true && this._resolve.map(function (i) {
                  return i.method;
                }).includes('success'))) {
                  _context13.next = 19;
                  break;
                }

                _context13.next = 12;
                return this.resolveRequest(['success'], response, handlers);

              case 12:
                resolved = _context13.sent;
                _context13.t0 = resolved;

                if (_context13.t0) {
                  _context13.next = 17;
                  break;
                }

                _context13.next = 17;
                return this.setResult(this.resolveHandlers(response, handlers, 'onSuccess'));

              case 17:
                _context13.next = 32;
                break;

              case 19:
                if (!(isError === true && this._resolve.map(function (i) {
                  return i.method;
                }).includes('error'))) {
                  _context13.next = 29;
                  break;
                }

                _context13.next = 22;
                return this.resolveRequest(['error'], response, handlers);

              case 22:
                _resolved = _context13.sent;
                _context13.t1 = _resolved;

                if (_context13.t1) {
                  _context13.next = 27;
                  break;
                }

                _context13.next = 27;
                return this.setResult(this.resolveHandlers(response, handlers, 'onError'));

              case 27:
                _context13.next = 32;
                break;

              case 29:
                if (!((isSuccess === true || isSuccess === undefined) && (isError === undefined || isError === false))) {
                  _context13.next = 32;
                  break;
                }

                _context13.next = 32;
                return this.resolveRequest(['then'], response, handlers);

              case 32:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function onResponse(_x6, _x7) {
        return _onResponse.apply(this, arguments);
      }

      return onResponse;
    }()
  }, {
    key: "onFinally",
    value: function () {
      var _onFinally = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(handlers) {
        var request, resolved;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                request = this._request;
                _context14.next = 3;
                return this.resolveHandlers(request.data, handlers, 'afterFinally');

              case 3:
                _context14.next = 5;
                return this.resolveRequest(['finally'], request.data, handlers);

              case 5:
                resolved = _context14.sent;
                _context14.t0 = resolved;

                if (_context14.t0) {
                  _context14.next = 10;
                  break;
                }

                _context14.next = 10;
                return this.setResult(this.resolveHandlers(request.data, handlers, 'onFinally'));

              case 10:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function onFinally(_x8) {
        return _onFinally.apply(this, arguments);
      }

      return onFinally;
    }()
  }, {
    key: "setResult",
    value: function () {
      var _setResult = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(result) {
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.t0 = result === undefined;

                if (_context15.t0) {
                  _context15.next = 10;
                  break;
                }

                if (!(result instanceof Promise)) {
                  _context15.next = 8;
                  break;
                }

                _context15.next = 5;
                return result;

              case 5:
                _context15.t1 = _context15.sent;
                _context15.next = 9;
                break;

              case 8:
                _context15.t1 = result;

              case 9:
                this._request.data.result = _context15.t1;

              case 10:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function setResult(_x9) {
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