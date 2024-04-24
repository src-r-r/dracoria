function feedDragon() {
    axios.post('/api/dragon/feed')
        .then(function (response) {
            console.log('Juice given successfully', response.data);
            // TODO - Update UI based on response
        })
        .catch(function (error) {
            console.error('Error giving juice:', error.response ? error.response.data : error);
            console.log('Please try giving juice again later.');
        });
}

function updateDragon() {
    fetch('/api/dragon/status')
        .then(response => response.json())
        .then(data => {
            console.log('Dragon stats:', data);
            // TODO - Update UI based on response
            document.getElementById('dragon-status').innerHTML = `<p><strong>Energy:</strong> ${data.energy}</p>
        <p><strong>Experience Points:</strong> ${data.experiencePoints}</p>
        <p><strong>Stage:</strong> ${data.stage}</p>`;

        })
        .catch(function (error) {
            console.error('Error fetching dragon stats:', error.response ? error.response.data : error);
            console.log('Please try fetching dragon stats again later.');
        });
}