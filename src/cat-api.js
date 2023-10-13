import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] =
  'live_U9Wh061NmwnMWAhpBVlLlM7b4iGF1LWh1BsblD68mAsSJirrVfjpMXnHV3EXtlzH';

export function fetchBreeds() {
  return axios
    .get('/breeds')
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`/images/search?breed_ids=${breedId}`)
    .then(response => {
      if (response.data.length === 0) {
        throw Notiflix.Notify.failure('Дані про цю породу відсутні');
      }
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}
