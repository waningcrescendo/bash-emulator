var commands = {
  cat: require('./cat'),
  grep: require('./grep'),
  cd: require('./cd'),
  cp: require('./cp'),
  history: require('./history'),
  ls: require('./ls'),
  mkdir: require('./mkdir'),
  mv: require('./mv'),
  pwd: require('./pwd'),
  rm: require('./rm'),
  rmdir: require('./rmdir'),
  touch: require('./touch')
}

module.exports = commands
