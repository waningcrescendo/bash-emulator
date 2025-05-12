var test = require('tape')
var bashEmulator = require('../../src')

test('sort', function (t) {
  t.plan(8)

  var emulator = bashEmulator({
    workingDirectory: '/',
    fileSystem: {
      '/noms.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'sphinx\nalfred\npenguin\nselina\nbruce'
      },
      '/duplicates.txt': {
        type: 'file',
        modified: Date.now(),
        content: 'pomme\npoire\npomme\nfraise\nkiwi\nfraise\npoire'
      },
      '/empty.txt': {
        type: 'file',
        modified: Date.now(),
        content: ''
      }
    }
  })

  emulator.run('sort noms.txt').then(function (output) {
    var res = 'alfred\nbruce\npenguin\nselina\nsphinx\n'
    t.equal(output, res, 'sort with file input (alphabetical order)')
  })

  emulator.run('sort -r noms.txt').then(function (output) {
    var res = 'sphinx\nselina\npenguin\nbruce\nalfred\n'
    t.equal(output, res, 'sort with file input (reverse alphabetical order)')
  })

  emulator.run('grep "^s" noms.txt | sort').then(function (output) {
    var res = 'selina\nsphinx\n'
    t.equal(output, res, 'sort after grep (alphabetical order)')
  })

  emulator.run('grep "^s" noms.txt | sort -r').then(function (output) {
    var res = 'sphinx\nselina\n'
    t.equal(output, res, 'sort after grep (reverse alphabetical order)')
  })

  emulator.run('cat duplicates.txt | sort -u').then(function (output) {
    var res = 'fraise\nkiwi\npoire\npomme\n'
    t.equal(output, res, 'sort after cat (remove duplicate)')
  })

  emulator.run('sort -ru duplicates.txt').then(function (output) {
    var res = 'pomme\npoire\nkiwi\nfraise\n'
    t.equal(output, res, 'sort with file input (remove duplicate & reverse order)')
  })

  emulator.run('sort -r nofile.txt').then(null, function (err) {
    t.equal(err, 'sort: nofile.txt: No such file or directory\n', 'sort returns error for missing file')
  })

  emulator.run('sort -x noms.txt').then(null, function (err) {
    var res = 'sort: invalid option -x\n'
    t.equal(err, res, 'sort fails with unknown option')
  })
})
