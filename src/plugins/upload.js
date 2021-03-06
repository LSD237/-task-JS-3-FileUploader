function byteToSize(bytes) {
  const sizes = ['Bytes,', 'KB', 'MB', 'GB', 'TB']
  if (!bytes) {
    return '0 Byte'
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}
//Ф-я хелпер
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

export function upload(selector, options = {}) {
  let files = []
  const onUpload = options.onUpload ?? none
  const input = document.querySelector(selector)
  const preview = element('div', ['preview']) //блок в котором располагаются выбранные картинки
  const open = element('button', ['btn'], 'Открыть')
  const upload = element('button', ['btn', 'primary'], 'Загрузить')
  upload.style.display = 'none'

  if (options.multi) { //если эл-в много - добавляется атри-т позволя-й добавлять много эл-в
    input.setAttribute('multiple', true) //добавляет аттрибут и его значение
  }

  if (options.accept && Array.isArray(options.accept)) { //если прису-ет параметр accept и это массив
    input.setAttribute('accept', options.accept.join(',')) //возможность выбора только картинок
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', upload)
  input.insertAdjacentElement('afterend', open) //добавляет эл-т open после(afterend) эл-а input

  const triggerInput = () => input.click()

  const changeHandler = event => {
    // console.log(event.target.files)
    if (!event.target.files.length) { //если не выбранно не одного файла
      return
    }
    //в свойстве files у <input type="file"> содержатся выбранные файлы
    files = Array.from(event.target.files) //преобразование фай-в к массиву
    preview.innerHTML = '' //отчистка блока для добавления ф-в
    upload.style.display = 'inline' //показать кнопку загрузки

    files.forEach(file => {
      if (!file.type.match('image')) { // если это не картинка
        return
      }

      const reader = new FileReader()

      reader.onload = ev => {
        const src = ev.target.result //код картинки в формате Base64
        preview.insertAdjacentHTML('afterbegin', `
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
      //это ассинхронное свойство по завершению работы которого вызывается событие onload (выше)
      reader.readAsDataURL(file)
    })
  }

  const removeHandler = event => {
    if (!event.target.dataset.name) {
      return
    }

    const { name } = event.target.dataset
    files = files.filter(f => f.name !== name)

    if (!files.length) {
      upload.style.display = 'none'
    }

    const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')

    block.classList.add('removing')
    setTimeout(() => block.remove(), 300)
  }

  const clearPreview = el => {
    el.style.bottom = '0px'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  //обработчик для загрузки на сервер
  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach(e => e.remove()) //удаляет все крестики
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview) //переделывает все "preview-info" в "preview-info-progress"(под прогрессбар)
    onUpload(files, previewInfo)
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}