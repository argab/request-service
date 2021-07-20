"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDeep = void 0;

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