var lineNumber = require('../utils/lineNumber')

function grep (env, args) {
  // Ignore command name
  args.shift()

  var exitCode = 0
  var showNumbers = false
  var invertMatch = false
  var ignoreCase = false
  var countOnly = false

  // flag extraction
  var flags = []
  while (args[0] && args[0].startsWith('-')) {
    var flag = args.shift()
    for (var i = 1; i < flag.length; i++) {
      flags.push('-' + flag[i])
    }
  }

  // flag interpretation
  flags.forEach(function (f) {
    if (f === '-n') {
      showNumbers = true
      console.log('showNumbers is true')
    }
    if (f === '-v') {
      invertMatch = true
      console.log('invertmatch is true')
    }
    if (f === '-i') {
      ignoreCase = true
      console.log('ignorecase is true')
    }
    if (f === '-c') {
      countOnly = true
      console.log('countonly is true')
    }
  })

  var rawPattern = args.shift()
  if (!rawPattern) {
    env.error('need pattern for grep')
    return env.exit(2)
  }

  // pattern
  var pattern = rawPattern.replace(/^['"]|['"]$/g, '')
  var reFlags = ignoreCase ? 'i' : ''
  var re = new RegExp(pattern, reFlags)
  console.log('pattern ', pattern)

  function processLines (lines, prefix) {
    if (lines.length && lines[lines.length - 1] === '') {
      lines.pop()
    }
    var matchCount = 0
    lines.forEach(function (line, idx) {
      var isMatch = re.test(line)
      if (invertMatch) {
        isMatch = !isMatch
      }
      if (isMatch) {
        matchCount++
        if (!countOnly) {
          var out = line
          if (showNumbers) {
            out = lineNumber(6, idx + 1, out)
          }
          if (prefix) {
            out = prefix + ':' + out
          }
          console.log()
          env.output(out + '\n')
        }
      }
    })
    return matchCount
  }

  // if no file, read stdin
  if (args.length === 0) {
    console.log('NO FILE')
    var buffer = []
    return {
      input: function (chunk) {
        buffer = buffer.concat(chunk.split('\n'))
      },
      close: function () {
        var total = processLines(buffer, null)
        if (countOnly) {
          env.output(total + '\n')
        }
        console.log('exit ', exitCode)
        env.exit(exitCode)
      }
    }
  }

  // if file present
  Promise.all(
    args.map(function (path) {
      return env.system.read(path).then(
        function (content) {
          return content.split('\n')
        },
        function (err) {
          exitCode = 1
          env.error('grep: ' + err + '\n')
          return []
        }
      )
    })
  ).then(function (allLinesArrays) {
    var multiple = args.length > 1
    var grandTotal = 0

    allLinesArrays.forEach(function (lines, idx) {
      var prefix = multiple ? args[idx] : null
      grandTotal += processLines(lines, prefix)
    })
    if (countOnly) {
      console.log('COUNT ONLY')
      env.output(grandTotal + '\n')
    }
    env.exit(exitCode)
  })
}
module.exports = grep
