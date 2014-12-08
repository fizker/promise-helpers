describe('Calling `nodeify()`', function() {
	beforeEach(function() {
		this.resolvee = fzkes.fake('resolved')
		this.rejectee = fzkes.fake('rejected')
	})

	describe('with a callback', function() {
		beforeEach(function() {
			this.callback = fzkes.fake('callback')
			this.result = new Promise(function(resolve, reject) {
				this.resolve = resolve
				this.reject = reject
			}.bind(this)).nodeify(this.callback)
		})
		it('should return nothing', function() {
			expect(this.result)
				.to.be.undefined
		})

		describe('and the promise is resolved', function() {
			beforeEach(function(done) {
				this.callback.calls(function() {done()})
				this.result = {}
				this.resolve(this.result)
			})
			it('should call the callback with null and the result', function() {
				this.callback
					.should.have.been.calledWithExactly(null, this.result)
			})
		})

		describe('and the promise is rejected', function() {
			beforeEach(function(done) {
				this.callback.calls(function() {done()})
				this.result = {}
				this.reject(this.result)
			})
			it('should call the callback with the result as the first param', function() {
				this.callback
					.should.have.been.calledWithExactly(this.result)
			})
		})
	})

	describe('with a non-function', function() {
		it('should throw an error', function() {
			expect(function() { Promise.resolve().nodeify(1) })
				.to.throw(/^nodeify must be called with a function/i)
		})
	})

	describe('without a callback', function() {
		beforeEach(function() {
			this.promise = Promise.resolve()
			this.result = this.promise.nodeify(null)
		})
		it('should return the promise', function() {
			expect(this.result).to.equal(this.promise)
		})
	})
})
