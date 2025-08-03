import axios from 'axios';

const API_KEY = '51566041-17ae6664d6c49a5767f7403ab';
const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: PER_PAGE,
    page,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}