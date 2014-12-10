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

It will also pass the array through `Promise.all()`, so the above example is
also equal to

    Promise.resolve([ firstPromise, secondPromise ])
        .spread(function(firstResult, secondResult) {
            ...
        })


### Promise#all()

A chainable convenience for `Promise.all()`.

    somePromise
        .then(function(values) {
            return values.map(transformThatReturnsPromises)
        })
        .all()
        .then(handleResults)

is equivalent to

    somePromise
        .then(function(values) {
            return values.map(transformThatReturnsPromises)
        })
        .then(function(results) { return Promise.all(results) })
        .then(handleResults)


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


### Promise#done()

Caps a promise chain. No promise is returned from this call.

If the promise would be rejected, `done()` will rethrow the error in global
scope.


### Promise.nfapply(fn, args)

A convenience method for wrapping a function expecting a Node-style callback in
a promise.

It unfolds the `args` array as parameters for the `fn` param, and appends a
callback on the end.

If the first parameter is set, the promise is rejected with the error.

If the first parameter is not set, the promise is resolved with an array
containing the other parameters.

If no arguments are supplied on a success-case, the promise will resolve to
an empty array.


### Promise.nfcall(fn[, arg1, ...])

A variant of `Promise.nfapply()`, where the arguments are given one-by-one.
Think `function#call()` and `function#apply()`.


### Promise.denodeify(fn, options)

Returns a `Promise`-wrapped version of `fn`. When called, it will transfer the
arguments + a callback to the original function, and resolve the promise when
the original is done.

It is a convenience method around `Promise.nfapply.bind(null, fn)`.

It can take an options, `singleResult`, which, when `true`, will always return
the first result of the result-array that `nfapply` returns.

This means that for no results, the first param will be undefined, and for
multiple results, only the first is passed along.


[Q]: https://github.com/kriskowal/q
[es6-shim]: https://github.com/paulmillr/es6-shim
[es6-promise]: https://github.com/jakearchibald/es6-promise
