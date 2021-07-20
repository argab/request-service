"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestLoader = exports.RequestRepository = exports.RequestHandler = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var RequestRepository = function RequestRepository() {
  (0, _classCallCheck2["default"])(this, RequestRepository);
  (0, _defineProperty2["default"])(this, "client", void 0);
};

exports.RequestRepository = RequestRepository;

var RequestLoader = /*#__PURE__*/function () {
  function RequestLoader() {
    (0, _classCallCheck2["default"])(this, RequestLoader);
    (0, _defineProperty2["default"])(this, "pending", void 0);
  }

  (0, _createClass2["default"])(RequestLoader, [{
    key: "start",
    value: function start() {}
  }, {
    key: "end",
    value: function end() {}
  }]);
  return RequestLoader;
}();

exports.RequestLoader = RequestLoader;

var RequestHandler = /*#__PURE__*/function () {
  function RequestHandler() {
    (0, _classCallCheck2["default"])(this, RequestHandler);
  }

  (0, _createClass2["default"])(RequestHandler, [{
    key: "isSuccess",
    value:
    /*
    * request checking method
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Boolean on Success
    * */
    function isSuccess() {}
    /*
    * request checking method
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Boolean on Error
    * */

  }, {
    key: "isError",
    value: function isError() {}
    /*
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return: void
    * */

  }, {
    key: "onSuccess",
    value: function onSuccess() {}
    /*
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return: void
    * */

  }, {
    key: "onError",
    value: function onError() {}
    /*
    * method executes within a Promise.prototype.catch()
    * @params: error
    * @return: void
    * */

  }, {
    key: "onCatch",
    value: function onCatch() {}
    /*
    * method executes within a Promise.prototype.finally()
    * @params: request data
    * @return: void
    * */

  }, {
    key: "onFinally",
    value: function onFinally() {}
    /*
    * method executes before request sent
    * @params: request data
    * @return: void
    * */

  }, {
    key: "before",
    value: function before() {}
    /*
    * method executes at the start of a Promise.prototype.then()
    * @params: response
    * @return: void
    * */

  }, {
    key: "after",
    value: function after() {}
    /*
    * method executes at the start of a Promise.prototype.catch()
    * @params: error
    * @return: void
    * */

  }, {
    key: "afterCatch",
    value: function afterCatch() {}
    /*
    * method executes at the start of a Promise.prototype.finally()
    * @params: request data
    * @return: void
    * */

  }, {
    key: "afterFinally",
    value: function afterFinally() {}
  }]);
  return RequestHandler;
}();

exports.RequestHandler = RequestHandler;