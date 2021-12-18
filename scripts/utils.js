const execa = require('execa')

exports.run = (bin, args, opts = {}) => execa.sync(bin, args, { stdio: 'inherit', ...opts })
