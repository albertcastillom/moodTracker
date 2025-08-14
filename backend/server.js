const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'results.json');

app.use(cors());
app.use(express.json());

// Submit a new rating
app.post('/submit', (req, res) => {
  const rating = req.body.rating;
  if (typeof rating !== 'number' || rating < 1 || rating > 10) {
    return res.status(400).send({ error: 'Invalid rating' });
  }

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  data.push(rating);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.send({ success: true });
});

// Get average rating
app.get('/average', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.send({ average: 0 });

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const average = data.reduce((sum, r) => sum + r, 0) / data.length;
  res.send({ average });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
