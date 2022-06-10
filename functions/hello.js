exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    //body 속성에는 무조건 문자 데이터만 할당 가능
    body: JSON.stringify({
      name: 'SUMMER',
      age: 30,
      email: 'metinthesummer@naver.com'
    })
  }
}