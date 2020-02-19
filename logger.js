const { createLogger, format, transports } = require('winston');

// level : 로그의 심각도. error, warn, info, verbose, debug, silly (error가 가장 심각. 심각도순)
// info를 넣으면 info보다 심각한 단계의 로그도 함께 기록됨
// format : 로그의 형식. json, label, timestamp, printf 등
// transports : 로그 저장 방식
// transports.File : 파일로 저장, transports.Console : 콘솔로 출력
const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
      // 여러 로깅 방식을 동시에 사용할 수 있음
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;