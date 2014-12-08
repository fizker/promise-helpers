promise-helpers
===============

Some helpers for using promises with node. The helpers are inspired by [Q][Q].


Note
----

The helpers extend the global `Promise` function and prototype. For this
to work, the `Promise` function must exist and match the ES6 `Promise` spec.

To add a shim for a valid spec, use npm modules like [es6-shim][es6-shim] or
[es6-promise][es6-promise].


Extensions
----------

### Promise#spread(okHandler[, errorHandler])

An alternative to `then()`. If the promise resolves to an array, the `okHandler`
is called with the contents as parameters. This makes it very convenient to use
with `Promise.all()`.

    Promise.all([ firstPromise, secondPromise ])
        .spread(function(firstResult, secondResult) {
            ...
        })

is equal to

    Promise.all([ firstPromise, secondPromise ])
        .then(function(results) {
            var firstResult = results[0]
            var secondResult = results[1]
            ...
        })


### Promise#nodeify(fn)

A helper to bridge a promise-based API to node-style functions.

If a function is passed to the `nodeify()` function, it will be called when the
promise resolves, with the error as the first parameter.

If no function is passed in, it returns the promise directly.

    function someFunction(args, cb) {
        return doWork(args).nodeify(cb)
    }

is equal to

    function someFunction(args, cb) {
        var promise = doWork(args)
        if(!cb) return promise

        promise.then(function(result) { cb(result) }, cb)
    }


[Q]: https://github.com/kriskowal/q
[es6-shim]: https://github.com/paulmillr/es6-shim
[es6-promise]: https://github.com/jakearchibald/es6-promise
