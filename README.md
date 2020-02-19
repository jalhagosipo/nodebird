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
- 모델과 서버 연결
    - `sequelize db:create`을 통해 데이터베이스를 생성
    - 시퀄라이즈는 테이블 생성 쿼리문에 if not exists를 넣어주므로 테이블이 없을 때 테이블을 자동으로 생성

## v0.3
- 로컬, 카카오로그인 기능추가
    - 세션과 쿠키 처리 등 복잡한 작업이 많으므로 검증된 모듈인 `passport`를 사용
    - `npm i passport passport-local passport-kakao bcrypt`
    - bcrypt가 설치가 안될경우 `npm install --save bcryptjs && npm uninstall --save bcrypt`를 사용해 `bcrypt`를 대신한다.
    - developers.kakao.com에서 clientId발급 > restapi키를 넣음
    
| 모듈 | 기능 | 
|---|:---:|
| bcrypt | 비밀번호를 암호화 | 
| passport-local | 로컬 로그인이 가능 | 
| passport-kakao | 카카오 로그인 | 
| passport | node.js용 범용 인증 모듈 | 

## v0.4
- 이미지 업로드 구현
    - `npm i multer` : input,form태그를 사용해 업로딩한 이미지의 인코딩타입은 multipart/form-data임. 이런형식의 데이터는 직접 처리하기 힘드므로, multipart 처리용 모듈을 사용
    - input태그를 통해 이미지를 선택할 때 먼저 업로드를 진행
    - 업로드된 사진 주소를 다시 클라이언트에 알려줄것
    - 게시글 저장 시에는 이미지 데이터 대신 이미지 주소를 저장

## v0.5
- 해시태그, 팔로우/팔로잉

## v0.6
- 서비스 운영을 위한 패키지 준비
- morgan과 express-session을 수정
    - process.env.NODE_ENV = 배포환경이 개발환경인지 운영환경인지 확인할 수 있는 변수
- sequelize도 배포환경 설정을 위한 수정
    - json파일로 비밀번호가 하드코딩 되어있음 -> .config삭제 후 js파일 생성
    - process.env가 development일 때는 development속성의 설정 내용이 적용되고, production일 때는 production 속성의 설정 내용이 적용됨
    - .env에  `SEQUELIZE_ID = 아이디, SEQUELIZE_PASSWORD = 비밀번호` 추가
    - DB에 한글저장 에러를 피하기위해 모델파일들 안에 `charset: 'utf8', collate: 'utf8_general_ci',` 추가
- cross-env 패키지를 사용해 동적으로 process.env 변경
    - package.json에 script 추가
        - `"start": "NODE_ENV=production PORT=80 node app"` : 배포 환경에서 사용하는 스크립트
            - `NODE_ENV=production`는 리눅스나맥에서는 되지만, 윈도우에서는 설정이 안됨 
            - -> 이때 cross-env사용 `npm i -g cross-env && npm i cross-env`, NODE_ENV 앞에 cross_env를 추가
        - `"dev": "nodemon app"` : 개발환경에서 사용하는 스크립트
- retire를 통해 문제가 있는 패키지를 확인
    - `npm i -g retire`
    - 취약점이 발견되면 패키지 관리자가 빠르게 수정
        - npm 5.10 부터는  `npm audit`명령어가 추가됨 -> `npm install` 할때 자동으로 취약점을 검사
        - `npm audit fix` : npm이 수정할 수 있는 오류는 자동으로 수정
- pm2
    - 서버가 에러로 인해 꺼졌을 때 서버를 다시 켜줌
    - 멀티 프로세싱(멀티 스레딩은 아님) : 노드는 클라이언트로부터 요청이 왔을 때 요청을 여러 노드 프로세스에 고르게 분배
        - 단점 : 멀티 스레딩이 아니므로 서버의 메모리 같은 자원을 공유하지는 못함
            - 세션을 메모리에 저장했는데 메모리를 공유하지 못해서 프로세스 간에 세션이 공유되지 않음 -> 로그인 후 새로고침시 세션 있는 프로세스로 요청이 가면 로그인된 상태가되고, 세션 없는 프로세스로 요청이 가면 로그인 안된 상태
            - => 세션 공유해줘라! -> Memcached,Redis 등을 사용
            - `npm i -g pm2 && npm i pm2`
            - `"start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js"`로 변경
            - `npm start`를 하면 node,nodemon과는 다르게 노드프로세스가 실행되면서 콘솔에 다른 명령어를 입력할 수 있음 -> pm2가 노드 프로세스를 백그라운드로 돌리기 때문
            - `pm2 list` : 백그라운드에서 돌고 있는 노드 프로세스를 확인
            - `pm2 kill` : pm2 프로세스 종료
            - `pm2 reload all` : 서버 재시작
            - `"start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js -i 0"`로 변경
                - 노드의 cluster 모듈처럼 클러스터링을 가능하게함. -i 뒤에 생성하길 원하는 프로세스 개수를 넣으면됨
                    - 0 : 현재 cpu 코어 개수만큼 프로세스를 생성
                    - -1 : 프로세스를 cpu 코어개수보다 한개 덜 생성(남은 코어하나는 노드 외의 다른 작업을 할 수 있도록)
            - `pm2 monit` : 현재 프로세스 모니터링
- winston : 실제 서버 운영 시 console.log와 console.error를 대체하기 위한 모듈
    - 서버가 종료되도 로그를 볼 수 있도록 파일이나 다른 DB에 저장할 수 있게 해줌
    - `npm i winston`
    - logger.js의 logger객체를 만들어 다른 파일에서 사용하도록 함
    - `winston-daily-rotate-file` : 로그를 날짜별로 관리할 수 있게 해줌
- helmet, hpp : 서버의 각종 취약점을 보완해주는 패키지
    - `npm i helmet hpp`

## v1.1
- 팔로잉 끊기
    - 시퀄라이즈의 destroy 메서드와 라우터 활용

## v1.2
- 프로필 정보 변경하기
    - 시퀄라이즈의 update 메서드와 라우터 활용

## v1.3
- 게시글 좋아요 누르기 및 좋아요 취소하기
    - 사용자/게시글 모델간 N:M 관계 정립 후 라우터 활용

## v1.4
- 게시글 삭제하기
    - 등록자와 현재 로그인한 사용자가 같을 때, 시퀄라이즈의 destroy 메서드와 라우터 활용
