"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientDecorator = exports.RequestDecorator = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

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
  function RequestDecorator(request) {
    (0, _classCallCheck2["default"])(this, RequestDecorator);
    (0, _defineProperty2["default"])(this, "data", {});
    this.data = request;
  }

  (0, _createClass2["default"])(RequestDecorator, [{
    key: "success",
    value: function success(callback) {
      this.data.success = callback;
      return this;
    }
  }, {
    key: "then",
    value: function then(callback) {
      this.data.success = callback;
      return this;
    }
  }, {
    key: "error",
    value: function error(callback) {
      this.data.error = callback;
      return this;
    }
  }, {
    key: "catch",
    value: function _catch(callback) {
      this.data["catch"] = callback;
      return this;
    }
  }, {
    key: "finally",
    value: function _finally(callback) {
      this.data["finally"] = callback;
      return this;
    }
  }, {
    key: "done",
    value: function done(messageOnSuccess) {
      this.data.done = messageOnSuccess;
      return this;
    }
  }, {
    key: "alert",
    value: function alert(messageOnError) {
      this.data.alert = messageOnError;
      return this;
    }
  }]);
  return RequestDecorator;
}();

exports.RequestDecorator = RequestDecorator;