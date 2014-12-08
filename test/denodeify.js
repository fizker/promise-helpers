describe('Calling `denodeify()`', function() {
	beforeEach(function() {
		this.resolvee = fzkes.fake('resolved')
		this.rejectee = fzkes.fake('rejected')
		this.fn = fzkes.fake('fn')

		this.newFn = Promise.denodeify(this.fn)
	})

	it('should return a new function', function() {
		expect(this.newFn).to.be.a('function')
	})

	describe('and the new function is called', function() {
		beforeEach(function() {
			this.result = this.newFn(1, {}, 'abc')
		})

		it('should call the function with the arguments', function() {
			this.fn
				.should.have.been.calledWith(1, {}, 'abc')
		})
		it('should add a callback at the end', function() {
			expect(this.fn._calls[0][3])
				.to.be.a('function')
		})
		it('should return a promise', function() {
			expect(this.result)
				.to.have.property('then').be.a('function')
		})

		describe('and the callback is called with an error', function() {
			beforeEach(function() {
				this.error = new Error
				this.fn.callsArg({ arguments: [this.error], now: true })
			})
			it('should reject the promise', function() {
				return this.result
					.should.eventually.be.rejectedWith(this.error)
			})
		})

		describe('and the callback is called with no arguments', function() {
			beforeEach(function() {
				this.fn.callsArg({ now: true })
			})
			it('should resolve the promise with an empty array', function() {
				return this.result
					.should.eventually.deep.equal([])
			})
		})

		describe('and the callback is called with a single non-error argument', function() {
			beforeEach(function() {
				this.fn.callsArg({ now: true, arguments: [null, 1] })
			})
			it('should resolve the promise with an array with the argument', function() {
				return this.result
					.should.eventually.deep.equal([1])
			})
		})

		describe('and the callback is called with multiple non-error arguments', function() {
			beforeEach(function() {
				this.fn.callsArg({ now: true, arguments: [null, 1,2,3] })
			})
			it('should resolve the promise with an array with the arguments', function() {
				return this.result
					.should.eventually.deep.equal([1,2,3])
			})
		})
	})
})
