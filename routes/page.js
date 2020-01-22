const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 로그인 해야 프로필을 볼수있도록 isLoggedIn미들웨어를 사용
// req.isAuthenticated()가 true여야 next()가 호출되어 res.render가 있는 미들웨어로 넘어갈 수 있다.
// false라면 로그인창이 있는 메인페이지로 리다이렉트된다.
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: null });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  res.render('main', {
    title: 'NodeBird',
    twits: [],
    user: req.user,
    loginError: req.flash('loginError'),
  });
});

module.exports = router;