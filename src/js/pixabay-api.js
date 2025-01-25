import axios from "axios";

export async function getPosts(query, page = 1) {
  const API_KEY = "48269176-9eacf4bd75a8a580043143bd0";
  const URL = `https://pixabay.com/api/`;

  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: 15,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Something went wrong: ${error.message}`);
  }
}
