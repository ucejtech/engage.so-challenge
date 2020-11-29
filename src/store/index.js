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
      return state.notes
    }
  },
  mutations: {
    setNote (state, note) {
      state.notes[note.id] = note
      setToStorage(state.notes)
    },
    deleteNote (state, noteId) {
      delete state.notes[noteId]
      setToStorage(state.notes)
    }
  },
  actions: {
    saveNote ({ commit }, note) {
      commit('setNote', note)
    },
    deleteNote ({ commit }, noteId) {
      commit('deleteNote', noteId)
    }
  },
  modules: {}
})
