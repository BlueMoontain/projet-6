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

  //showForm();
  //montrer form, cacher bouton;

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

    //cancelButton => reset form, cacher form, montrer addBookButton

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
    //form caché après init

    //addBookButton.disabled = true;
    //addBookButton.remove();
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
      
        const inputs = form.querySelectorAll('input[type="text"]');

        const titleValue2 = form.getElementById('inputTitle').value;
      
        const titleValue = inputs[0].value;
        const authorValue = inputs[1].value;
      
        console.log('Titre du livre :', titleValue);
        console.log('Auteur :', authorValue);
      
        form.reset();
      });
}

const form = document.querySelector('form');

}

// TO DO
// placer les elements ("titre du livre"/"auteur") les uns en dessous des autres? CHECK
//fetch https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
