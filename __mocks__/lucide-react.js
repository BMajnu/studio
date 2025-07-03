const React = require('react');
module.exports = new Proxy({}, {
  get: (target, prop) => (props) => React.createElement('svg', props)
}); 