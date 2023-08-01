
const contentDiv = document.getElementById('content');

const addBookButton = document.createElement('button');
addBookButton.textContent = 'Ajouter un livre';

function showForm() {
  
    const form = document.createElement('form');

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('placeholder', 'Titre du livre');

    const inputAuthor = document.createElement('input');
    inputAuthor.setAttribute('type', 'text');
    inputAuthor.setAttribute('placeholder', 'Auteur');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Enregistrer';

    form.appendChild(inputTitle);
    form.appendChild(inputAuthor);
    form.appendChild(submitButton);

    const nouveauLivreTitle = document.querySelector('.h2');
    nouveauLivreTitle.insertAdjacentElement('afterend', form);

    addBookButton.disabled = true;
    addBookButton.remove();
}

addBookButton.addEventListener('click', showForm);

const nouveauLivreTitle = document.querySelector('.h2');
nouveauLivreTitle.insertAdjacentElement('afterend', addBookButton);

// placer correctement le formulaire (sous addbookbutton) OK
// placer les elements ("titre du livre"/"auteur") les uns en dessous des autres ?
// Afficher les mots clé saisis dans le formulaire dans la console au submit
