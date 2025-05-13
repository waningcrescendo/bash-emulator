/* eslint-disable no-useless-escape */
function sort (env, args) {
  // Ignore command name
  args.shift()

  var exitCode = 0
  var alphabeticalOrder = true
  var removeDuplicates = false
  var numericSort = false
  var columnIndex = 0

   // flag extraction
  var flags = []
  while (args[0] && args[0].startsWith('-')) {
    var flag = args.shift()
    for (var i = 1; i < flag.length; i++) {
      const c = flag[i]
      if (c === 'k') {
        const rest = flag.slice(i + 1)
        if (rest) {
          const match = rest.match(/^(\d+)(.*)$/)
          if (match) {
            columnIndex = parseInt(match[1], 10) - 1
            const remainingFlags = match[2]
            for (const extra of remainingFlags) {
              flags.push('-' + extra)
            }
            break
          } else {
            env.error('sort: -k must be followed by a column number\n')
            env.exit(1)
            return
          }
        } else {
          const next = args[0]
          if (next && /^\d+([a-z]*)$/.test(next)) {
            args.shift()
            const match = next.match(/^(\d+)([a-z]*)$/)
            columnIndex = parseInt(match[1], 10) - 1
            for (const extra of match[2]) {
              flags.push('-' + extra)
            }
          } else {
            env.error('sort: -k must be followed by a column number\n')
            env.exit(1)
            return
          }
        }
        break
      } else {
        flags.push('-' + c)
      }
    }
  }

    // flag interpretation
  flags.forEach(function (f) {
    console.log('flags ', flags)
    if (f === '-r') {
      // default: alphabetical order
      alphabeticalOrder = false
      console.log('alphabeticalOrder is false')
    } else if (f === '-u') {
      removeDuplicates = true
    } else if (f === '-n') {
      numericSort = true
    } else if (f.startsWith('-k')) {
      const colArg = f.slice(2)
      console.log('colArg: ', colArg)
      if (colArg) {
        columnIndex = parseInt(colArg) - 1
        console.log('columnindex: ', columnIndex)
      }
    } else {
      exitCode = 1
      env.error('sort: invalid option ' + f + '\n')
      env.exit(exitCode)
      return
    }
  })

  function extractNumberFromColumn (line, columnIndex) {
    const columns = line.split(/\s+/)
    console.log('line: ', line, ' column index: ', columnIndex)
    if (columns[columnIndex]) {
      const match = columns[columnIndex].match(/[\d\.\-]+/)
      console.log('match? ', match)
      return match ? parseFloat(match[0]) : NaN
    }
    return NaN
  }

  function processLines (lines) {
    lines = lines.filter(line => line.trim() !== '')

    var sortedLines = lines.sort(function (a, b) {
      if (numericSort) {
        console.log('numeric sort true')
        const numA = extractNumberFromColumn(a, columnIndex)
        const numB = extractNumberFromColumn(b, columnIndex)
        console.log('numA: ', numA, ' numB: ', numB)
        return numA - numB
      } else {
        console.log('numeric sort false')
        return a.localeCompare(b)
      }
    })

    if (!alphabeticalOrder) {
      sortedLines.reverse()
    }
    if (removeDuplicates) {
      sortedLines = sortedLines.filter((line, index, arr) => {
        return index === 0 || line !== arr[index - 1]
      })
    }
    sortedLines.forEach(function (line) {
      env.output(line + '\n')
    })
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
        processLines(buffer)
        env.exit(exitCode)
      }
    }
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
