require('promise.prototype.finally')

Promise.prototype.nodeify = function nodeify(fn) {
	if(!fn) return this

	if(typeof(fn) != 'function') throw new Error('nodeify must be called with a function, null or undefined')

	this.then(
		function(res) { fn(null, res) },
		function(err) { fn(err || new Error) })
}

Promise.prototype.spread = function spread(ok, fail) {
	var _this = this
	var resolver = function(arr) {
		return Promise.all(arr)
			.then(function(arr) { return ok.apply(_this, arr) })
	}
	return this.then(ok ? resolver : undefined, fail)
}

Promise.prototype.all = function all() {
	return this.then(function(arr) {
		return Promise.all(arr)
	})
}

Promise.prototype.done = function done() {
	this.catch(function(e) {
		setTimeout(function() { throw e }, 0)
	})
}

Promise.nfapply = function nfapply(fn, args) {
	return new Promise(function(resolve, reject) {
		fn.apply(null, args.concat(function(err/*, ...args*/) {
			if(err) return reject(err)
			var args = Array.prototype.slice.call(arguments, 1)
			resolve(args)
		}))
	})
}

Promise.nfcall = function nfcall(fn/*, ...args*/) {
	var args = Array.prototype.slice.call(arguments, 1)
	return Promise.nfapply(fn, args)
}

Promise.denodeify = function denodeify(fn, opts) {
	return function(/*..args*/) {
		var args = Array.prototype.slice.call(arguments)
		var p = Promise.nfapply(fn, args)
		if(opts && opts.singleResult) p = p.then(function(results) { return results[0] })
		return p
	}
}
