var test = require('tape')
var bashEmulator = require('../../src')

test('grep', function (t) {
  t.plan(10)

  var emulator = bashEmulator({
    workingDirectory: '/',
    fileSystem: {
      '/1.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'first\nsecond\nthird\nfourth\nfifth'
      },
      '/2.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'pomme\npoire\nabricot\nfraise'
      },
      '/empty.txt': {
        type: 'file',
        modified: Date.now(),
        content: ''
      }
    }
  })

  emulator.run('grep "^f" 1.txt').then(function (output) {
    var res = 'first\nfourth\nfifth\n'
    t.equal(output, res, 'grep with file input and regex')
  })

  emulator.run('grep "^f" 2.txt').then(function (output) {
    var res = 'fraise\n'
    t.equal(output, res, 'grep with file input and regex')
  })

  emulator.run('cat empty.txt | grep "^f"').then(function (output) {
    var res = ''
    t.equal(output, res, 'grep doesn\'t produce anything without stdin')
  })

  emulator.run('cat 1.txt | grep "^f"').then(function (output) {
    var res = 'first\nfourth\nfifth\n'
    t.equal(output, res, 'grep with no file input and regex')
  })

  emulator.run('cat 1.txt | grep -v "^f"').then(function (output) {
    var res = 'second\nthird\n'
    t.equal(output, res, 'grep with no file input and regex with -v option')
  })

  emulator.run('cat 2.txt | grep -i "^P"').then(function (output) {
    var res = 'pomme\npoire\n'
    t.equal(output, res, 'grep with no file input and regex with -i option')
  })

  emulator.run('cat 2.txt | grep -v -i "^F"').then(function (output) {
    var res = 'pomme\npoire\nabricot\n'
    t.equal(output, res, 'grep with no file input and regex with -v + -i option')
  })

  emulator.run('cat 1.txt | grep -c "^f"').then(function (output) {
    var res = '3\n'
    t.equal(output, res, 'grep with no file input and regex with -c option')
  })

  emulator.run('cat 2.txt | grep -cv "e$"').then(function (output) {
    var res = '1\n'
    t.equal(output, res, 'grep with no file input and regex with -c + -v option')
  })

  emulator.run('cat 2.txt | grep -cvi "E$"').then(function (output) {
    var res = '1\n'
    t.equal(output, res, 'grep with no file input and regex with -c _ -v + -i option')
  })
})

