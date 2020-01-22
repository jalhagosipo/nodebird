const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

// :id가 req.params.id가됨
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
      // 팔로우할 사용자를 디비에서 조회
    const user = await User.findOne({ where: { id: req.user.id } });

    // 시퀄라이즈에서 추가한 addFollowing메서드로 현재 로그인한 사용자와의관계를 지정
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;