/**
 * 검색(메인) 페이지로 접근한 후,
 * 영화 제목을 'frozen'으로, 표시 개수를 30개로 입력하고,
 * 'Apply' 버튼을 클릭해 영화 목록 검색
 * 영화 목록 30개가 정상 출력
 * 영화 목록에서 'Frozen II'(겨울왕국2) 영화 아이템을 클릭하면,
 * 영화 상세 정보 페이지로 이동
 * 상세 정보 페이지에서 정보 확인 가능
 */


describe('영화 검색(겨울 왕국2)', () => {
  it('검색 페이지로 접근합니다', () => {
    cy.visit('/')
    cy.get('header .nav-link.active')
      .contains('Search')
  })
  it('영화를 검색합니다', () => {
    cy.get('input.form-control')
      //get()으로 얻은 요소에 'frozen'으로 타이핑
      .type('frozen')
    cy.get('select.form-select:nth-child(2)')
      //select() 요소에서 특정 데이터를 선택
      .select('30')
    cy.get('button.btn')
      .contains('Apply')
      //해당 요소를 얻어 'Apply'라는 컨텐츠를 가지고 있다면 클릭
      .click()
    cy.wait(2000) //클릭 후 원하는 데이터가 모두 출력될때까지 기다림 (ms 단위)
    cy.get('.movie')
      //jest의 expect() - toBe()/toEqual()과 동일 기능
      .should('have.length', 30)
  })
  it('겨울왕국2 영화 아이템을 선택합니다', () => {
    cy.get('.movie .title')
      .contains('Frozen II')
      .click()
  })
  it('영화 상세 정보를 확인합니다', () => {
    //현재 접속된 페이지의 url 주소 확인
    //http://localhost:8080/movie/tt4520988
    cy.url().should('include', '/movie/tt4520988')
    cy.wait(1000)
    cy.get('header .nav-link.active')
      .contains('Movie')
    cy.get('.title')
      .contains('Frozen II')
  })
})