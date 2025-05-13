var test = require('tape')
var bashEmulator = require('../../src')

test('cat', function (t) {
  t.plan(7)

  var emulator = bashEmulator({
    workingDirectory: '/',
    fileSystem: {
      '/1.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'first'
      },
      '/2.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'second'
      },
      '/3.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'third'
      }
    }
  })

  emulator.run('cat 1.txt /3.txt /2.txt').then(function (output) {
    var res =
      'first\n' +
      'third\n' +
      'second\n'
    t.equal(output, res, 'cats multiple files')
  })

  emulator.run('cat nonexistent /1.txt').then(null, function (err) {
    var res =
      'cat: nonexistent: No such file or directory' +
      '\n' +
      'first\n'
    t.equal(err, res, 'with errors')
  })

  emulator.run('cat -n 1.txt /3.txt /2.txt').then(function (output) {
    var res =
      '     1  first\n' +
      '     2  third\n' +
      '     3  second\n'
    t.equal(output, res, 'with -n')
  })

  emulator.run('cat 1.txt -n /3.txt /2.txt').then(function (output) {
    var res =
      '     1  first\n' +
      '     2  third\n' +
      '     3  second\n'
    t.equal(output, res, 'with -n in between')
  })

  emulator.run('cat 1.txt /3.txt /2.txt -n').then(function (output) {
    var res =
      '     1  first\n' +
      '     2  third\n' +
      '     3  second\n'
    t.equal(output, res, 'with -n as last')
  })

  emulator.run('cat 1.txt | cat').then(function (output) {
    var res = 'first\n'
    t.equal(output, res, 'cat from stdin')
  })

  emulator.run('cat 1.txt 2.txt | cat -n').then(function (output) {
    var res =
      '     1  first\n' +
      '     2  second\n'
    t.equal(output, res, 'cat from stdin with -n')
  })
})
