Promise.prototype.nodeify = function nodeify(fn) {
	if(!fn) return this

	if(typeof(fn) != 'function') throw new Error('nodeify must be called with a function, null or undefined')

	this.then(
		function(res) { fn(null, res) },
		function(err) { fn(err || new Error) })
}

Promise.prototype.spread = function spread(ok, fail) {
	var _this = this
	var resolver = function(arr) { ok.apply(_this, arr) }
	return this.then(ok ? resolver : undefined, fail)
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

Promise.denodeify = function denodeify(fn) {
	return function(/*..args*/) {
		var args = Array.prototype.slice.call(arguments)
		return Promise.nfapply(fn, args)
	}
}
