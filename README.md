<p align="center">
  <a href="" rel="noopener">
 <img src="https://textpro.me/images/user_image/2023/01/63cc843c7e462.jpg" alt="Project logo"></a>
</p>
<!-- <h1 align="center">PRANDOM</h1> -->

<div align="center">

[![Hackathon](https://img.shields.io/badge/textpro.me-npm-orange.svg)](https://www.npmjs.com/package/textpro.me)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/zaadevofc/textpro.me)](https://github.com/zaadevofc/textpro.me/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/zaadevofc/textpro.me)](https://github.com/zaadevofc/textpro.me/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<h1 align="center"> Textpro.me Scrape
    <br> 
    <br> 
</h1>

## 🏁 Getting Started <a name = "getting_started"></a>

You can use textpro.me only through the package. Simple and Fast.

## 💉 Installation <a name = "installation"></a>


```bash
npm i textpro.me
```

## 🎈 Usage <a name="usage"></a>

how to use it is very easy, as follows :

```js
const textpro = require('textpro.me');

var url = 'https://textpro.me/pornhub-style-logo-online-generator-free-977.html';
var text = ['textpro', 'npm'];

textpro.get(url, text).then(async (data) => {
  try {
    console.log(data)
  } catch (err) {
    console.log(err)
  }
});
```

```js
/* 
{
  title: 'Pornhub Style Logo Online Generator Free',
  path: 'https://textpro.me/pornhub-style-logo-online-generator-free-977.html',
  result: 'https://textpro.me/images/user_image/2023/01/63cc8737301ef.jpg'
}
*/
```

## ✍️ Authors <a name = "authors"></a>

- [@zaadevofc](https://github.com/zaadevofc) - Developer

See also the list of [contributors](https://github.com/zaadevofc/prandom/contributors)
who participated in this project.

## 🎉 License <a name = "license"></a>

Code released under the [MIT License](LICENSE).
