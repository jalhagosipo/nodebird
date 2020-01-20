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
