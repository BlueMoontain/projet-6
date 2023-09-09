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
    submitBookButton.textContent = 'Rechercher';
    submitBookButton.id = 'submitBookButton';

    const cancelBookButton = document.createElement('button'); 
    cancelBookButton.textContent = 'Annuler';
    cancelBookButton.id = 'cancelBookButton';
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

  //   // contrainte de validation 
  //   form.addEventListener('submit', (event) => {
  //     const valeurAuteur = inputAuthor.value;

  //     if (valeurAuteur.length < 2) {
  //         event.preventDefault(); 
  //         alert("La recherche peut-être plus pertinente avec un nom d'auteur complet");
  //     }
  // });

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

        if (titleValue.trim() === '' || authorValue.trim() === '') {
          alert('Les champs "Titre du livre" et "Auteur" ne peuvent pas être laissé vides.');
          return;
        }
      
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
  
    const bookDiv = displayBook(bookInfo, true); // rsuts
    const bookmarkIcon = bookDiv.querySelector('.bookmark-icon');

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
}

function displayBook(bookInfo, isNew) {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const titleP = document.createElement('p');
  titleP.textContent = `Titre: ${bookInfo.title}`;

  const authorP = document.createElement('p');
  authorP.textContent = `Auteur: ${bookInfo.authors.length > 0 ? bookInfo.authors[0] : 'Auteur inconnu'}`;

  const descriptionP = document.createElement('p');
  descriptionP.textContent = `Description: ${bookInfo.description ? bookInfo.description.slice(0, 200) : 'Information manquante'}`;

  const bookmarkIcon = document.createElement('i');

  bookmarkIcon.classList.add('fas', `${(isNew) ? 'fa-bookmark' : 'fa-trash-can'}`);
  bookmarkIcon.id = bookInfo.id;

  bookmarkIcon.classList.add('bookmark-icon');

  bookmarkIcon.addEventListener('click', () => {
    toggleBookmark(bookInfo);
    displaySavedBooks();
    bookmarkIcon.classList.toggle('fa-bookmark');
    bookmarkIcon.classList.toggle('fa-trash-can');
  })

  bookDiv.appendChild(bookmarkIcon);
     
  const image = document.createElement('img');
  image.src = bookInfo.image || 'pictures/unavailable.png'; 

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
      const bookDiv = displayBook(book, false);
      pochList.appendChild(bookDiv);
    }
  } 

  else {
    const noSavedBooksMessage = document.createElement('p');
    noSavedBooksMessage.textContent = 'Retrouvez dans votre poch\'liste tous vos ouvrages sauvegardés';
    pochList.appendChild(noSavedBooksMessage);
  }
}

  let isBookmarked = false;

  function toggleBookmark(book) {

    const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
  
    const bookIndex = storedBooks.findIndex(({id}) => id === book.id);
  
    if (bookIndex !== -1) {

      storedBooks.splice(bookIndex, 1);
      sessionStorage.setItem('books', JSON.stringify(storedBooks));

    } else {

        storedBooks.push(book);
        sessionStorage.setItem('books', JSON.stringify(storedBooks));
  
      }
  }  
  
  function BookmarkedOrNot(bookId) {
    const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
    return storedBooks.some(book => book.id === bookId);
  }