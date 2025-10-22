import axios from "axios";

export default async function handler(req, res) {
  const { title, type } = req.query;

  // Check if title parameter is provided
  if (!title) {
    return res.status(400).json({ error: "Title query parameter is required" });
  }

  // Get API key from environment variables
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    console.error("OMDB_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "API key not configured" });
  }

  // Build OMDb URL based on type
  let url;
  if (type === "search") {
    url = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`;
  } else if (type === "id") {
    url = `https://www.omdbapi.com/?i=${encodeURIComponent(title)}&apikey=${apiKey}`;
  } else {
    url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  }

  console.log("Fetching OMDb URL:", url);

  try {
    const response = await axios.get(url);

    // Check OMDb error response
    if (response.data.Response === "False") {
      console.error("OMDb API error:", response.data.Error);
      return res.status(404).json({ error: response.data.Error });
    }

    // Return data
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Axios request failed:", {
      url,
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    res.status(500).json({ error: "Something went wrong while fetching data" });
  }
}
