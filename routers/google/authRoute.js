const express = require('express');
const router = express.Router();
const { oAuth2Client } = require('../../config/config');

// 인증 URL 생성 및 리디렉션
router.get('/', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(authUrl);
});

// 인증 후 콜백을 처리하는 엔드포인트
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // 액세스 토큰과 리프레시 토큰 저장
    process.env.ACCESS_TOKEN = tokens.access_token;
    process.env.REFRESH_TOKEN = tokens.refresh_token;

    // 액세스 토큰과 리프레시 토큰 출력
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error while exchanging token', error);
    res.status(500).send('Authentication failed.');
  }
});

module.exports = router;
