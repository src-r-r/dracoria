document.getElementById('harvest-fruit').addEventListener('click', function () {
    fetch('/api/garden/harvest', {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Harvest success:', data);
            document.getElementById('garden-status').innerHTML = `<p><strong>Tree Type:</strong> ${data.garden.treeType}</p>
        <p><strong>Fruit Count:</strong> ${data.garden.fruitCount}</p>
        <p><strong>Last Harvested:</strong> ${new Date(data.garden.lastHarvested).toDateString()}</p>`;
        })
        .catch((error) => {
            console.error('Error harvesting fruit:', error);
            alert('Error harvesting fruit. Please try again.');
        });
});