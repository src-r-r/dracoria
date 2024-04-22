document.addEventListener('DOMContentLoaded', function () {
  const socket = io(); // Assuming Socket.IO is correctly set up in the project

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
      console.log('Failed to update dashboard. Please try again.');
    }
  };

  updateDashboard();
  setInterval(updateDashboard, 30000); // Update every 30 seconds

  socket.on('lavaJuiceUpdate', (data) => {
    // Assuming there's an element with ID 'lavaJuiceBalance' to display the balance
    document.getElementById('lavaJuiceBalance').textContent = `Lava Juice Balance: ${data.newBalance}`;
    console.log('Lava juice balance updated:', data.newBalance);
  });

  socket.on('dragonStatsUpdate', (data) => {
    // Assuming there are elements with IDs 'dragonExperience', 'dragonEnergy', and 'dragonLevel' to display these values
    document.getElementById('dragonExperience').textContent = `Dragon Experience: ${data.newExperiencePoints}`;
    document.getElementById('dragonEnergy').textContent = `Dragon Energy: ${data.newEnergy}`;
    const level = Math.floor(Math.log10(data.newExperiencePoints + 1));
    document.getElementById('dragonLevel').textContent = `Dragon Level: ${level}`;
    console.log('Dragon stats updated:', data);
  });

  socket.on('connect_error', (err) => {
    console.error('WebSocket connection error. Try refreshing the page.', err);
    console.log('WebSocket connection error. Try refreshing the page.');
  });
});