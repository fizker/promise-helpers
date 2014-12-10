describe('Calling `all()`', function() {
	beforeEach(function() {
		this.result = Promise.resolve([]).all()
	})

	it('should return a promise', function() {
		expect(this.result)
			.to.have.property('then').be.a('function')
	})

	describe('on a promise that does not resolve in an array', function() {
		beforeEach(function() {
			this.result = Promise.resolve(1).all()
		})
		it('should reject the promise', function() {
			return this.result
				.should.eventually.be.rejected
		})
	})

	describe('on a promise that does resolve to an array', function() {
		beforeEach(function() {
			this.resolvedResult = {}
			fzkes.fake(Promise, 'all')
				.returns(Promise.resolve(this.resolvedResult))
			this.array = []
			this.result = Promise.resolve(this.array).all()
			return this.result
		})
		it('should pass that array through `Promise.all()`', function() {
			Promise.all
				.should.have.been.calledWith(this.array)
			this.array
				.should.deep.equal([])
		})
		it('should return the returned promise', function() {
			return this.result
				.should.eventually.equal(this.resolvedResult)
		})
	})
})
