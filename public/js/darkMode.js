document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) {
    console.error('Dark mode toggle not found. Ensure the toggle is correctly implemented in the HTML.');
    return;
  }
  const userPrefersDark = localStorage.getItem('darkMode') === 'true';
  
  const applyMode = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
      console.log('Dark mode enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
      console.log('Dark mode disabled');
    }
  };

  // Initialize the toggle state and apply mode accordingly
  darkModeToggle.checked = userPrefersDark;
  applyMode(userPrefersDark);

  // Event listener for change on toggle
  darkModeToggle.addEventListener('change', function() {
    try {
      applyMode(this.checked);
    } catch (error) {
      console.error('Error applying dark mode:', error.message, error.stack);
    }
  });
});