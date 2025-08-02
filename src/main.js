import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
let currentPage = 1;
let currentQuery = '';
const perPage = 15;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search term.', position: 'topRight' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  loadMoreBtn.classList.add('hidden');
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(currentQuery, currentPage);

    if (hits.length === 0) {
      iziToast.info({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);
    const firstGalleryItem = document.querySelector('.gallery-item');
if (firstGalleryItem) {
  const { height } = firstGalleryItem.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

    if (currentPage * perPage >= totalHits) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(currentQuery, currentPage);
    createGallery(hits);

    if (currentPage * perPage >= totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});