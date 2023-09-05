const ready = () => {
  if (document.readyState !== 'loading') {
    init();
    displaySavedBooks();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

const init = () => {
  const myBooksDiv = document.getElementById('myBooks');
  const newBookTitle = myBooksDiv.querySelector('h2');
  const divContent = document.getElementById('content');

  const addBookButton = document.createElement('button');
  addBookButton.textContent = 'Ajouter un livre';
  addBookButton.addEventListener('click', showForm)
  addBookButton.id = 'addBookButton' 
  newBookTitle.after(addBookButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResultsDiv';
  const searchResultsTitle = document.createElement('h2');
  searchResultsTitle.textContent = 'Résultats de recherche';
  searchResults.appendChild(searchResultsTitle);
  divContent.appendChild(searchResults);
  searchResultsTitle.style.display = 'none';
  const hrElement = myBooksDiv.querySelector('hr');
  hrElement.after(searchResults);
 
  
  
  function showForm() {
    const form = document.createElement('form');
    form.id ="bookForm";

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('placeholder', 'Titre du livre');
    inputTitle.id = 'inputTitle';

    const inputAuthor = document.createElement('input');
    inputAuthor.setAttribute('type', 'text');
    inputAuthor.setAttribute('placeholder', 'Auteur');
    inputAuthor.id = 'inputAuthor'

    const submitBookButton = document.createElement('button');
    submitBookButton.setAttribute('type', 'submit');
    submitBookButton.textContent = 'Enregistrer';
    submitBookButton.id = 'submitBookButton';

    const cancelBookButton = document.createElement('button'); 
    cancelBookButton.textContent = 'Annuler';
    cancelBookButton.id = 'cancelButton';
    cancelBookButton.addEventListener('click', () => {
      hideForm(form);
      addBookButton.style.display = 'inline';
    });

    form.appendChild(inputTitle);
    form.appendChild(inputAuthor);
    form.appendChild(submitBookButton);
    form.appendChild(cancelBookButton);

    newBookTitle.after(form);
    addBookButton.style.display = 'none';
    searchResultsTitle.style.display = 'inline';
    

  function hideForm (form) {
      if (form) {
        form.reset(); 
        form.remove();
 
      }
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
      
        const inputs = form.querySelectorAll('input[type="text"]');
        const titleValue = inputs[0].value;
        const authorValue = inputs[1].value;
      
        console.log('Titre du livre :', titleValue);
        console.log('Auteur :', authorValue);
        searchBooks(titleValue, authorValue);

        form.reset();
      });
}

const form = document.querySelector('form');


async function searchBooks(title, author) {
  let resultsFound = false;
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  const results = [];
  const searchResults = document.getElementById('searchResultsDiv');
  console.log(searchResults);
  searchResults.querySelectorAll('*').forEach((n, index) =>  {if(index > 1) n.remove()});


  if (data.items && data.items.length > 0) {
    
  for (const book of data.items) {
    const bookInfo = {
      title: book.volumeInfo.title,
      authors: (book.volumeInfo.authors) ? book.volumeInfo.authors : [],
      description: book.volumeInfo.description ? book.volumeInfo.description.slice(0, 200) + '...' : 'Aucune description disponible',
      image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
      id: book.id,
    };
    results.push(bookInfo);
  
    const bookDiv = displayBook(bookInfo); // rsuts
    const bookmarkIcon = bookDiv.querySelector('.bookmark-icon');

  
    bookmarkIcon.addEventListener('click', (event) => {
      const bookClicked = results.find(book => book.id === event.target.id);
      const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
      storedBooks.push(bookClicked);
      sessionStorage.setItem('books', JSON.stringify(storedBooks));
      console.log(sessionStorage.getItem('books'));
      displaySavedBooks();
    });
  
    const image = document.createElement('img');
    image.src = bookInfo.image;
  
    const idP = document.createElement('p');
    idP.textContent = `Identifiant: ${bookInfo.id}`;
  
    console.log('Livre trouvé :', bookInfo);
    searchResults.appendChild(bookDiv);
  }
  

    console.log(results.length);

    sessionStorage.setItem('savedBooks', JSON.stringify(results));
    resultsFound = true;
    }
  
      if (!resultsFound && searchResults) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'Aucun livre trouvé.';
      
      const existingNoResultsMessage = searchResults.querySelector('#noResultsMessage');
      if (existingNoResultsMessage) {
        searchResults.removeChild(existingNoResultsMessage);
      }
      
      searchResults.appendChild(noResultsMessage);
    }
    else {
    console.log('Aucun livre trouvé.');
   }

  return data;
  }

// const savedBooks = JSON.parse(sessionStorage.getItem('savedBooks')) || [];
// savedBooks.forEach(book => {
//   // let tempresult;
//   // let bookDiv = displayBook(book, tempresult);
//   // myBooksDiv.appendChild(bookDiv);
// });
// // DECLENCHE ERREUR DE NOEUDS ?

}

function displayBook(bookInfo) {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const titleP = document.createElement('p');
  titleP.textContent = `Titre: ${bookInfo.title}`;

  const authorP = document.createElement('p');
  authorP.textContent = `Auteur: ${bookInfo.authors[0]}`;

  const descriptionP = document.createElement('p');
  descriptionP.textContent = `Description: ${bookInfo.description}`;

  const bookmarkIcon = document.createElement('i');
  bookmarkIcon.addEventListener('click', toggleBookmark); // toggle
  bookmarkIcon.addEventListener('click', () => {
    const bookId = bookInfo.id;
    if (BookmarkedOrNot(bookId)) {
      alert('Vous ne pouvez pas ajouter deux fois le même livre.');
    } else {
      saveBookToPochList(bookInfo);
      bookmarkIcon.classList.remove('fa-bookmark');
      bookmarkIcon.classList.add('fa-trash-can');
    }
  });

  bookmarkIcon.classList.add('fas', 'fa-bookmark'); 
  bookmarkIcon.id = bookInfo.id;

  bookmarkIcon.classList.add('bookmark-icon');
  bookDiv.appendChild(bookmarkIcon);
     
  const image = document.createElement('img');
  image.src = bookInfo.image;

  const idP = document.createElement('p');
  idP.textContent = `Identifiant: ${bookInfo.id}`;

  bookDiv.appendChild(titleP);
  bookDiv.appendChild(authorP);
  bookDiv.appendChild(descriptionP);
  bookDiv.appendChild(bookmarkIcon);
  bookDiv.appendChild(image);
  bookDiv.appendChild(idP);
  return bookDiv;
}

function displaySavedBooks() {
  const savedBooksJSON = sessionStorage.getItem('books'); 
  const savedBooks = JSON.parse(savedBooksJSON); 
  const pochList = document.getElementById('content');
  pochList.querySelectorAll('*').forEach((n, index) =>  {if(index > 1) n.remove()});

  if (savedBooksJSON !== null && savedBooks && savedBooks.length > 0) {
    console.log('COUCOU', savedBooks);
    for (const book of savedBooks) {
      const bookDiv = displayBook(book, savedBooks);
      //queryselector bookmark qui va virer le livre de la pochliste (findindex, split et tu resave le sessionstorage)
      pochList.appendChild(bookDiv);
    }
  } 

  else {
    const noSavedBooksMessage = document.createElement('p');
    noSavedBooksMessage.textContent = 'Retrouvez dans votre poch\'liste tous vos ouvrages sauvegardés';
    pochList.appendChild(noSavedBooksMessage);
  }
}

    // bookmarkIcon.addEventListener('click', (event) => {
  //   const bookClicked = results.find(book => book.id === event.target.id);
  //   const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
  //   storedBooks.push(bookClicked);
  //   sessionStorage.setItem('books', JSON.stringify(storedBooks));
  //   console.log(sessionStorage.getItem('books'));
  // });

  // const searchResults = document.getElementById('searchResultsDiv');
  // searchResults.appendChild(bookDiv);
  // console.log('Livre trouvé :', bookInfo);


  // wip about trash icon toggle

  let isBookmarked = false;
  
  
  function toggleBookmark() {
    const bookmarkIcon = document.querySelector('.fa-bookmark');
    let isBookmarked = false;
      if (!isBookmarked) {
          const trashIcon = document.createElement('i');
          trashIcon.classList.add('fas', 'fa-trash-can');
          bookmarkIcon.replaceWith(trashIcon);
          isBookmarked = true;
      } else {
          const bookmarkIcon = document.createElement('i');
          bookmarkIcon.classList.add('fas', 'fa-bookmark');
          trashIcon.replaceWith(bookmarkIcon);
          isBookmarked = false;
      }
  }

  function BookmarkedOrNot(bookId) {
    const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
    return storedBooks.some(book => book.id === bookId);
  }

  bookmarkIcon.addEventListener('click', 'toggleBookmark')
