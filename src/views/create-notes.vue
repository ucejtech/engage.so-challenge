<template>
  <div class="editor-page">
    <nav class="navbar sticky mb-3">
      <div class="pl-5 py-3">
        <img src="@/assets/images/icons/doc.svg" alt="" />
        <input class="ml-4 title" type="text" v-model="note.title" title="Rename" placeholder="Untitled">
        <span class="ml-2 text-grey italics doc-state">Saving ...</span>
      </div>
      <div class="pl-5 bordered-y py-1 d-flex align-center">
        <number-input @data="(v) => exec('fontSize', v)" />
        <button class="ml-3 d-flex align-center flex-column" type="color" @click="openColorPicker">
          <img src="@/assets/images/icons/text-icon.svg" alt="" />
          <span
            class="selected-text-color mt-1"
            :style="`background: ${textColor}`"
          ></span>
          <input type="color" id="color-picker" @change="changeColor"/>
        </button>
        <div class="ml-3 d-flex align-center">
          <img src="@/assets/images/icons/image.svg" alt="" />
        </div>
      </div>
    </nav>
    <section>
      <div
        class="editor mx-auto p-5 mb-3"
        autofocus
        contenteditable
      ></div>
    </section>
  </div>
</template>

<script>
import NumberInput from '../components/number-input.vue'
export default {
  components: {
    NumberInput
  },
  data: () => ({
    titleEdit: false,
    textColor: '#000',
    colorPicker: '',
    note: {
      title: '',
      content: ''
    }
  }),
  mounted () {
    try {
      this.exec('styleWithCSS', true)
      this.exec('bold')
      this.colorPicker = document.getElementById('color-picker')
    } catch (e) {
      alert('This demo is not supported on your level of Mozilla.')
    }
  },
  methods: {
    exec (command, arg) {
      document.execCommand(command, true, arg)
    },
    openColorPicker () {
      this.colorPicker.click()
    },
    changeColor (evt) {
      const color = evt.target.value
      this.textColor = color
      this.exec('foreColor', color)
    }
  }
}
</script>

<style scoped>
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
  min-width: 1px;
}
input.title:hover {
  padding: 3px;
  border-radius: 4px;
  border: 1px solid rgb(56, 51, 51);
}
.navbar {
  background: #fff;
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
button {
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
  height: 877px;
}
.editor:focus {
  outline: none;
}
</style>
