/**
 * [
 *    {
 *      id: <int>
 *      title: <string>
 *      author: <string>
 *      year: <int>
 *      isComplete: <boolean>
 *    }
 * ]
 */

 const books = [];
 const RENDER_EVENT = 'render-book';
 const SAVED_EVENT = 'saved-book';
 const STORAGE_KEY = 'BOOKSHELF';
 
 function generateId() {
    return +new Date();
  }
  
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }

 
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
  
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }
   

  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }


  function saveData(save) {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      notify(save)
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  

  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  

  function makeBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject;
  
    const pembatas = document.createElement('hr');

    const textTitle = document.createElement('h5');
    textTitle.classList.add('card-title');
    textTitle.innerText = title;
  
    const textAuthor = document.createElement('h6');
    textAuthor.classList.add('card-subtitle','mb-2','text-muted');
    textAuthor.innerText = author;
  
    const textYear = document.createElement('p');
    textYear.classList.add('card-text');
    textYear.innerText = year;
  
    const textContainer = document.createElement('article');
    textContainer.classList.add('my-3');
    textContainer.append(textTitle, textAuthor, textYear, pembatas);
    textContainer.setAttribute('id', `book-${id}`);
  
    if (isComplete) {
      const checkButtonA = document.createElement('button');
      checkButtonA.classList.add('btn', 'btn-warning', 'btn-sm');
      checkButtonA.innerText = 'Belum Selesai Baca ⏪';
      checkButtonA.addEventListener('click', function () {
        checkToIncomplete(id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
      trashButton.innerText = 'Hapus Buku 🪣';
      trashButton.addEventListener('click', function () {
        removeBook(id);
      });
  
      textContainer.append(checkButtonA, trashButton);
    } else {
  
      const checkButtonB = document.createElement('button');
      checkButtonB.classList.add('btn', 'btn-success', 'btn-sm');
      checkButtonB.innerText = 'Selesai Baca ✅';
      checkButtonB.addEventListener('click', function () {
        checkToComplete(id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
      trashButton.innerText = 'Hapus Buku 🪣';
      trashButton.addEventListener('click', function () {
        removeBook(id);
      });
  
      textContainer.append(checkButtonB, trashButton);
    }
  
    return textContainer;
  }

  function addBook() {
    const title = document.getElementById('judul').value;
    const author = document.getElementById('penulis').value;
    const year = document.getElementById('tahun').value;
    const isComplete = document.getElementById('baca').checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));

    const save = 'add';
    saveData(save);
  }
  
  function checkToComplete(bookId /* HTMLELement */) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    const save = 'check';
    saveData(save);
  }
  
  function removeBook(bookId /* HTMLELement */) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    const save = 'remove';
    saveData(save);
  }
  
  function checkToIncomplete(bookId /* HTMLELement */) {
  
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    const save = 'uncheck';
    saveData(save);
  }

  function searchBook(){
    const titleBook = document.getElementById('cari').value;
    const renderBook = document.querySelectorAll('.card-title')

    for (render of renderBook){
        if (titleBook !== render.innerText){
            console.log(render.innerText)
            render.parentElement.remove();
        }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
 
    const submitForm = document.getElementById('form');
  
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    const searchBooks = document.getElementById('submit');
  
    searchBooks.addEventListener('click', function (event) {
        event.preventDefault();
        searchBook();
      });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')  
const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)

    setInterval(lost,5000)

    function lost(){
      wrapper.remove();
    }
  }

  function notify(save){
    if(save == 'add'){
      alert('Buku Berhasil Masuk Rak!', 'success')
    }else if(save == 'check'){
      alert('Buku selesai dibaca!', 'info')
    }else if(save == 'uncheck'){
      alert('Buku pindah ke rak sebelah!', 'warning')
    }else {
      alert('buku dikeluarkan dari rak', 'danger')
    }
  }
  
  document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di perbaharui.');

  });
  
  document.addEventListener(RENDER_EVENT, function () {
    const belumBaca = document.getElementById('belum');
    const sudahBaca = document.getElementById('sudah');
  
    // clearing list item
    belumBaca.innerHTML = '';
    sudahBaca.innerHTML = '';
  
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isComplete) {
        sudahBaca.append(bookElement);
      } else {
        belumBaca.append(bookElement);
      }
    }
  })

  
