var test = require('tape')
var bashEmulator = require('../../src')

test('sort', function (t) {
  t.plan(1)

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
      '/fruits.txt': {
        type: 'file',
        modified: Date.now(),
        content: `pêche
pomme
poire
abricot
banane
fraise
kiwi`
      },
      '/salary.txt': {
        type: 'file',
        modified: Date.now(),
        content: `alice 7200
bob 4800
claire 9100
daniel 3150
eve 6700
frank 10000
george 9999
hannah 5500
irene 4300
jack 7800`
      },
      '/empty.txt': {
        type: 'file',
        modified: Date.now(),
        content: ''
      }
    }
  })

//   emulator.run('sort noms.txt').then(function (output) {
//     var res = 'alfred\nbruce\npenguin\nselina\nsphinx\n'
//     t.equal(output, res, 'sort with file input (alphabetical order)')
//   })

//   emulator.run('sort -k2 noms.txt').then(function (output) {
//     var res = 'alfred\nbruce\npenguin\nselina\nsphinx\n'
//     t.equal(output, res, 'sort with file input (alphabetical order)')
//   })

//   emulator.run('cat fruits.txt | sort -k2').then(function (output) {
//     var res = `abricot
// banane
// fraise
// kiwi
// pêche
// poire
// pomme
// `
//     t.equal(output, res, 'sort with cat and wrong column index')
//   })

  emulator.run('cat fruits.txt | sort -n').then(function (output) {
    var res = `abricot
banane
fraise
kiwi
pêche
poire
pomme
`
    t.equal(output, res, 'sort with cat and useless -n option')
  })

//   emulator.run('sort -r noms.txt').then(function (output) {
//     var res = 'sphinx\nselina\npenguin\nbruce\nalfred\n'
//     t.equal(output, res, 'sort with file input (reverse alphabetical order)')
//   })

//   emulator.run('grep "^s" noms.txt | sort').then(function (output) {
//     var res = 'selina\nsphinx\n'
//     t.equal(output, res, 'sort after grep (alphabetical order)')
//   })

//   emulator.run('grep "^s" noms.txt | sort -r').then(function (output) {
//     var res = 'sphinx\nselina\n'
//     t.equal(output, res, 'sort after grep (reverse alphabetical order)')
//   })

//   emulator.run('cat duplicates.txt | sort -u').then(function (output) {
//     var res = 'fraise\nkiwi\npoire\npomme\n'
//     t.equal(output, res, 'sort after cat (remove duplicate)')
//   })

//   emulator.run('sort -ru duplicates.txt').then(function (output) {
//     var res = 'pomme\npoire\nkiwi\nfraise\n'
//     t.equal(output, res, 'sort with file input (remove duplicate & reverse order)')
//   })

//   emulator.run('sort -k2 salary.txt').then(function (output) {
//     var res = `frank 10000
// daniel 3150
// irene 4300
// bob 4800
// hannah 5500
// eve 6700
// alice 7200
// jack 7800
// claire 9100
// george 9999
// `
//     t.equal(output, res, 'sort with file input (sort by second column - salaries)')
//   })

//   emulator.run('sort -k 2 salary.txt').then(function (output) {
//     const expected = `frank 10000
// daniel 3150
// irene 4300
// bob 4800
// hannah 5500
// eve 6700
// alice 7200
// jack 7800
// claire 9100
// george 9999
// `
//     t.equal(output, expected, 'sort with -k 2 (same as -k2)')
//   })

//   emulator.run('sort -k2n salary.txt').then(function (output) {
//     var res = `daniel 3150
// irene 4300
// bob 4800
// hannah 5500
// eve 6700
// alice 7200
// jack 7800
// claire 9100
// george 9999
// frank 10000
// `
//     t.equal(output, res, 'sort with -k2n (sort by second column)')
//   })

//   emulator.run('sort -k2nr salary.txt').then(function (output) {
//     var res = `frank 10000
// george 9999
// claire 9100
// jack 7800
// alice 7200
// eve 6700
// hannah 5500
// bob 4800
// irene 4300
// daniel 3150
// `
//     t.equal(output, res, 'sort with -k2nr (sort by second column)')
//   })

//   emulator.run('sort -k salary.txt').then(null, function (err) {
//     var res = `sort: -k must be followed by a column number\n`
//     t.equal(err, res, 'sort with -k but no number')
//   })

//   emulator.run('sort -kn salary.txt').then(null, function (err) {
//     var res = `sort: -k must be followed by a column number\n`
//     t.equal(err, res, 'sort with -k but no number')
//   })

//   emulator.run('sort -r nofile.txt').then(null, function (err) {
//     t.equal(err, 'sort: nofile.txt: No such file or directory\n', 'sort returns error for missing file')
//   })

//   emulator.run('sort -x noms.txt').then(null, function (err) {
//     var res = 'sort: invalid option -x\n'
//     t.equal(err, res, 'sort fails with unknown option')
//   })

//   emulator.run('sort -k 2nr salary.txt').then(function (output) {
//     const expected = `frank 10000
// george 9999
// claire 9100
// jack 7800
// alice 7200
// eve 6700
// hannah 5500
// bob 4800
// irene 4300
// daniel 3150
// `
//     t.equal(output, expected, 'sort with -k 2nr (separate)')
//   })
})
