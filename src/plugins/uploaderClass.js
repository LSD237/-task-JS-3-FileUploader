function byteToSize(bytes) {
  const sizes = ['Bytes,', 'KB', 'MB', 'GB', 'TB']
  if (!bytes) {
    return '0 Byte'
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag)

  if (classes.length) {
    node.classList.add(...classes)
  }

  if (content) {
    node.textContent = content
  }

  return node
}

function none() { }

export class Upload {
  constructor(selector, options = {}) {
    this.files = []
    this.options = options //? нужна ли?
    this.onUpload = options.onUpload ?? none
    this.input = document.querySelector(selector)
    this.preview = element('div', ['preview'])
    this.open = element('button', ['btn'], 'Открыть')
    this.upload = element('button', ['btn', 'primary'], 'Загрузить')

    this.checkMultiAndAccept()
    this.baseInserts()
    this.handlers()
  }

  checkMultiAndAccept() {
    if (this.options.multi) {
      this.input.setAttribute('multiple', true)
    }

    if (this.options.accept && Array.isArray(this.options.accept)) {
      this.input.setAttribute('accept', this.options.accept.join(','))
    }
  }

  baseInserts() {
    this.input.insertAdjacentElement('afterend', this.preview)
    this.input.insertAdjacentElement('afterend', this.upload)
    this.input.insertAdjacentElement('afterend', this.open)
    this.upload.style.display = 'none'
  }

  triggerInput(event) {
    this.input.click()
  }

  changeHandler(event) {
    if (!event.target.files.length) {
      return
    }

    this.files = Array.from(event.target.files)
    this.preview.innerHTML = ''
    this.upload.style.display = 'inline'

    this.files.forEach(file => {
      if (!file.type.match('image')) {
        return
      }

      const reader = new FileReader()

      reader.onload = ev => {
        const src = ev.target.result
        this.preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-image">
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}">
            <div class="preview-info">
              <span>${file.name}</span>
              ${byteToSize(file.size)}
            </div>
          </div>
        `)
      }
      reader.readAsDataURL(file)
    })
  }

  removeHandler(event) {
    if (!event.target.dataset.name) {
      return
    }

    const { name } = event.target.dataset
    this.files = this.files.filter(f => f.name !== name)

    if (!this.files.length) {
      this.upload.style.display = 'none'
    }

    const block = this.preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')

    block.classList.add('removing')
    setTimeout(() => block.remove(), 300)
  }

  clearPreview(el) {
    el.style.bottom = '0px'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  uploadHandler() {
    this.preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
    const previewInfo = this.preview.querySelectorAll('.preview-info')
    previewInfo.forEach(this.clearPreview)
    this.onUpload(this.files, previewInfo)
  }

  handlers() {
    //привязка метода triggerInput/слушатель к контексту this.
    //Это позволит работать с контекстом в методе triggerInput
    this.triggerInput = this.triggerInput.bind(this)
    this.open.addEventListener('click', this.triggerInput)
    this.changeHandler = this.changeHandler.bind(this)
    this.input.addEventListener('change', this.changeHandler)
    this.removeHandler = this.removeHandler.bind(this)
    this.preview.addEventListener('click', this.removeHandler)
    this.uploadHandler = this.uploadHandler.bind(this)
    this.upload.addEventListener('click', this.uploadHandler)
  }

}
