# nodebird
sns 서비스.

## v 0.00 (init)
- 프로젝트 생성 

- `express nodebird`: nodebird라는 이름의 express프로젝트 생성
- 사용자와 게시물 간, 게시물과 해시태그 간의 관계가 중요하므로 RDBMS사용
- `npm i -g sequelize-cli`
- `npm i sequelize mysql2` : node_modules폴더와 package-lock.json생성
- `sequelize init` : config, migrations, models, seeders폴더 생성

| 폴더 | 의미 | 
|---|:---:|
| vew폴더 | 템플릿 파일 | 
| routes폴더 | 라우터| 
| public폴더 | 정적 파일| 
| passport폴더 | passport패키지| 

## v 0.10 
- 패키지 추가 및 프론트 세팅
- `npm i express cookie-parser express-session morgan connect-flash pug` : 필요 패키지 설치
- `npm i -g nodemon` : 수정할 때 마다 서버를 재시작하기 귀찮으므로 자동재시작을 위한 모듈 추가
- `npm i -D nodemon` (nodemon은 개발용으로만 사용할 것을 권장, 배포후에는 서버코드가 빈번하게 변경될 일이 없으므로)
- 이 프로젝트를 콘솔에서 실행가능한 명령어로 만들 필요가 없으므로 bin/www는 필요하지 않음
- 비밀키는 .env라는 파일에 모아두고, dotenv가 .env 파일을 읽어 precess.env객체에 넣음
- `npm i dotenv` 

## v 0.11
- 사용할 모델 생성하기 (User, Hashtag, Post)

## v0.2
- `sequelize db:create`을 통해 데이터베이스를 생성
- 모델과 서버 연결
- 시퀄라이즈는 테이블 생성 쿼리문에 if not exists를 넣어주므로 테이블이 없을 때 테이블을 자동으로 생성

## v0.3
- 세션과 쿠키 처리 등 복잡한 작업이 많으므로 검증된 모듈인 `passport`를 사용
- `npm i passport passport-local passport-kakao bcrypt`
- bcrypt가 설치가 안될경우 `npm install --save bcryptjs && npm uninstall --save bcrypt`를 사용해 네개의 모듈을 설치

| 모듈 | 기능 | 
|---|:---:|
| bcrypt | 비밀번호를 암호화 | 
| passport-local | 로컬 로그인이 가능 | 
| passport-kakao | 카카오 로그인 | 
| passport | node.js용 범용 인증 모듈 | 
- 로컬, 카카오로그인 기능추가
- developers.kakao.com에서 clientId발급 > restapi키를 넣음

