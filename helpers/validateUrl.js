const validUrl = require('valid-url');

function isValidUrl(url) {
  return validUrl.isUri(url);
}

module.exports = isValidUrl;
