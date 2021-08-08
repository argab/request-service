"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestClient = exports.RequestLoader = exports.RequestRepository = exports.RequestHandler = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var RequestClient = /*#__PURE__*/function () {
  function RequestClient() {
    (0, _classCallCheck2["default"])(this, RequestClient);
  }

  (0, _createClass2["default"])(RequestClient, [{
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
  return RequestClient;
}();

exports.RequestClient = RequestClient;

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
    * response checking method
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: Boolean
    * */
    function isSuccess(response) {}
    /*
    * response checking method
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: Boolean
    * */

  }, {
    key: "isError",
    value: function isError(response) {}
    /*
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: void
    * */

  }, {
    key: "onSuccess",
    value: function onSuccess(response) {}
    /*
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: void
    * */

  }, {
    key: "onError",
    value: function onError(response) {}
    /*
    * method executes within a Promise.prototype.catch()
    * @param: {Object} error
    * @return: void
    * */

  }, {
    key: "onCatch",
    value: function onCatch(error) {}
    /*
    * method executes within a Promise.prototype.finally()
    * @param: {Object} request data
    * @return: void
    * */

  }, {
    key: "onFinally",
    value: function onFinally(data) {}
    /*
    * method executes before request sent
    * @param: {Object} request data
    * @return: void
    * */

  }, {
    key: "before",
    value: function before(data) {}
    /*
    * method executes at the start of a Promise.prototype.then()
    * @param: {Object} response
    * @return: void
    * */

  }, {
    key: "after",
    value: function after(response) {}
    /*
    * method executes at the start of a Promise.prototype.catch()
    * @param: {Object} error
    * @return: void
    * */

  }, {
    key: "afterCatch",
    value: function afterCatch(error) {}
    /*
    * method executes at the start of a Promise.prototype.finally()
    * @param: {Object} request data
    * @return: void
    * */

  }, {
    key: "afterFinally",
    value: function afterFinally(data) {}
    /*
    * (This method is Abstract (Not subject to redeclare))
    * The request restarting method.
    * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
    * returning Boolean that whenever is TRUE then restarts the request.
    * @return: void
    * */

  }, {
    key: "retry",
    value: function retry(resolve) {}
  }]);
  return RequestHandler;
}();

exports.RequestHandler = RequestHandler;