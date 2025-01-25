import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getPosts } from "./js/pixabay-api";
import { postsTemplate } from "./js/render-functions";

const form = document.querySelector(".search-form");
const postsGallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreButton = document.querySelector(".load-more");

let currentPage = 1;
let searchQuery = "";

hideLoader();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    iziToast.info({
      title: "No data",
      message: "Please enter a search query",
    });
    return;
  }

  postsGallery.innerHTML = "";
  currentPage = 1;
  showLoader();

  try {
    const data = await getPosts(searchQuery, currentPage);

    if (!data.hits.length) {
      iziToast.error({
        title: "No result",
        message: "Sorry, no images matching your search query. Please try again!",
      });
      hideLoader();
      return;
    }

    const markup = postsTemplate(data.hits);
    postsGallery.insertAdjacentHTML("beforeend", markup);
    const lightbox = new SimpleLightbox(".gallery a");
    lightbox.refresh();

    if (data.totalHits > currentPage * 15) {
      loadMoreButton.style.display = "block";
    }

  } catch (error) {
    iziToast.warning({
      title: "Error",
      message: `Something went wrong. ${error.message}`,
    });
  } finally {
    hideLoader();
  }
});

loadMoreButton.addEventListener("click", async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getPosts(searchQuery, currentPage);
    const markup = postsTemplate(data.hits);
    postsGallery.insertAdjacentHTML("beforeend", markup);
    const lightbox = new SimpleLightbox(".gallery a");
    lightbox.refresh();

    if (data.totalHits <= currentPage * 15) {
      loadMoreButton.style.display = "none";
      iziToast.info({
        title: "End of results",
        message: "Sorry, but you've reached the end of search results.",
      });
    }

    window.scrollBy({
      top: window.innerHeight, // Scroll by one page height
      behavior: "smooth",
    });

  } catch (error) {
    iziToast.warning({
      title: "Error",
      message: `Something went wrong. ${error.message}`,
    });
  } finally {
    hideLoader();
  }
});

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}
