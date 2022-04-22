import '@styles/scss/styles.scss'
import { upload } from './plugins/upload'
//установили через npm firebase и далее все по документации
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: "***************************************",
  authDomain: "************************",
  projectId: "*********",
  storageBucket: "*********************",
  messagingSenderId: "************",
  appId: "*****************************************"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

upload('#file', {
  multi: true, //для добавления множества фай-в
  accept: ['.png', '.jpg', 'jpeg', '.gif'], //добавлять фай-ы тлько с такими расши-ми
  onUpload(files, blocks) { //длля загрузки на сервер
    files.forEach((file, index) => {
      //Firebase документация(Строить-Место хранения-Web-Загрузить файлы)
      const storageRef = ref(storage, `images/${file.name}`) //название папки в хранилище
      const uploadTask = uploadBytesResumable(storageRef, file) //загрузка файла

      uploadTask.on('state_changed', (snapshot) => { //для прогрессбара
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%' //цифорки загруженных процентов
        const block = blocks[index].querySelector('.preview-info-progress') //взят эл-т с прогрессбаром
        block.textContent = progress
        block.style.width = progress
      }, (error) => {
        console.log(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL) //фа-л доступен по адресу - "ссылка"
        })
        // console.log('Complete')
      })
    });
  }
})
//подсветка текущей страницы (в хэдэре)
const doc = window.document
const linksCount = doc.links.length
for (let i = 0; i < linksCount; i++)
  if (doc.URL.startsWith(doc.links[i].href))
    doc.links[i].classList.add('active')