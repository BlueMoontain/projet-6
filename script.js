const ready = () => {
  if (document.readyState !== 'loading') {
    init();
    displaySavedBooks();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

let clickSource = ''; // Variable to track the source of a click action

// Initialize the application
const init = () => {
  const myBooksDiv = document.getElementById('myBooks');
  const newBookTitle = myBooksDiv.querySelector('h2');
  const divContent = document.getElementById('content');

  // Create and configure "Add a Book" button
  const addBookButton = document.createElement('button');
  addBookButton.textContent = 'Ajouter un livre';
  addBookButton.addEventListener('click', showForm);
  addBookButton.id = 'addBookButton';
  newBookTitle.after(addBookButton);

  // Create a container for search results
  const searchResults = document.createElement('div');
  searchResults.id = 'searchResultsDiv';
  const searchResultsTitle = document.createElement('h2');
  searchResultsTitle.textContent = 'Résultats de recherche';
  searchResultsTitle.id = 'searchResults-title';
  searchResults.appendChild(searchResultsTitle);
  divContent.appendChild(searchResults);
  searchResultsTitle.classList.add("hidden");
  const hrElement = myBooksDiv.querySelector('hr');
  hrElement.after(searchResults);

  // Function to show the search form
  function showForm() {
    const form = document.createElement('form');
    form.id = 'bookForm';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre du livre :';
    titleLabel.setAttribute('for', 'inputTitle');

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.id = 'inputTitle';

    const authorLabel = document.createElement('label');
    authorLabel.textContent = 'Auteur :';
    authorLabel.setAttribute('for', 'inputAuthor');

    const inputAuthor = document.createElement('input');
    inputAuthor.setAttribute('type', 'text');
    inputAuthor.id = 'inputAuthor';

    // Create submit and cancel buttons for the form
    const submitBookButton = document.createElement('button');
    submitBookButton.setAttribute('type', 'submit');
    submitBookButton.textContent = 'Rechercher';
    submitBookButton.id = 'submitBookButton';

    const cancelBookButton = document.createElement('button');
    cancelBookButton.textContent = 'Annuler';
    cancelBookButton.id = 'cancelBookButton';
    cancelBookButton.addEventListener('click', () => {
      hideForm(form);
      addBookButton.classList.remove("hidden");
      searchResults.classList.add('hidden');
    });

    // Add elements to the form
    form.appendChild(titleLabel);
    form.appendChild(inputTitle);
    form.appendChild(authorLabel);
    form.appendChild(inputAuthor);
    form.appendChild(submitBookButton);
    form.appendChild(cancelBookButton);

    newBookTitle.after(form);
    addBookButton.classList.add("hidden");
    searchResults.classList.remove('hidden');

    // Function to hide the form
    function hideForm(form) {
      if (form) {
        form.reset();
        form.remove();
      }
    }

    // Handle form submission
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const inputs = form.querySelectorAll('input[type="text"]');
      const titleValue = inputs[0].value;
      const authorValue = inputs[1].value;

      if (titleValue.trim() === '' && authorValue.trim() === '') {
        alert('Veuillez remplir au moins un des champs "Titre du livre" ou "Auteur" pour effectuer la recherche.');
        return;
      }
      if (authorValue.trim().length < 2) {
        const confirmation = confirm("La recherche peut être plus pertinente avec un nom d'auteur complet. Voulez-vous quand même rechercher des ouvrages ?");
        if (!confirmation) {
          return;
        }
      }

      console.log('Book Title:', titleValue);
      console.log('Author:', authorValue);

      searchBooks(titleValue, authorValue);

      form.reset();
    });
  }

  // Perform a book search using Google Books API
  async function searchBooks(title, author) {
    let resultsFound = false;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const results = [];
    const searchResults = document.getElementById('searchResultsDiv');
    console.log(searchResults);
    searchResults.querySelectorAll('div').forEach((n, index) => { if (index > 1) n.remove() });
    const resultBooksDiv = document.createElement('div');
    resultBooksDiv.id = 'resultsDiv';
    const searchResultsTitle = document.getElementById('searchResults-title');

    if (data.items && data.items.length > 0) {

      searchResultsTitle.classList.remove("hidden");
      for (const book of data.items) {
        const bookInfo = {
          title: book.volumeInfo.title,
          authors: (book.volumeInfo.authors) ? book.volumeInfo.authors : [],
          description: book.volumeInfo.description ? book.volumeInfo.description.slice(0, 200) + '...' : 'Aucune description disponible',
          image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
          id: book.id,
        };
        results.push(bookInfo);

        const bookDiv = displayBook(bookInfo, true, 'searchResults');
        const bookmarkIcon = bookDiv.querySelector('.bookmark-icon');
        resultBooksDiv.appendChild(bookDiv);

        const image = document.createElement('img');
        image.src = bookInfo.image;

        const idP = document.createElement('p');
        idP.textContent = `ID: ${bookInfo.id}`;

        console.log('Book Found:', bookInfo);
      }
      searchResults.appendChild(resultBooksDiv);

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
      console.log('No books found.');
    }

    return data;
  }
}

