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
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    // JWT 토큰을 쿠키에 설정 (배포환경에서 동작 시)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // HTTPS가 아닌 경우 false로 설정
      sameSite: 'None' // 크로스 도메인 쿠키 전송 허용
    });

    // JWT 토큰을 쿠키에 설정 (로컬에서 동작 시)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // HTTPS가 아닌 경우 false로 설정
      sameSite: 'None' // 크로스 도메인 쿠키 전송 허용
    });
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