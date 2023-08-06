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
  addBookButton.addEventListener('click', showForm) //montrer form, cacher bouton;
  newBookTitle.after(addBookButton);

  //showForm();

  function showForm() {
    const form = document.createElement('form');

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('placeholder', 'Titre du livre');
    inputTitle.id = 'inputTitle';

    const inputAuthor = document.createElement('input');
    inputAuthor.setAttribute('type', 'text');
    inputAuthor.setAttribute('placeholder', 'Auteur');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Enregistrer';

    //cancelButton => reset form, cacher form, montrer addBookButton

    form.appendChild(inputTitle);
    form.appendChild(inputAuthor);
    form.appendChild(submitButton);

    newBookTitle.after(form);
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

// const nouveauLivreTitle = document.querySelector('.h2');
// nouveauLivreTitle.insertAdjacentElement('afterend', addBookButton);

const form = document.querySelector('form');

}

// TO DO
// créer formulaire OK
// placer correctement le formulaire (sous addbookbutton) OK
// placer les elements ("titre du livre"/"auteur") les uns en dessous des autres? CHECK
// Afficher les mots clé saisis dans le formulaire dans la console au submit.  WIP Message erreur : Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')

// ???
// _ aucune modification du HTML possible ?
//fetch https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
