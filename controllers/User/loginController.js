const asyncHandler = require('express-async-handler');
const User = require('../../models/User/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// POST /api/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자가 입력한 이메일로 데이터베이스에서 사용자 찾기
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // JWT 토큰 생성
    const payload = { userID: user.userID, email: user.email, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    // JWT 토큰을 쿠키에 설정
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    // res.headers = ~ headers를 통해 도메인 허용하도록, res.setHeaders('....', '...'); 모든 도메인을 허용하려면 와일드 카드
    // 로그인 성공 메세지 (관리자는 다른 메세지)
    const message = user.isAdmin ? 'Login successful as admin' : 'Login successful';

    // 로그인 성공 및 토큰 반환
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// POST /api/logout
const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = { login, logout };