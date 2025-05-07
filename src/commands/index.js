var commands = {
  cat: require('./cat'),
  cd: require('./cd'),
  cp: require('./cp'),
  grep: require('./grep'),
  history: require('./history'),
  ls: require('./ls'),
  mkdir: require('./mkdir'),
  mv: require('./mv'),
  pwd: require('./pwd'),
  rm: require('./rm'),
  rmdir: require('./rmdir'),
  sort: require('./sort'),
  touch: require('./touch')
}

module.exports = commands
