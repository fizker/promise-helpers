describe('Calling `done()`', function() {
	beforeEach(function() {
		this.result = Promise.resolve().done()
	})
	it('should return nothing', function() {
		expect(this.result)
			.to.be.undefined
	})

	describe('and the promise is rejected', function() {
		beforeEach(function() {
			fzkes.fake(global, 'setTimeout')

			this.error = new Error('test')
			var p = Promise.reject(this.error)
			p.done()
			return p.catch(function() {})
		})
		it('should call setTimeout()', function() {
			setTimeout
				.should.have.been.called
		})
		it('should throw when setTimeout() triggers', function() {
			expect(function() {
				setTimeout.callsArg({ now: true })
			}).to.throw(this.error)
		})
	})
})
