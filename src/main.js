import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMore,
    hideLoadMore,
    disableLoadMore,
    enableLoadMore,
  } from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMore();
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

    const isLastPage = hits.length < PER_PAGE || currentPage * PER_PAGE >= totalHits;

    if (isLastPage) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMore();
    } else {
      showLoadMore();
    }

  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    hideLoadMore();
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  disableLoadMore();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(currentQuery, currentPage);
    createGallery(hits);

    const isLastPage = hits.length < PER_PAGE || currentPage * PER_PAGE >= totalHits;

    if (isLastPage) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMore();
    } else {
      enableLoadMore();
    }

    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    hideLoadMore();
  } finally {
    hideLoader();
  }
});