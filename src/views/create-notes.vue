<template>
  <div class="editor-page" id="editor-page">
    <nav class="navbar sticky mb-3">
      <div class="pl-5 py-3">
        <img src="@/assets/images/icons/doc.svg" alt="" @click="$router.push('/')"/>
        <input
          class="ml-4 title"
          type="text"
          v-model="note.title"
          title="Rename"
          placeholder="Untitled"
        />
        <span class="ml-2 text-grey italics doc-state">{{ noteSaveState }}</span>
      </div>
      <div class="pl-5 bordered-y py-1 d-flex align-center">
          <img src="@/assets/images/icons/save.svg" alt="" @click="save()" title="save"/>
        <number-input class="ml-3" @data="(v) => exec('fontSize', v)" />
        <button
          class="ml-3 d-flex align-center flex-column"
          type="color"
          @click="openColorPicker"
        >
          <img src="@/assets/images/icons/text-icon.svg" alt="" />
          <span
            class="selected-text-color mt-1"
            :style="`background: ${textColor}`"
          ></span>
          <input type="color" id="color-picker" @change="changeColor" />
        </button>
        <label class="ml-3 d-flex align-center" for="file">
          <img src="@/assets/images/icons/image.svg" alt="" />
          <input
            type="file"
            accept="image/*"
            id="file"
            style="display: none"
            @change="getImage"
          />
        </label>
      </div>
    </nav>
    <section class="p-relative">
      <div
        id="editor"
        class="editor mx-auto p-5 mb-3"
        @input="(e) => note.content = e.target.innerHTML"
        autofocus
        contenteditable
      ></div>
    </section>
  </div>
</template>

