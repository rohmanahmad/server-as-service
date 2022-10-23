require('dotenv').config({path: './.env'})
const isHeadless = (process.env.HEADLESS === 'true')

module.exports = {
    launch: {
      dumpio: true,
      headless: isHeadless,
    }
  }