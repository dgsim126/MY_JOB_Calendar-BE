const { google } = require('googleapis');
const { oAuth2Client } = require('../../config/config');

const calendar = google.calendar('v3');

// 이벤트 추가 함수
async function addEvent(event) {
  // 디버깅: 토큰을 설정하기 전에 로그를 찍어 확인
  console.log('Setting credentials with access token:', process.env.ACCESS_TOKEN);

  // oAuth2Client에 액세스 토큰 설정
  oAuth2Client.setCredentials({ access_token: process.env.ACCESS_TOKEN });

  try {
    const response = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: 'primary',
      resource: {
        summary: event.title,
        start: {
          dateTime: event.startdate,
          timeZone: 'Asia/Seoul',
        },
        end: {
          dateTime: event.enddate,
          timeZone: 'Asia/Seoul',
        },
      },
    });

    // 디버깅: 성공적으로 이벤트를 추가한 경우 로그를 찍어 확인
    console.log('Event added successfully:', response.data);
    return response.data;
  } catch (error) {
    // 디버깅: 오류가 발생한 경우 로그를 찍어 확인
    console.error('Error adding event:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { addEvent };
