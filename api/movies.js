import axios from "axios";

export default async function handler(req, res) {
  const { title, type } = req.query;

  if (!title) {
    res.status(400).json({ error: "Title query parameter is required" });
    return;
  }

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "API key not set" });
    return;
  }

  try {
    let url;
    if (type === "search") {
      // multiple results
      url = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`;
    } else if (type === "id") {
      // single movie by IMDb ID
      url = `https://www.omdbapi.com/?i=${encodeURIComponent(title)}&apikey=${apiKey}`;
    } else {
      // single movie by title
      url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    }

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}
