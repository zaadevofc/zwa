const prandom = require('./lib')

const randomString = prandom.string(55)
console.log('randomString =>', randomString)

const randomNumber = prandom.number(6)
console.log('randomNumber =>', randomNumber)

const randomHexColor = prandom.hexColor()
console.log('randomHexColor =>', randomHexColor)

const randomEmoji = prandom.emoji()
console.log('randomEmoji =>', randomEmoji)

const randomID = prandom.id()
console.log('randomID =>', randomID)

const randomOTP = prandom.otp()
console.log('randomOTP =>', randomOTP)

const randomPassword = prandom.password()
console.log('randomPassword =>', randomPassword)

const randomSerialID = prandom.serialId(30)
console.log('randomSerialID =>', randomSerialID)
