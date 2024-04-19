const express = require('express');
const router = express.Router();

// Assuming there's a controller or service layer handling the logic,
// which is a common practice for maintaining clean code architecture.
const { getIndexPage } = require('../controllers/indexController');

router.get('/', async (req, res) => {
  try {
    // Render the index page which should include the header partial with the dark mode toggle
    // The getIndexPage function is assumed to handle the logic for fetching any necessary data
    // to render the index page, including the state of the dark mode toggle if applicable.
    const pageData = await getIndexPage(); // This function should be implemented in the specified controller
    res.render('index', pageData);
  } catch (error) {
    console.error('Error rendering the index page:', error.message, error.stack);
    res.status(500).send('An error occurred while loading the page.');
  }
});

module.exports = router;