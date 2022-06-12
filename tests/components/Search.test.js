import { shallowMount } from "@vue/test-utils"
import Search from '~/components/Search'
//해당 컴포넌트(Search.vue)에서 사용하는 외부 자원,
//즉 플러그인(router, store 등)이 없으므로 연결하지 않음
//테스트 환경에서는 최소한의 외부 자원 사용이 권장됨

//스토어의 액션을 호출하는 코드가 존재하지만
//스토어의 기능이므로 Search 컴포넌트에서 테스트할 필요없음
describe('components/Search.vue', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = shallowMount(Search)
  })

  test('선택 가능한 연도의 개수가 일치합니다', () => {
    const year = wrapper.vm.filters.find(f => f.name === 'year')
    const yearLength = new Date().getFullYear() - 1985 + 1
    expect(year.items.length).toBe(yearLength)
  })
})