const socket = io();

document.addEventListener('DOMContentLoaded', function() {
  const updateStatus = async () => {
    try {
      const dragonResponse = await axios.get('/api/dragon/status');
      if (dragonResponse.data) {
        document.getElementById('dragonStatus').innerHTML = `
          <h3>Dragon</h3>
          <p>Stage: ${dragonResponse.data.stage}</p>
          <p>Hunger: ${dragonResponse.data.hunger}</p>
          <p>Happiness: ${dragonResponse.data.happiness}</p>
        `;
      } else {
        console.log('Dragon data not found for the user.');
        document.getElementById('dragonStatus').innerHTML = `
          <h3>Dragon</h3>
          <p>Your dragon is waiting to be discovered!</p>
        `;
      }

      const gardenResponse = await axios.get('/api/garden/status');
      if (gardenResponse.data) {
        document.getElementById('gardenStatus').innerHTML = `
          <h3>Garden</h3>
          <p>Tree Type: ${gardenResponse.data.treeType}</p>
          <p>Fruit Count: ${gardenResponse.data.fruitCount}</p>
        `;
      } else {
        console.log('Garden data not found for the user.');
        document.getElementById('gardenStatus').innerHTML = `
          <h3>Garden</h3>
          <p>Start planting your garden to see it grow!</p>
        `;
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      alert('Failed to fetch status. Please try again.');
    }
  };

  updateStatus();
});

socket.on('dragonUpdate', (data) => {
  console.log('Dragon update received', data);
  // Update dragon state on the web page
  document.getElementById('dragonHunger').textContent = `Hunger: ${data.hunger}`;
  document.getElementById('dragonHappiness').textContent = `Happiness: ${data.happiness}`;
});

socket.on('gardenUpdate', (data) => {
  console.log('Garden update received', data);
  // Update garden state on the web page
  document.getElementById('fruitCount').textContent = `Fruit Count: ${data.fruitCount}`;
});

socket.on('connect_error', (err) => {
  // Handle connection error
  console.error('WebSocket connection error. Try refreshing the page.', err);
  alert('WebSocket connection error. Try refreshing the page.');
});