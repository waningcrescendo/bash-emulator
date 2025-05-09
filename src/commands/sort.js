function sort (env, args) {
    // Ignore command name
  args.shift()

  var exitCode = 0
  var alphabeticalOrder = true

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
    if (f === '-r') {
      // default: alphabetical order
      alphabeticalOrder = false
      console.log('alphabeticalOrder is false')
    }
  })

  function processLines (lines) {
    lines = lines.filter(line => line.trim() !== '')

    var sortedLines = lines.sort()

    if (!alphabeticalOrder) {
      sortedLines.reverse()
    }

    sortedLines.forEach(function (line) {
      env.output(line + '\n')
    })
  }

   // if no file, read stdin
  if (args.length === 0) {
    console.log('NO FILE')
    var buffer = []
    return Promise.resolve({
      input: function (chunk) {
        buffer = buffer.concat(chunk.split('\n'))
      },
      close: function () {
        processLines(buffer)
        env.exit(exitCode)
      }
    })
  }

  Promise.all(args.map(function (path) {
    return env.system.read(path).then(
            function (content) {
              return content.split('\n')
            },
        function (err) {
          exitCode = 1
          env.error('sort: ' + err + '\n')
          return []
        }
        )
  })).then(function (allLinesArrays) {
    var allLines = []
    for (var i = 0; i < allLinesArrays.length; i++) {
      allLines = allLines.concat(allLinesArrays[i])
    }
    processLines(allLines)
    env.exit(exitCode)
  })
}

module.exports = sort
