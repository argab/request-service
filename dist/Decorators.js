"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientDecorator = exports.RequestDecorator = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _helpers = require("./helpers");

var ClientDecorator = /*#__PURE__*/function () {
  function ClientDecorator() {
    (0, _classCallCheck2["default"])(this, ClientDecorator);
  }

  (0, _createClass2["default"])(ClientDecorator, [{
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function get() {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function post() {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "patch",
    value: function () {
      var _patch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function patch() {
        return _patch.apply(this, arguments);
      }

      return patch;
    }()
  }, {
    key: "put",
    value: function () {
      var _put = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function put() {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function _delete() {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }]);
  return ClientDecorator;
}();

exports.ClientDecorator = ClientDecorator;

var RequestDecorator = /*#__PURE__*/function () {
  function RequestDecorator(data) {
    (0, _classCallCheck2["default"])(this, RequestDecorator);
    (0, _defineProperty2["default"])(this, "data", {});
    (0, _defineProperty2["default"])(this, "_chain", []);
    this.data = data;

    var _proxy = function _proxy(state) {
      return (0, _helpers.proxy)(state, ['data'], function (state, method, args) {
        if (['chainPush', 'getChain'].includes(method)) return state[method](args[0]);
        state[method] instanceof Function && state.chainPush({
          method: method,
          args: args
        });
        if (method === 'await') return state["await"]();
        state[method] instanceof Function && state[method](args[0], args[1], args[2], args[3]);
        return _proxy(state);
      });
    };

    return _proxy(this);
  }

  (0, _createClass2["default"])(RequestDecorator, [{
    key: "chainPush",
    value: function chainPush(_ref) {
      var method = _ref.method,
          args = _ref.args;

      this._chain.push({
        method: method,
        args: args
      });
    }
  }, {
    key: "getChain",
    value: function getChain() {
      return (0, _toConsumableArray2["default"])(this._chain);
    }
  }, {
    key: "success",
    value: function success(callback) {
      this.data.success = callback;
    }
  }, {
    key: "then",
    value: function then(callback) {
      this.data.success = callback;
    }
  }, {
    key: "error",
    value: function error(callback) {
      this.data.error = callback;
    }
  }, {
    key: "catch",
    value: function _catch(callback) {
      this.data["catch"] = callback;
    }
  }, {
    key: "finally",
    value: function _finally(callback) {
      this.data["finally"] = callback;
    }
    /*
    * This method should be called at the end as it returns a new Promise.
    * @return: {result, statusCode}
    * */

  }, {
    key: "await",
    value: function _await() {
      var _this = this;

      return new Promise(function (resolve) {
        var interval = setInterval(function () {
          if (_this.data.statusCode) {
            clearInterval(interval);
            setTimeout(function () {
              return resolve({
                result: _this.data.result,
                statusCode: _this.data.statusCode
              });
            }, 10);
          }
        }, 1);
      });
    }
  }]);
  return RequestDecorator;
}();

exports.RequestDecorator = RequestDecorator;