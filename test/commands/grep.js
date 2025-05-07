var test = require('tape')
var bashEmulator = require('../../src')

test('grep', function (t) {
  t.plan(15)

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
      '/3.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'fraise\npamplemousse\nkiwi'
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

  emulator.run('cat 1.txt | grep -n "^f"').then(function (output) {
    var res = '     1  first\n     4  fourth\n     5  fifth\n'
    t.equal(output, res, 'grep with -n shows line numbers')
  })

  emulator.run('grep').then(null, function (err) {
    var res = 'need pattern for grep'
    t.equal(err, res, 'grep fails with no pattern')
  })

  emulator.run('grep "^f" nofile.txt').then(null, function (err) {
    t.equal(err, 'grep: nofile.txt: No such file or directory\n', 'grep returns error for missing file')
  })

  emulator.run('grep "fraise" 2.txt 3.txt').then(function (output) {
    var res = '2.txt:fraise\n3.txt:fraise\n'
    t.equal(output, res, 'grep prefixes matches with filename when searching multiple files')
  })

  emulator.run('grep "^f" 2.txt').then(function (output) {
    var res = 'fraise\n'
    t.equal(output, res, 'grep with file input and regex')
  })

  emulator.run('grep -c "^f" 1.txt').then(function (output) {
    var res = '3\n'
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

