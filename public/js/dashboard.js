document.addEventListener('DOMContentLoaded', function() {
  const updateDashboard = async () => {
    try {
      const dragonResponse = await axios.get('/api/dragon/status');
      document.getElementById('dragonStatus').innerHTML = `
        <h3>Dragon</h3>
        <p>Stage: ${dragonResponse.data.stage}</p>
        <p>Hunger: ${dragonResponse.data.hunger}</p>
        <p>Happiness: ${dragonResponse.data.happiness}</p>
      `;

      const gardenResponse = await axios.get('/api/garden/status');
      document.getElementById('gardenStatus').innerHTML = `
        <h3>Garden</h3>
        <p>Tree Type: ${gardenResponse.data.treeType}</p>
        <p>Fruit Count: ${gardenResponse.data.fruitCount}</p>
      `;
    } catch (error) {
      console.error('Error updating dashboard:', error);
      alert('Failed to update dashboard. Please try again.');
    }
  };

  updateDashboard();
  setInterval(updateDashboard, 30000); // Update every 30 seconds
});