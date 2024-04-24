function harvestFruit() {
    fetch('/api/garden/pick-fruit', {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Harvest success:', data);
            document.getElementById('garden-status').innerHTML = `<p><strong>Tree Type:</strong> ${data.treeType}</p>
        <p><strong>Fruit Count:</strong> ${data.fruitCount}</p>
        <p><strong>Last Harvested:</strong> ${new Date(data.lastHarvested).toDateString()}</p>`;
        })
        .catch((error) => {
            console.error('Error harvesting fruit:', error);
            alert('Error harvesting fruit. Please try again.');
        });
};

function updateGarden() {
    fetch('/api/garden/status')
        .then(response => response.json())
        .then(data => {
            console.log('Garden data:', data);
            document.getElementById('garden-status').innerHTML = `<p><strong>Tree Type:</strong> Lava</p>
        <p><strong>Fruit Count:</strong> ${data.fruitCount}</p>
        <p><strong>Last Harvested:</strong> ${new Date(data.lastHarvested).toDateString()}</p>`;
        })
        .catch((error) => {
            console.error('Error fetching garden data:', error);
            alert('Error fetching garden data. Please try again.');
        });
}