import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] =
  'live_U9Wh061NmwnMWAhpBVlLlM7b4iGF1LWh1BsblD68mAsSJirrVfjpMXnHV3EXtlzH';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

function showLoader() {
  loader.classList.remove('is-hidden');
  catInfo.classList.add('is-hidden');
  breedSelect.disabled = true;
  error.classList.add('is-hidden');
}

function hideLoader() {
  loader.classList.add('is-hidden');
  breedSelect.disabled = false;
}

function showError(message) {
  error.classList.remove('is-hidden');
  error.textContent = 'Помилка: ' + message;
}

function populateBreedSelect(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}
showLoader();

fetchBreeds()
  .then(breeds => {
    populateBreedSelect(breeds);
    hideLoader();
    breedSelect.classList.remove('is-hidden');
  })
  .catch(error => {
    showError('Помилка при отриманні порід котів: ' + error.message);
    hideLoader();
  });

breedSelect.addEventListener('change', renderCats);

function renderCats() {
  const selectedBreedId = breedSelect.value;
  if (selectedBreedId) {
    showLoader();

    fetchCatByBreed(selectedBreedId)
      .then(cats => {
        catInfo.innerHTML = '';
        cats.forEach(cat => {
          const { breeds } = cat;
          if (breeds && breeds.length > 0) {
            const firstBreed = breeds[0];

            const image = document.createElement('img');
            image.src = cat.url;
            image.classList.add('cat-img');

            const paragraphContainer = document.createElement('div');
            paragraphContainer.classList.add('p-container');
            const name = document.createElement('p');
            name.textContent = 'Name: ' + firstBreed.name;
            paragraphContainer.appendChild(name);

            const description = document.createElement('p');
            description.textContent = 'Description: ' + firstBreed.description;
            paragraphContainer.appendChild(description);

            const temperament = document.createElement('p');
            temperament.textContent = 'Temperament: ' + firstBreed.temperament;
            paragraphContainer.appendChild(temperament);
            catInfo.appendChild(image);
            catInfo.appendChild(paragraphContainer);
          } else {
            showError('Інформація про породу відсутня.');
          }
        });

        hideLoader();
        catInfo.classList.remove('is-hidden');
      })
      .catch(error => {
        console.error('Помилка при отриманні інформації про кота:', error);
        hideLoader();
        showError(error.message);
      });
  }
}
