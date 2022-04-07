export function upload(selector, options = {}) {
  const input = document.querySelector(selector)
  const preview = document.createElement('div') //блок в котором располагаются выбранные картинки

  preview.classList.add('preview')

  const open = document.createElement('button')
  open.classList.add('btn')
  open.textContent = 'Открыть'

  if (options.multi) { //если эл-в много - добавляется атри-т позволя-й добавлять много эл-в
    input.setAttribute('multiple', true) //добавляет аттрибут и его значение
  }

  if (options.accept && Array.isArray(options.accept)) { //если прису-т параметр accept и это массив
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', open) //добавляет эл-т open после(afterend) эл-а input

  const triggerInput = () => input.click()

  const changeHandler = event => {
    // console.log(event.target.files)
    if (!event.target.files.length) { //если не выбранно не одного файла
      return
    }

    const files = Array.from(event.target.files) //преобразование к массиву

    files.forEach(file => {
      if (!file.type.match('image')) { // если это не картинка
        return
      }

      const reader = new FileReader()

      reader.onload = ev => {
        const src = ev.target.result //код картинки в формате Base64
        preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-image">
            <img src="${src}" alt="${file.name}">
          </div>
        `)
      }
      //это ассинхронное свойство по завершению работы которого вызывается событие onload (выше)
      reader.readAsDataURL(file)
    })
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
}