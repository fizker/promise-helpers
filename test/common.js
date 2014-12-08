require('es6-promise').polyfill()

global.chai = require('chai')
global.expect = chai.expect
chai.should()

chai.use(require('chai-as-promised'))

global.fzkes = require('fzkes')
chai.use(fzkes)

// apply extensions
require('../index')
