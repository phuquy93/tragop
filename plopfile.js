const viewGenerator = require('./plop-templates1/view/prompt')
const componentGenerator = require('./plop-templates1/component/prompt')
const storeGenerator = require('./plop-templates1/store/prompt.js')

module.exports = function(plop) {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('store', storeGenerator)
}
