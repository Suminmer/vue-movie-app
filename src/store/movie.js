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
        console.log(totalResults) //304 => 31 pages
        console.log(typeof totalResults) //string
  
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
      } catch (message) {
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

//현재 파일 내부에서만 사용한다는 의미로 함수명 앞에 _ 작성
function _fetchMovie(payload) {
  const { title, type, year, page, id } = payload
  const OMDB_API_KEY = '7035c60c'
  const url = id
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        if (res.data.Error) {
          reject(res.data.Error)
        }
        resolve(res)
      })
      .catch(err => {
        reject(err.message)
      })
  })
}