const ready = () => {
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

const init = () => {
  const myBooksDiv = document.getElementById('myBooks');
  const newBookTitle = myBooksDiv.querySelector('h2');

  const addBookButton = document.createElement('button');
  addBookButton.textContent = 'Ajouter un livre';
  addBookButton.addEventListener('click', showForm)
  addBookButton.id = 'addBookButton' 
  newBookTitle.after(addBookButton);

  let searchResults;

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

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Enregistrer';
    submitButton.id = 'submitButton';

    const cancelButton = document.createElement('button'); 
    cancelButton.textContent = 'Annuler';
    cancelButton.id = 'cancelButton';
    cancelButton.addEventListener('click', () => {
      hideForm(form);
      addBookButton.style.display = 'inline';
    });

    form.appendChild(inputTitle);
    form.appendChild(inputAuthor);
    form.appendChild(submitButton);
    form.appendChild(cancelButton);

    newBookTitle.after(form);
    addBookButton.style.display = 'none';

    function hideForm(form) {
      if (form) {
        form.reset(); 
        form.remove();
 
      }
    }

    //form caché après init -> addBookButton.disabled = true; -> addBookButton.remove(); 
    // VS méthode : addbookbutton.style.display inline/none 

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
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);
  return data;
}


// }

}

// TO DO
// placer les elements ("titre du livre"/"auteur") CSS
//fetch https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
// function displaySearchResults(results) -> Afficher les résultats de recherche dans l'UX
        // try {
        //   const searchResults = await searchBooks(titleValue, authorValue);
        //   displaySearchResults(searchResults);
        // } 
        // catch (error) {
        //   console.error('Erreur lors de la recherche :', error);
        // }

// idéalement : 
// fetch("url")
        // .then(res =>res.json())
        // .then(({ items: [ { results!? : { Title, Author } } ] }) => {
        //   console.log(title);
        //   console.log(author);
        // }),

        // error => {
        //   console.log(error + 'probleme de recherche');
        // };
