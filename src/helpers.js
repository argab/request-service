
export const mergeDeep = function (target, source) {
    const isObject = (obj) => obj && obj instanceof Object
    if (!isObject(target) || !isObject(source)) {
        return source
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key]
        const sourceValue = source[key]

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue)
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue)
        } else {
            target[key] = sourceValue
        }
    })

    return target
}

export const proxy = function (state, publicProps, handler) {
    return new Proxy(state, {
        get: function (instance, prop) {
            if (instance.hasOwnProperty(prop) && Array.isArray(publicProps) && publicProps.includes(prop))
                return instance[prop]
            return function (...args) {
                return handler && handler(instance, prop, args)
            }
        }
    })
}

export const isPrototype = function (state, target) {
    return state?.isPrototypeOf(target) || (state?.prototype && state.prototype === target?.prototype)
}

export const applyCall = function (state, method, arrayArgs) {
    Array.isArray(arrayArgs) || (arrayArgs = [arrayArgs])
    return state[method].apply(state, arrayArgs)
}
