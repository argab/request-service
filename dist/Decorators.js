"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientDecorator = exports.RequestDecorator = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Interfaces = require("./Interfaces");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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

var RequestDecorator = /*#__PURE__*/function (_RequestResolve) {
  (0, _inherits2["default"])(RequestDecorator, _RequestResolve);

  var _super = _createSuper(RequestDecorator);

  function RequestDecorator(data) {
    var _this;

    (0, _classCallCheck2["default"])(this, RequestDecorator);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "data", {});
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "chain", []);
    _this.data = data;
    return _this;
  }

  (0, _createClass2["default"])(RequestDecorator, [{
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
  }]);
  return RequestDecorator;
}(_Interfaces.RequestResolve);

exports.RequestDecorator = RequestDecorator;