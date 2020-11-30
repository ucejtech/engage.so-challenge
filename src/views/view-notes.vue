<template>
  <div class="editor-page" id="editor-page">
    <nav class="navbar sticky mb-3">
      <div class="pl-5 py-3 d-flex align-center">
        <img
          src="@/assets/images/icons/home.svg"
          alt="home icon"
          width="25px"
          @click="$router.push('/')"
        />
        <div class="title ml-3">{{ note.title }}</div>
      </div>
    </nav>
    <section class="p-relative">
      <div
        id="editor"
        class="editor mx-auto p-5 mb-3"
        v-html="note.content"
        autofocus
        contenteditable
      ></div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    note: {
      id: '',
      title: 'Untitled',
      content: ''
    }
  }),
  mounted () {
    try {
      this.note.id = this.$route.params.noteId || this.randomNoteId()
      const noteId = this.note.id
      const note = Object.values(this.getNotes).find(
        (note) => note.id === noteId
      )
      this.note = note
    } catch (e) {
      alert('This challenge is not supported on your browser')
    }
  },
  computed: {
    ...mapGetters(['getNotes'])
  }
}
</script>

<style>
.editor-page {
  position: relative;
}
.sticky {
  position: sticky;
  top: 0;
}
input.title {
  border: none;
  font-size: 18px;
  min-width: 100px !important;
}
input.title:hover {
  padding: 3px;
  border-radius: 4px;
  border: 1px solid rgb(56, 51, 51);
}
.bordered-y {
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.doc-state {
  font-size: 13px;
}
.italics {
  font-style: italic;
}
input[type="color"] {
  opacity: 0;
  display: inline;
  width: 0px;
  height: 0px;
  border: none;
}
label:hover {
  background: var(--color-grey);
  border-radius: 3px;
}
button,
label,
img {
  border: none;
  background: transparent;
  cursor: pointer;
}
button:focus {
  outline: none;
}
.selected-text-color {
  width: 19.4px;
  height: 4px;
}
.editor {
  width: 1031px;
  background: #ffffff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  min-height: 877px;
  position: relative;
}
.editor:focus {
  outline: none;
}

.resizers {
  position: relative;
  width: fit-content;
  height: 100%;
  border: 3px solid #4286f4;
  box-sizing: border-box;
}

.resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: 3px solid #4286f4;
  position: absolute;
}

.resizers .resizer.top-left {
  left: -9px;
  top: -9px;
  cursor: nwse-resize;
}
.resizers .resizer.top-right {
  right: -9px;
  top: -9px;
  cursor: nesw-resize;
}
.resizers .resizer.bottom-left {
  left: -9px;
  bottom: -9px;
  cursor: nesw-resize;
}
.resizers .resizer.bottom-right {
  right: -9px;
  bottom: -9px;
  cursor: nwse-resize;
}

@media screen and (max-width: 1160px) {
  .editor {
    width: 70%;
  }
}
</style>
