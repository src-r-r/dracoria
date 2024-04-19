document.getElementById('send-chat').addEventListener('click', function() {
    const input = document.getElementById('dragon-chat-input');
    const message = input.value;
    // Assuming AJAX setup is in place to send messages
    // Replace YOUR_ENDPOINT_URL with your actual endpoint URL
    fetch('/api/dragon/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: message}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        input.value = ''; // Clear input after sending
    })
    .catch((error) => {
        console.error('Error sending chat message:', error);
        console.error('Error details:', error.message);
    });
});