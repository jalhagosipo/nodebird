const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// fs모듈은 이미지를 업로드할 uploads 폴더가 없을때 폴더를 생성함.
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});

// aws 설정
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  // 서울
  region: 'ap-northeast-2',
});

// multer모듈에 옵션을 주어 upload변수에 대입
// upload변수는 미들웨어를 만드는 여러가지메서드를 가지고있음
// single : 이미지 하나는 req.file로, 나머지 정보는 req.body로
// array, fields : 이미지들은 req.files로, 나머지정보는 req.body로
// array, fields 차이 : 속성 하나에 이미지를 여러개 업로드했다면 array, 여러개속성에 이미지를 하나씩 업로드했다면 fields를 사용
// none : 이미지를 올리지 않고 데이터만 multipart형식으로 전송했을때 사용
const upload = multer({

  // bucket: 버킷명
  // key: 파일명
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'firsts3imsi',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
    },
  }),
  // 최대 이미지 파일 용량 허용치 10MB
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드를 처리하는 라우터
// single미들웨어 사용
// single메서드에 이미지가 담긴 req.body속성의 이름을 적어줌. 앱에서 이미지를 보낼때 속성이름을 img로 하고있음.
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  // req.file.location에 s3버킷 이미지 주소가 담겨있음.
  // res.json({ url: req.file.location });

  // lambda 서비스를 이용할 수있게 아래 코드로 수정
  const originalUrl = req.file.location;
  const url = originalUrl.replace(/\/original\//, '/thumb/');
  res.json({ url, originalUrl });
});


const upload2 = multer();

// 게시글 업로드를 처리하는 라우터
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
      // 이미지를 업로드했다면 이미지 주소도 req.body.url로 전송됨
      // 형식이 multipart지만 이미지 데이터가 들어있지않으므로 none메서드를 사용
      // 게시글을 디비에 저장
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });

    // 해시태그를 게시글 내용에서 추출
    const hashtags = req.body.content.match(/#[^\s#]*/g);

    if (hashtags) {
        // 해시태그들 저장
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        where: { title: tag.slice(1).toLowerCase() },
      })));
      // 게시글과 해시태그의 관계를 posthashtag테이블에 넣음
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
    // 쿼리스트링으로 해시태그이름을 받기
    const query = req.query.hashtag;

    if (!query) {
      return res.redirect('/');
    }
    try {
        // 해시태그 검색
      const hashtag = await Hashtag.findOne({ where: { title: query } });

      let posts = [];
      if (hashtag) {
          // 게시글 가져올때는 작성자정보를 join한다.
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;