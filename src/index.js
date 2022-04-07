import '@styles/scss/styles.scss'

import { upload } from './plugins/upload'

upload('#file', {
  multi: true, //для добавления множества фай-в
  accept: ['.png', '.jpg', 'jpeg', '.gif'] //добавлять фай-ы тлько с такими расши-ми
})