import axios from "axios";

export default async function handler(req, res) {
  const { title, type } = req.query;

  if (!title) {
    res.status(400).json({ error: "Title query parameter is required" });
    return;
  }

  // Make sure API key exists
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "API key not set" });
    return;
  }

  try {
    const param = type === "search" ? "s" : "t";
    const response = await axios.get(
      `https://www.omdbapi.com/?${param}=${encodeURIComponent(title)}&apikey=${apiKey}`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err); // logs will appear in Vercel dashboard
    res.status(500).json({ error: "Something went wrong" });
  }
}
