const socket = io();

document.addEventListener('DOMContentLoaded', function () {
  const updateStatus = async () => {
    try {

      updateGarden();
      updateDragon();
      updateUser();

    } catch (error) {
      console.error('Error fetching status:', error);
      //alert('Failed to fetch status. Please try again.');
    }
  };

  updateStatus();
});

function updateUser() {
  fetch('/api/user/status')
    .then(response => response.json())
    .then(data => {
      console.log('User data:', data);
      document.getElementById('lavaJuiceCount').textContent = `Lava Juice: ${data.lavaJuice}`;
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      //alert('Error fetching user data. Please try again.');
    });
}

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
  //alert('WebSocket connection error. Try refreshing the page.');
});