import { shallowMount } from '@vue/test-utils'
import router from '~/routes'
import store from '~/store'
import Header from '~/components/Header'

describe('components/Header.vue', () => {
  let wrapper
  //각 테스트마다 실행 직전에 온전한 wrapper 객체를 사용하도록 초기화
  beforeEach( async () => {
    //router(index.js)에서는 페이지 이동 시 마다 맨 위로 돌아가도록 로직 구현
    //테스트 환경에서 별도로 구현하지 않아 에러 발생 => 모의 함수로 구현한 것처럼 처리
    window.scrollTo = jest.fn()
    //테스트 환경에서는 isMatch() 내부 로직의 fullPath를 알 수 없으므로
    //라우터를 이용해 강제로 이동한 후 테스트
    //이동 후에 fullPath를 얻어 비교해야하므로 비동기 방식으로 처리하고
    //화면 출력은 요청 경로에 도착 후에 이뤄지므로 mounted(렌더링)되기 전에 이동
    router.push('/movie/tt1234567')
    await router.isReady()
    wrapper = shallowMount(Header, {
      global: {
        plugins: [
          router,
          store
        ]
      }
    })
  })

  test('경로 정규표현식이 없는 경우 일치하지 않습니다', () => {
    const regExp = undefined
    expect(wrapper.vm.isMatch(regExp)).toBe(false)
  })

  test('경로 정규표현식과 일치해야 합니다', () => {
    const regExp = /^\/movie/
    expect(wrapper.vm.isMatch(regExp)).toBe(true)
  })

  test('경로 정규표현식과 일치하지 않아야 합니다', () => {
    const regExp = /^\/summer/
    expect(wrapper.vm.isMatch(regExp)).toBe(false)
  })
})