<script>
import NumberInput from '../components/number-input.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    NumberInput
  },
  data: () => ({
    textColor: '#000',
    colorPicker: '',
    showImageHint: true,
    contentChanged: false,
    editorContent: '',
    secondsSinceLastActivity: 0,
    noteSaveState: '',
    note: {
      id: '',
      title: 'Untitled',
      content: ''
    }
  }),
  mounted () {
    try {
      this.exec('styleWithCSS', true)
      this.exec('bold')
      this.note.id = this.randomNoteId()
      this.editorContent = document.getElementById('editor')
      this.colorPicker = document.getElementById('color-picker')
      this.detectActivityAndAutosave()
      if (this.$route.params.noteId) {
        const noteId = this.$route.params.noteId
        const note = Object.values(this.getNotes).find(note => note.id === noteId)
        this.editorContent.innerHTML = note.content
        this.note = note
      }
    } catch (e) {
      alert('This challenge is not supported on your browser')
    }
  },
  computed: {
    ...mapGetters([
      'getNotes'
    ])
  },
  methods: {
    ...mapActions([
      'saveNote'
    ]),
    exec (command, arg) {
      document.execCommand(command, true, arg)
    },
    randomNoteId () {
      return '_' + Math.random().toString(36).substr(2, 10)
    },
    openColorPicker () {
      this.colorPicker.click()
    },
    changeColor (evt) {
      const color = evt.target.value
      this.textColor = color
      this.exec('foreColor', color)
    },
    getImage (e) {
      const file = e.target.files[0]

      const reader = new FileReader()

      let dataURI

      reader.addEventListener(
        'load',
        () => {
          dataURI = reader.result

          const img = document.createElement('img')
          img.style.height = '600px'
          img.style.width = '400px'
          img.addEventListener('click', this.showResizer)
          img.src = dataURI
          this.editorContent.appendChild(img)
          if (this.showImageHint) {
            setTimeout(() => {
              alert('click on an image to show the resize controls and click outside the image when done')
            }, 1000)
            this.showImageHint = false
          }
        },
        false
      )

      if (file) {
        reader.readAsDataURL(file)
      }
    },
    showResizer (e) {
      const img = e.target
      const resizers = document.createElement('div')
      resizers.setAttribute('class', 'resizers')
      resizers.innerHTML = `<span class="resizer top-left"></span>
            <span class="resizer top-right"></span>
            <span class="resizer bottom-left"></span>
            <span class="resizer bottom-right"></span>`
      img.parentNode.insertBefore(resizers, img)
      resizers.appendChild(img)
      this.makeResizable(img, resizers)
      this.addRemoveListenerToResizer(resizers, img)
    },
    removeResizer (resizer, img) {
      resizer.parentNode.insertBefore(img, resizer)
      // remove resizer
      resizer.remove()
    },
    addRemoveListenerToResizer (resizer, img) {
      // pass once: true to disable the listener after it is invoked to avoid memory leaks
      document.addEventListener('click', (evt) => {
        const targetimg = evt.target

        // listen for when the click is outside the resizer
        if (targetimg !== resizer && targetimg !== img) {
          this.removeResizer(resizer, img)
        } else {
          this.addRemoveListenerToResizer(resizer, img)
        }
      }, { once: true })
    },
    makeResizable (img, resizersElement) {
      const resizers = resizersElement.querySelectorAll(' .resizer')
      const minimumSize = 20
      let originalWidth = 0
      let originalHeight = 0
      let originalX = 0
      let originalY = 0
      let originalMouseX = 0
      let originalMouseY = 0

      for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i]
        currentResizer.addEventListener('mousedown', (e) => {
          e.preventDefault()
          originalWidth = parseFloat(getComputedStyle(img, null).getPropertyValue('width').replace('px', ''))
          originalHeight = parseFloat(getComputedStyle(img, null).getPropertyValue('height').replace('px', ''))
          originalX = img.getBoundingClientRect().left
          originalY = img.getBoundingClientRect().top
          originalMouseX = e.pageX
          originalMouseY = e.pageY
          window.addEventListener('mousemove', resize)
          window.addEventListener('mouseup', stopResize)
        })

        const resize = (e) => {
          if (currentResizer.classList.contains('bottom-right')) {
            const width = originalWidth + (e.pageX - originalMouseX)
            const height = originalHeight + (e.pageY - originalMouseY)
            if (width > minimumSize) {
              img.style.width = width + 'px'
            }
            if (height > minimumSize) {
              img.style.height = height + 'px'
            }
          } else if (currentResizer.classList.contains('bottom-left')) {
            const height = originalHeight + (e.pageY - originalMouseY)
            const width = originalWidth - (e.pageX - originalMouseX)
            if (height > minimumSize) {
              img.style.height = height + 'px'
            }
            if (width > minimumSize) {
              img.style.width = width + 'px'
              img.style.left = originalX + (e.pageX - originalMouseX) + 'px'
            }
          } else if (currentResizer.classList.contains('top-right')) {
            const width = originalWidth + (e.pageX - originalMouseX)
            const height = originalHeight - (e.pageY - originalMouseY)
            if (width > minimumSize) {
              img.style.width = width + 'px'
            }
            if (height > minimumSize) {
              img.style.height = height + 'px'
              img.style.top = originalY + (e.pageY - originalMouseY) + 'px'
            }
          } else {
            const width = originalWidth - (e.pageX - originalMouseX)
            const height = originalHeight - (e.pageY - originalMouseY)
            if (width > minimumSize) {
              img.style.width = width + 'px'
              img.style.left = originalX + (e.pageX - originalMouseX) + 'px'
            }
            if (height > minimumSize) {
              img.style.height = height + 'px'
              img.style.top = originalY + (e.pageY - originalMouseY) + 'px'
            }
          }
        }

        const stopResize = () => {
          window.removeEventListener('mousemove', resize)
        }
      }
    },
    detectActivityAndAutosave () {
      // save after 1 second of inactivity
      const maxInactivity = 1

      // Setup the setInterval method to run
      // at 500 milliseconds.
      setInterval(() => {
        this.secondsSinceLastActivity++
        if (this.secondsSinceLastActivity > maxInactivity) {
          if (this.contentChanged) {
            // save
            this.save()
          }
        }
      }, 500)

      // An array of DOM events that should be interpreted as
      // user activity.
      const activityEvents = [
        'mousedown', 'keydown',
        'scroll', 'touchstart'
      ]

      // add these events to the document.
      // register the activity function as the listener parameter.
      activityEvents.forEach((eventName) => {
        document.addEventListener(eventName, this.resetActivity, true)
      })
    },
    save () {
      this.noteSaveState = 'Saving...'
      const note = { ...this.note }
      note.content = this.editorContent.innerHTML
      this.saveNote(note)
      setTimeout(() => {
        this.noteSaveState = ''
      }, 300)
      this.contentChanged = false
    },
    resetActivity () {
      this.secondsSinceLastActivity = 0
      if (this.note.content || this.note.title) {
        this.contentChanged = true
      }
    }
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
</style>
