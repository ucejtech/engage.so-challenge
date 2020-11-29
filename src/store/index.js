import Vue from 'vue'
import Vuex from 'vuex'
import { getFromStorage, setToStorage } from '../utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes: getFromStorage() || {}
  },
  getters: {
    getNotes (state) {
      const notes = []
      Object.values(state.notes).forEach(note => notes.push(note))
      return notes
    }
  },
  mutations: {
    setNote (state, note) {
      state.notes[note.id] = note
      setToStorage(state.notes)
    }
  },
  actions: {
    saveNote ({ commit }, note) {
      commit('setNote', note)
    }
  },
  modules: {}
})
