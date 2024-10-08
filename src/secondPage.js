import '@styles/scss/styles.scss'
import { Upload } from './plugins/uploaderClass'

import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDftPrbF4AnGSi5lLKwc_vqfgFA8UY0pFY",
  authDomain: "nk-upload.firebaseapp.com",
  projectId: "nk-upload",
  storageBucket: "nk-upload.appspot.com",
  messagingSenderId: "163016087613",
  appId: "1:163016087613:web:8a0881cc6ffe1b8bcdb254"
}


const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

const upload = new Upload('#file2', {
  multi: true,
  accept: ['.png', '.jpg', 'jpeg', 'gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', (snapshot) => {
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = progress
        block.style.width = progress
      }, (error) => {
        console.log(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL)
        })
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