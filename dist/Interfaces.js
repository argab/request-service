"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestRepository = exports.RequestHandler = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var RequestRepository = function RequestRepository() {
  (0, _classCallCheck2["default"])(this, RequestRepository);
  (0, _defineProperty2["default"])(this, "client", void 0);
};

exports.RequestRepository = RequestRepository;

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
    * @return Anything on Success
    * */

  }, {
    key: "onSuccess",
    value: function onSuccess() {}
    /*
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Anything on Error
    * */

  }, {
    key: "onError",
    value: function onError() {}
    /*
    * method executes within a Promise.prototype.catch()
    * @params: error
    * */

  }, {
    key: "onCatch",
    value: function onCatch() {}
    /*
    * method executes within a Promise.prototype.finally()
    * @params: request data
    * */

  }, {
    key: "onFinally",
    value: function onFinally() {}
    /*
    * method calls before request send
    * @params: request data
    * @return modified request data
    * */

  }, {
    key: "before",
    value: function before() {}
    /*
    * method calls on incoming response data
    * @params: response data
    * @return modified response data
    * */

  }, {
    key: "after",
    value: function after() {}
  }]);
  return RequestHandler;
}();

exports.RequestHandler = RequestHandler;