Promise.prototype.nodeify = function(fn) {
	if(!fn) return this

	if(typeof(fn) != 'function') throw new Error('nodeify must be called with a function, null or undefined')

	this.then(
		function(res) { fn(null, res) },
		function(err) { fn(err || new Error) })
}

Promise.prototype.spread = function(ok, fail) {
	var _this = this
	var resolver = function(arr) { ok.apply(_this, arr) }
	return this.then(ok ? resolver : undefined, fail)
}
