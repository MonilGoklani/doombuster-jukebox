const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

let config

if(process.env.LOGGING === 'true'){
  delete config.logging
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if(process.env.DATABASE_URL){
  config = {
    logging: false,
    operatorsAliases: false,
    dialect: "postgres",
    protocol: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
}else {
  config = {
    logging: false,
    operatorsAliases: false,
  }
}
  // config.dialectOptions = {
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // };

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`, config)
module.exports = db
