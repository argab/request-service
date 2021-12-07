"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxy = exports.mergeDeep = exports.isPrototype = exports.applyCall = void 0;

var mergeDeep = function mergeDeep(target, source) {
  var isObject = function isObject(obj) {
    return obj && obj instanceof Object;
  };

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(function (key) {
    var targetValue = target[key];
    var sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
};

exports.mergeDeep = mergeDeep;

var proxy = function proxy(state, publicProps, handler) {
  return new Proxy(state, {
    get: function get(instance, prop) {
      if (instance.hasOwnProperty(prop) && Array.isArray(publicProps) && publicProps.includes(prop)) return instance[prop];
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return handler && handler(instance, prop, args);
      };
    }
  });
};

exports.proxy = proxy;

var isPrototype = function isPrototype(state, target) {
  return (state === null || state === void 0 ? void 0 : state.isPrototypeOf(target)) || (state === null || state === void 0 ? void 0 : state.prototype) && state.prototype === (target === null || target === void 0 ? void 0 : target.prototype);
};

exports.isPrototype = isPrototype;

var applyCall = function applyCall(state, method, arrayArgs) {
  Array.isArray(arrayArgs) || (arrayArgs = [arrayArgs]);
  return state[method].apply(state, arrayArgs);
};

exports.applyCall = applyCall;