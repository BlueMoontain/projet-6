import { hideForm } from './script';
import jsdom from 'jsdom';

// Créez un environnement DOM avec jsdom
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>');

// Configurez l'objet global document pour utiliser le DOM simulé
global.document = dom.window.document;

describe('Tests for hideForm', () => {
  test('must hide form and reinitialize values', () => {
    const fakeForm = document.createElement('form');
    document.body.appendChild(fakeForm);

    hideForm(fakeForm);
    expect(document.querySelector('#bookForm')).toBeNull();

    const addBookButton = document.querySelector('#addBookButton');
    expect(addBookButton.style.display).toBe('inline');
  });
});