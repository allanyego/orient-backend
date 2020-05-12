function createResponse({ error, data }) {
  if (error) {
    return {
      status: 'error',
      error
    };
  }

  return {
    status: 'success',
    data
  };
}

module.exports = createResponse;