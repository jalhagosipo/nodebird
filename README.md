# nodebird
sns 서비스.

## v 0.00 (init)
- 프로젝트 생성 

`express nodebird`: nodebird라는 이름의 express프로젝트 생성<br>
사용자와 게시물 간, 게시물과 해시태그 간의 관계가 중요하므로 RDBMS사용<br>
`npm i -g sequelize-cli`<br>
`npm i sequelize mysql2` : node_modules폴더와 package-lock.json생성<br>
`sequelize init` : config, migrations, models, seeders폴더 생성<br>

| 폴더 | 의미 | 
|---|:---:|
| vew폴더 | 템플릿 파일 | 
| routes폴더 | 라우터| 
| public폴더 | 정적 파일| 
| passport폴더 | passport패키지| 

## v 0.10 
- 패키지 추가 및 프론트 세팅
`npm i express cookie-parser express-session morgan connect-flash pug` : 필요 패키지 설치<br>
`npm i -g nodemon` : 수정할 때 마다 서버를 재시작하기 귀찮으므로 자동재시작을 위한 모듈 추가<br>
`npm i -D nodemon` (nodemon은 개발용으로만 사용할 것을 권장, 배포후에는 서버코드가 빈번하게 변경될 일이 없으므로)<br>
- 이 프로젝트를 콘솔에서 실행가능한 명령어로 만들 필요가 없으므로 bin/www는 필요하지 않음
- 비밀키는 .env라는 파일에 모아두고, dotenv가 .env 파일을 읽어 precess.env객체에 넣음
`npm i dotenv` 

## v 0.11
- 사용할 모델 생성하기 (User, Hashtag, Post)


