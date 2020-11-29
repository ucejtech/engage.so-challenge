<template>
  <div class="home">
    <nav class="navbar sticky mb-3">
      <div class="px-5 py-3 d-flex align-center justify-space-between">
        <div class="title-home d-flex align-center">
          <img src="@/assets/images/icons/home.svg" alt="" width="30px" />
          <div class="title ml-3">Engage.so Challenge</div>
        </div>
        <div class="route">
          <button class="route" @click="$router.push('/notes/edit')">
            Add Note
          </button>
        </div>
      </div>
    </nav>

    <div class="mx-auto bg-white notes-list p-4">
      <div class="mb-2">Notes:</div>

      <div v-if="notes.length > 0">
        <div
          class="note px-2 py-2 d-flex align-center justify-space-between"
          v-for="(note, index) in notes"
          :key="index"
          @click="$router.push(`/notes/edit/${note.id}`)"
        >
          <div>
            "{{ note.title ? note.title : "Untitled" }}"<br />
          <em class="note-id">{{ note.id }}</em>
          </div>
          <img src="@/assets/images/icons/delete.svg" alt="" @click.stop="deleteNotePrompt(note.id)">
        </div>
      </div>
      <div v-else>
        No Note Created
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return { notes: [] }
  },
  computed: {
    ...mapGetters(['getNotes'])
  },
  mounted () {
    this.parseNotes(this.getNotes)
  },
  methods: {
    ...mapActions([
      'deleteNote'
    ]),
    parseNotes (notesList) {
      const notes = []
      Object.entries(notesList).forEach(([key, value]) => notes.push(value))
      this.notes = notes
    },
    deleteNotePrompt (id) {
      if (confirm('Are you sure you want to delete this note?')) {
        this.deleteNote(id)
        this.parseNotes(this.getNotes)
      }
    }
  }
}
</script>

<style>
nav {
  z-index: 100;
}
.navbar {
  background: #fff;
}
button:focus {
  outline: none;
}
button.route {
  box-shadow: 0px 4px 30px 10px rgba(98, 70, 234, 0.25) !important;
  border-radius: 5px !important;
  text-transform: capitalize !important;
  font-size: 13px !important;
  color: #fff;
  padding: 7px 13px;
  line-height: 15px !important;
  cursor: pointer;
  border: none;
  background: var(--color-primary);
}
.notes-list {
  width: 444px;
  border-radius: 5px;
}
.notes-list .note {
  border: 1px solid var(--color-border);
  border-radius: 7px;
  margin-bottom: 20px;
  cursor: pointer;
}
.notes-list .note:last-child {
  margin-bottom: 0;
}
.notes-list .note:hover {
  background: var(--color-border);
}
.note-id {
  color: var(--color-grey);
}
</style>
