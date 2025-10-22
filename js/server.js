require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // allow cross-origin requests if frontend is separate
const app = express();

app.use(cors());

app.get('/api/movies', async (req, res) => {
  const { title, type } = req.query; // get title and type from query

  if (!title) {
    return res.status(400).json({ error: "Title query parameter is required" });
  }

  try {
    // decide which parameter to use: t= or s=
    const param = type === 'search' ? 's' : 't';
    const response = await axios.get(
      `https://www.omdbapi.com/?${param}=${encodeURIComponent(title)}&apikey=${process.env.OMDB_API_KEY}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