// Function to display book information
function displayBook(bookInfo, isNew, source) {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const importantBookInfo = 'important-info';

  const titleP = document.createElement('p');
  titleP.textContent = `Titre:  ${bookInfo.title}`;
  titleP.classList.add(importantBookInfo);

  const authorP = document.createElement('p');
  authorP.textContent = `Auteur: ${bookInfo.authors.length > 0 ? bookInfo.authors[0] : 'Auteur inconnu'}`;
  authorP.classList.add('author');

  const descriptionP = document.createElement('p');
  descriptionP.textContent = `Description: ${bookInfo.description ? bookInfo.description.slice(0, 200) : 'Information manquante'}`;
  descriptionP.classList.add('description');

  const bookmarkIcon = document.createElement('i');

  bookmarkIcon.classList.add('fas', `${(isNew) ? 'fa-bookmark' : 'fa-trash-can'}`);
  bookmarkIcon.id = bookInfo.id;

  bookmarkIcon.classList.add('bookmark-icon');

  if (BookmarkedOrNot(bookInfo.id)) {
    bookmarkIcon.classList.add('fas', 'fa-trash-can');
  } else {
    bookmarkIcon.classList.add('fas', 'fa-bookmark');
  }

  bookmarkIcon.addEventListener('click', (event) => {
    clickSource = source; 
    toggleBookmark(bookInfo);
    displaySavedBooks();
    event.currentTarget.classList.toggle('fa-bookmark');
    event.currentTarget.classList.toggle('fa-bookmark');
  });

  bookDiv.appendChild(bookmarkIcon);

  const image = document.createElement('img');
  image.src = bookInfo.image || 'pictures/unavailable.png';

  const idP = document.createElement('p');
  idP.textContent = `ID: ${bookInfo.id}`;
  idP.classList.add(importantBookInfo);

  bookDiv.appendChild(titleP);
  bookDiv.appendChild(idP);
  bookDiv.appendChild(authorP);
  bookDiv.appendChild(descriptionP);
  bookDiv.appendChild(image);
  bookDiv.appendChild(bookmarkIcon);

  return bookDiv;
}
// Function to display book information in Poch'List
function displaySavedBooks() {
  const savedBooksJSON = sessionStorage.getItem('books');
  const savedBooks = JSON.parse(savedBooksJSON);
  const pochList = document.getElementById('content');
  const contentBooksSaved = document.querySelectorAll('#content .book');
  pochList.querySelectorAll('*').forEach((n, index) => { if (index > 1) n.remove() });

  if (savedBooksJSON !== null && savedBooks && savedBooks.length > 0) {
    console.log('list', savedBooks); // a check
    for (const book of savedBooks) {
      const bookDiv = displayBook(book, false, 'pochList');
      pochList.appendChild(bookDiv);
    }
  }
  else {
    sessionStorage.removeItem('books');
  }

  contentBooksSaved.forEach(bookElement => {
    bookElement.classList.add('hidden');
  });
}

let isBookmarked = false;

//function to toogle bookmark icon
function toggleBookmark(book) {
  const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
  const bookIndex = storedBooks.findIndex(({ id }) => id === book.id);

  if (bookIndex !== -1) {
    if (clickSource === 'searchResults') {
      alert("Vous ne pouvez ajouter deux fois le même livre.");
    } else if (clickSource === 'pochList') {
      storedBooks.splice(bookIndex, 1);
      sessionStorage.setItem('books', JSON.stringify(storedBooks));
      displaySavedBooks(); 
    }
  } else {
    storedBooks.push(book);
    sessionStorage.setItem('books', JSON.stringify(storedBooks));
  }
}

//function to check if a book is already saved in Poch'List 
function BookmarkedOrNot(bookId) {
  const storedBooks = JSON.parse(sessionStorage.getItem('books')) || [];
  return storedBooks.some(book => book.id === bookId);
}