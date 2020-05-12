const lowerCase = (stringArray) => stringArray.map(s => {
  if (typeof(s) === 'string') {
    return s.toLowerCase();
  }
  return s;
});

module.exports = lowerCase;