import axios from 'axios'
import uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default {
  namespaced: true,
  state: () => ({ 
    movies: [],
    message: _defaultMessage,
    loading: false,
    theMovie: {}
  }),
  getters: {},
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false
    }
  },
  actions: {
    //첫번째 인수: context의 객체 분해 구조
    async searchMovies({ state, commit }, payload) {
      //사용자가 검색 도중 엔터를 누르는 등의 실수를 방지하는 조건문
      if (state.loading) return

      commit('updateState', {
        message: '',
        loading: true
      })

      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: uniqBy(Search, 'imdbID')
        })
        //console.log(totalResults) //304 => 31 pages
        //console.log(typeof totalResults) //string
  
        const total = parseInt(totalResults, 10) //문자열을 10진법 숫자로 변환
        const pageLength = Math.ceil(total / 10)
  
        //추가 요청 전송
        if (pageLength > 1) {
          for (let page = 2; page <= pageLength; page++) {
            if (page > payload.number / 10) break
            const res = await _fetchMovie({
              ...payload,
              page
            })
            const { Search } = res.data
            commit('updateState', {
              movies: [
                ...state.movies, 
                ...uniqBy(Search, 'imdbID')
              ]
            })
          }
        }
      } catch ({ message }) { //서버리스 함수 적용 후 변경
        commit('updateState', {
          moives: [],
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) return
      
      commit('updateState', {
        theMovie: {},
        loading: true
      })

      try {
        const res = await _fetchMovie(payload)
        console.log(res.data)
        commit('updateState', {
          theMovie: res.data
        })
      } catch (error) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

//서버리스 함수 적용 후 변경
async function _fetchMovie(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}