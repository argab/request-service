"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestMediatorDecorator = exports.RequestMediator = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _helpers = require("./helpers");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var RequestMediator = /*#__PURE__*/function () {
  function RequestMediator(stagedData) {
    (0, _classCallCheck2["default"])(this, RequestMediator);
    (0, _defineProperty2["default"])(this, "staged", {});
    stagedData instanceof Object && (this.staged = stagedData);
  }

  (0, _createClass2["default"])(RequestMediator, [{
    key: "config",
    value: function config(data) {
      data instanceof Object && (this.staged = (0, _helpers.mergeDeep)(this.staged, data));
    }
  }, {
    key: "stubData",
    value: function stubData(_stubData) {
      this.config({
        stubData: _stubData
      });
    }
  }]);
  return RequestMediator;
}();

exports.RequestMediator = RequestMediator;

var RequestMediatorDecorator = /*#__PURE__*/function (_RequestMediator) {
  (0, _inherits2["default"])(RequestMediatorDecorator, _RequestMediator);

  var _super = _createSuper(RequestMediatorDecorator);

  function RequestMediatorDecorator(stagedData) {
    (0, _classCallCheck2["default"])(this, RequestMediatorDecorator);
    return _super.call(this, stagedData);
  }

  (0, _createClass2["default"])(RequestMediatorDecorator, [{
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
  return RequestMediatorDecorator;
}(RequestMediator);

exports.RequestMediatorDecorator = RequestMediatorDecorator;