const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { open } = require('sqlite');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;

// Initialize the database connection
(async () => {
  try {
    db = await open({
      filename: './BD4_Assignment1/database.sqlite',
      driver: sqlite3.Database,
    });
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
})();

// Utility function for error handling
const handleError = (res, err) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
};

// Fetch all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const query = 'SELECT * FROM restaurants';
    const results = await db.all(query);
    res.status(200).json({ restaurants: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch a specific restaurant by ID
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM restaurants WHERE id = ?';
    const result = await db.get(query, [id]);
    if (result) {
      res.status(200).json({ restaurant: result });
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch restaurants by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const { cuisine } = req.params;
    const query = 'SELECT * FROM restaurants WHERE cuisine = ?';
    const results = await db.all(query, [cuisine]);
    res.status(200).json({ restaurants: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch restaurants by filters
app.get('/restaurants/filter', async (req, res) => {
  try {
    const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
    let conditions = [];
    let values = [];

    if (isVeg) {
      conditions.push('isVeg = ?');
      values.push(isVeg);
    }
    if (hasOutdoorSeating) {
      conditions.push('hasOutdoorSeating = ?');
      values.push(hasOutdoorSeating);
    }
    if (isLuxury) {
      conditions.push('isLuxury = ?');
      values.push(isLuxury);
    }

    const query = `SELECT * FROM restaurants${
      conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''
    }`;
    const results = await db.all(query, values);
    res.status(200).json({ restaurants: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch restaurants sorted by rating
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const query = 'SELECT * FROM restaurants ORDER BY rating DESC';
    const results = await db.all(query);
    res.status(200).json({ restaurants: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch all dishes
app.get('/dishes', async (req, res) => {
  try {
    const query = 'SELECT * FROM dishes';
    const results = await db.all(query);
    res.status(200).json({ dishes: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch a specific dish by ID
app.get('/dishes/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM dishes WHERE id = ?';
    const result = await db.get(query, [id]);
    if (result) {
      res.status(200).json({ dish: result });
    } else {
      res.status(404).json({ error: 'Dish not found' });
    }
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch dishes by filters (e.g., veg/non-veg)
app.get('/dishes/filter', async (req, res) => {
  try {
    const { isVeg } = req.query;
    const query = 'SELECT * FROM dishes WHERE isVeg = ?';
    const results = await db.all(query, [isVeg]);
    res.status(200).json({ dishes: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Fetch dishes sorted by price
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const query = 'SELECT * FROM dishes ORDER BY price ASC';
    const results = await db.all(query);
    res.status(200).json({ dishes: results });
  } catch (err) {
    handleError(res, err);
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
