exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: 'SUMMER',
      age: 30,
      email: 'metinthesummer@naver.com'
    })
  }
}