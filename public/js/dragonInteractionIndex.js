document.addEventListener('DOMContentLoaded', function () {
  const sendMessageButton = document.getElementById('send-message');
  const messageInput = document.getElementById('message-input');
  const conversationHistory = document.getElementById('conversation-history');
  const dragonIdElement = document.getElementById('dragonId'); // {Add an element with id="dragonId" in your HTML that contains the dragon's ID}

  // Function to send a message to the dragon
  const sendMessage = async () => {
    const message = messageInput.value.trim();
    const dragonId = dragonIdElement ? dragonIdElement.value : null; // Ensure dragonId is fetched from the page
    if (message && dragonId) {
      try {
        const response = await axios.post('/api/dragon/chat', { message, dragonId });
        const { reply } = response.data;
        addToConversation('You', message);
        addToConversation('Dragon', reply);
        messageInput.value = ''; // Clear the input after sending
      } catch (error) {
        console.error('Error sending message to dragon:', error);
        alert('Failed to send message. Please try again.');
      }
    } else {
      alert('Dragon ID is missing or message is empty.');
    }
  };

  // Function to add messages to the conversation history
  const addToConversation = (sender, message) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    conversationHistory.appendChild(messageElement);
    conversationHistory.scrollTop = conversationHistory.scrollHeight; // Scroll to the bottom
  };

  // Fetch and display the historical conversation
  const fetchConversationHistory = async () => {
    const dragonId = dragonIdElement ? dragonIdElement.value : null; // Ensure dragonId is fetched from the page
    if (dragonId) {
      try {
        const response = await axios.get(`/api/dragon/conversation?dragonId=${dragonId}`);
        const { conversation } = response.data;
        conversation.forEach(({ sender, text }) => {
          addToConversation(sender, text);
        });
      } catch (error) {
        console.error('Error fetching conversation history:', error);
        alert('Failed to fetch conversation history. Please try again.');
      }
    } else {
      alert('Dragon ID is missing.');
    }
  };

  sendMessageButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  fetchConversationHistory();
});