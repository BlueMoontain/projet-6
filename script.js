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
  const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
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
  
    const bookDiv = displayBook(bookInfo, results);
    const bookmarkIcon = bookDiv.querySelector('.bookmark-icon'); 
  
    bookmarkIcon.addEventListener('click', (event) => {
      const bookClicked = results.find(book => book.id === event.target.id);
      const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
      storedBooks.push(bookClicked);
      sessionStorage.setItem('books', JSON.stringify(storedBooks));
      console.log(sessionStorage.getItem('books'));
    });
  
    const image = document.createElement('img');
    image.src = bookInfo.image;
  
    const idP = document.createElement('p');
    idP.textContent = `Identifiant: ${bookInfo.id}`;
  
    console.log('Livre trouvé :', bookInfo);
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
//   savedBooks.forEach(book => {
//   myBooksDiv.appendChild(book);
//   });
}

function displayBook(bookInfo, results) {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const titleP = document.createElement('p');
  titleP.textContent = `Titre: ${bookInfo.title}`;

  const authorP = document.createElement('p');
  authorP.textContent = `Auteur: ${bookInfo.authors[0]}`;

  const descriptionP = document.createElement('p');
  descriptionP.textContent = `Description: ${bookInfo.description}`;

  const bookmarkIcon = document.createElement('span');
  bookmarkIcon.textContent = '🔖';
  bookmarkIcon.style.cursor = 'pointer'; // CSS ?
  bookmarkIcon.id = bookInfo.id;

  bookmarkIcon.addEventListener('click', (event) => {
        const bookClicked = results.find(book => book.id === event.target.id);
        const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
        storedBooks.push(bookClicked);
        sessionStorage.setItem('books', JSON.stringify(storedBooks));
        console.log(sessionStorage.getItem('books'));
      });

      bookmarkIcon.classList.add('bookmark-icon');
      bookDiv.appendChild(bookmarkIcon);

  const searchResults = document.getElementById('searchResultsDiv');
  searchResults.appendChild(bookDiv);
  console.log('Livre trouvé :', bookInfo);
      
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
  const savedBooks = JSON.parse(sessionStorage.getItem('books')); // vérifier que tu as bien le 'books' dans le sessionStorage
  const pochList = document.getElementById('content'); 

  if (savedBooks && savedBooks.length > 0) {
    for (const book of savedBooks) {
      const bookDiv = displayBook(book, savedBooks);
      pochList.appendChild(bookDiv);
    }
  } else {
  
    const noSavedBooksMessage = document.createElement('p');
    noSavedBooksMessage.textContent = 'Retrouvez dans votre poch\'liste tous vos ouvrages sauvegardés';
    pochList.appendChild(noSavedBooksMessage);
  }
  
}