require('dotenv').config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_ID,
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'nodebird',
    host: process.env.SEQUELIZE_HOST,
    dialect: 'mysql',
    operatorsAliases: 'false',
  },
  production: {
    username: process.env.SEQUELIZE_ID,
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'nodebird',
    host: process.env.SEQUELIZE_HOST,
    dialect: 'mysql',
    operatorsAliases: 'false',
    // 배포환경일때는 logging을 flase로 해서 쿼리 명령어를 숨김
    logging: false,
  },
};