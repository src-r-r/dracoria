document.addEventListener('DOMContentLoaded', function() {
    const pickFruitBtn = document.getElementById('pickFruitBtn');
    const giveJuiceBtn = document.getElementById('giveJuiceBtn');
    const fruitCountDisplay = document.getElementById('fruitCount');
    const lavaJuiceBalanceDisplay = document.getElementById('lavaJuiceBalance');
    const dragonExperienceDisplay = document.getElementById('dragonExperience');
    const dragonEnergyDisplay = document.getElementById('dragonEnergy');

    if (pickFruitBtn) {
        pickFruitBtn.addEventListener('click', function() {
            axios.post('/api/garden/pick-fruit')
                .then(function(response) {
                    console.log('Fruit picked successfully', response.data);
                    // Update UI based on response
                    if (fruitCountDisplay) {
                        fruitCountDisplay.textContent = `Fruit Count: ${response.data.fruitCount}`;
                    }
                    if (lavaJuiceBalanceDisplay) {
                        lavaJuiceBalanceDisplay.textContent = `Lava Juice Balance: ${response.data.lavaJuiceBalance}`;
                    }
                })
                .catch(function(error) {
                    console.error('Error picking fruit:', error.response ? error.response.data : error);
                    console.log('Please try picking fruit again later.');
                });
        });
    }

    if (giveJuiceBtn) {
        giveJuiceBtn.addEventListener('click', function() {
            axios.post('/api/dragon/give-juice')
                .then(function(response) {
                    console.log('Juice given successfully', response.data);
                    // Update UI based on response
                    if (dragonExperienceDisplay) {
                        dragonExperienceDisplay.textContent = `Dragon Experience: ${response.data.experience}`;
                    }
                    if (dragonEnergyDisplay) {
                        dragonEnergyDisplay.textContent = `Dragon Energy: ${response.data.energy}`;
                    }
                })
                .catch(function(error) {
                    console.error('Error giving juice:', error.response ? error.response.data : error);
                    console.log('Please try giving juice again later.');
                });
        });
    }
});