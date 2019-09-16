import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      current: 0,
      currentSub: '',
      vert: false,
      proj: false,
      choke: false,
      slides: [],
      allslides: [],
      mark: '',
      nextMark: '',
      prevMark: '',
      id: '',
      subdex: 0,
      pages:  {},
      blogposts: [],
      events: [],
      newsloaded: false,
      modal: false,
    }),
    mutations: {
      next (state) {
        state.current++
      },
      prev (state) {
        state.current--
      },
      vert (state,data) {
        state.vert = data
      },
      proj (state,data) {
        state.proj = data
      },
      loadSlides(state,data) {
        state.slides = data	
      },
      loadAll(state,data) {
        state.allslides = data	
      },
      addSlide(state,data) {
        state.slides.push(data)
      },
      addPrev(state,data) {
        state.slides.unshift(data)
      },
      setID(state,data) {
        state.id=data
      },
      setCur(state,data) {
        state.current=data
      },
      setCurSub(state,data) {
        state.currentSub=data
      },
      setPages(state,data) {
        state.pages=data
      },
      choke(state,data) {
        state.choke = data
      },
      setDex(state,data) {
        state.subdex = data
      },
      lowDex(state) {
        state.subdex--
      },
      hiDex(state) {
        state.subdex++
      },
      storeBlogposts(state,data) {
        state.blogposts=data
      },
      storeEvents(state,data) {
        state.events=data
      },
      newsLoaded(state) {
        state.newsloaded = true
      },
      toggleModal(state,data) {
        state.modal = data
      }
    }
  })
}

export default createStore
