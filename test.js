const textpro = require('./lib')

var url = 'https://textpro.me/pornhub-style-logo-online-generator-free-977.html'
var text = ['textpro', 'npm']

textpro.get(url, text).then(async (data) => {
  try {
    console.log(data)
  } catch (err) {
    console.log(err)
  }
});