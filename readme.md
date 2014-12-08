promise-helpers
===============

Some helpers for using promises with node. The helpers are inspired by [Q][Q].

Note
----

The helpers extend the global `Promise` function and prototype. For this
to work, the `Promise` function must exist and match the ES6 `Promise` spec.

To add a shim for a valid spec, use npm modules like [es6-shim][es6-shim] or
[es6-promise][es6-promise].


[Q]: https://github.com/kriskowal/q
[es6-shim]: https://github.com/paulmillr/es6-shim
[es6-promise]: https://github.com/jakearchibald/es6-promise
