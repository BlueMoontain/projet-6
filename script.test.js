import { hideForm } from './script';

describe('Tests for hideForm', () => {
  test('must hide form and reinitialyze values', () => {
    
    const fakeForm = document.createElement('form');
    document.body.appendChild(fakeForm);

    hideForm(fakeForm);
    expect(document.querySelector('#bookForm')).toBeNull();

    const addBookButton = document.querySelector('#addBookButton');
    expect(addBookButton.style.display).toBe('inline');
  });
});
