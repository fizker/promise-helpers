describe('Calling `spread()`', function() {
	beforeEach(function() {
		this.resolvee = fzkes.fake('resolved').returns('got resolved')
		this.rejectee = fzkes.fake('rejected').returns('got rejected')
	})

	it('should return a promise', function() {
		expect(Promise.resolve().spread(this.resolvee, this.rejectee))
			.to.have.property('then').be.a('function')
	})

	describe('without any functions', function() {
		describe('on a resolved promise', function() {
			beforeEach(function() {
				this.promise = Promise.resolve([1,2,3])
					.spread()
			})
			it('should not affect the promise', function() {
				return this.promise
					.should.eventually.deep.equal([1,2,3])
			})
		})

		describe('on a failed promise', function() {
			beforeEach(function() {
				this.promise = Promise.reject([1,2,3])
					.spread()
			})
			it('should not affect the promise', function() {
				return this.promise
					.should.eventually.be.rejectedWith([1,2,3])
			})
		})
	})

	describe('on a promise containing an array', function() {
		beforeEach(function() {
			this.promise = Promise.resolve([1,2,3])
				.spread(this.resolvee, this.rejectee)
			return this.promise
		})
		it('should unfold the array', function() {
			this.resolvee
				.should.have.been.calledWith(1,2,3)
		})
		it('should not call the rejection handler', function() {
			this.rejectee
				.should.not.have.been.called
		})
		it('should return the answer', function() {
			return this.promise.should.eventually.equal('got resolved')
		})
	})

	describe('on a promise not containing an array', function() {
		beforeEach(function() {
			this.promise = Promise.resolve(1)
				.spread(this.resolvee, this.rejectee)
			return this.promise.catch(function() {})
		})
		it('should reject the promise', function() {
			return this.promise
				.should.eventually.be.rejected
		})
		it('should not call the rejection handler', function() {
			this.rejectee
				.should.not.have.been.called
		})
		it('should not call the success handler', function() {
			this.resolvee
				.should.not.have.been.called
		})
	})

	describe('on a rejected promise', function() {
		beforeEach(function() {
			this.error = {}
			this.promise = Promise.reject(this.error)
				.spread(this.resolvee, this.rejectee)
			return this.promise
		})
		it('should call the rejection handler', function() {
			this.rejectee
				.should.have.been.calledWith(this.error)
		})
		it('should not call the success handler', function() {
			this.resolvee
				.should.not.have.been.called
		})
		it('should return the answer', function() {
			return this.promise.should.eventually.equal('got rejected')
		})
	})
})
