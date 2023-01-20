<p align="center">
  <a href="" rel="noopener">
 <img src="https://i1.sndcdn.com/avatars-000610836519-ie5ynf-t500x500.jpg" alt="Project logo"></a>
</p>
<!-- <h1 align="center">PRANDOM</h1> -->

<div align="center">

[![Hackathon](https://img.shields.io/badge/prandom-npm-orange.svg)](https://www.npmjs.com/package/prandom)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/zaadevofc/prandom)](https://github.com/zaadevofc/prandom/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/zaadevofc/prandom)](https://github.com/zaadevofc/prandom/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<h1 align="center"> Complete and Varied Randomization in only one package
    <br> 
    <br> 
</h1>

## 🏁 Getting Started <a name = "getting_started"></a>

you can randomize anything with one package. We have provided randomizers like `string`, `number`, `hexColor`, `emoji`, `id`, `otp`, `password`, `serialId` and others

<br />

## 💉 Installation <a name = "installation"></a>


```bash
npm i prandom
```

<br />

## 🎈 Usage <a name="usage"></a>

how to use it is very easy, as follows :

```js
const prandom = require('prandom');

const randomString = prandom.string()
const randomNumber = prandom.number()
const randomHexColor = prandom.hexColor()
const randomEmoji = prandom.emoji()
const randomID = prandom.id()
const randomOTP = prandom.otp()
const randomPassword = prandom.password()
const randomSerialID = prandom.serialId()

// and others...
```
or
```js
const { string, number, hexColor, emoji, id, otp, password, serialId } = require('prandom')
```

```js
/* 
randomString => AaFWV1FOVIx13CzJLdHNUvtaaYJbO9
randomNumber => 384833
randomHexColor => #7afb96
randomEmoji => 🥉
randomID => #78422535
randomOTP => 770860
randomPassword => goWtyLunEpZHfo3
randomSerialID => aluvy-i9NfA-BPcgs-l1AxH-dJfwK-H6FlT
*/
```

<br />

## ✍️ Authors <a name = "authors"></a>

- [@zaadevofc](https://github.com/zaadevofc) - Developer

See also the list of [contributors](https://github.com/zaadevofc/prandom/contributors)
who participated in this project.

## 🎉 License <a name = "license"></a>

Code released under the [MIT License](LICENSE.txt).
