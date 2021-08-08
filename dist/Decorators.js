"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestMiddlewareDecorator = exports.RequestDecorator = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _Request2 = require("./Request");

var _RequestMiddleware2 = require("./RequestMiddleware");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var RequestMiddlewareDecorator = /*#__PURE__*/function (_RequestMiddleware) {
  (0, _inherits2["default"])(RequestMiddlewareDecorator, _RequestMiddleware);

  var _super = _createSuper(RequestMiddlewareDecorator);

  function RequestMiddlewareDecorator() {
    (0, _classCallCheck2["default"])(this, RequestMiddlewareDecorator);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(RequestMiddlewareDecorator, [{
    key: "stubData",
    value: function stubData(_stubData) {
      this.config({
        stubData: _stubData
      });
    }
  }, {
    key: "unlog",
    value: function unlog() {
      this.config({
        log: false
      });
    }
  }, {
    key: "headers",
    value: function headers(_headers) {
      this.config({
        headers: _headers
      });
    }
  }, {
    key: "encode",
    value: function encode() {
      this.config({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
  }, {
    key: "form",
    value: function form() {
      this.config({
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  }, {
    key: "json",
    value: function json() {
      this.config({
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });
    }
  }, {
    key: "html",
    value: function html() {
      this.config({
        headers: {
          'Accept': 'text/html'
        }
      });
    }
  }, {
    key: "stream",
    value: function stream() {
      this.config({
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
    }
  }, {
    key: "useLoader",
    value: function useLoader() {
      var _useLoader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.config({
        useLoader: Boolean(_useLoader)
      });
    }
  }, {
    key: "bg",
    value: function bg() {
      this.config({
        useLoader: false
      });
    }
  }]);
  return RequestMiddlewareDecorator;
}(_RequestMiddleware2.RequestMiddleware);

exports.RequestMiddlewareDecorator = RequestMiddlewareDecorator;

var RequestDecorator = /*#__PURE__*/function (_Request) {
  (0, _inherits2["default"])(RequestDecorator, _Request);

  var _super2 = _createSuper(RequestDecorator);

  function RequestDecorator(data) {
    var _this;

    (0, _classCallCheck2["default"])(this, RequestDecorator);
    _this = _super2.call(this, data);
    _this._methods = _this._methods.concat(['success', 'then', 'error', 'catch', 'finally']);
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
}(_Request2.Request);

exports.RequestDecorator = RequestDecorator;