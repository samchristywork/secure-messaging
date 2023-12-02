const ws = new WebSocket(`ws://${window.location.host}`);
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

ws.onmessage = function(event) {
  console.log(event.data);
  const reader = new FileReader();
  reader.onload = function() {
    var message = document.createElement('div');

    const result = JSON.parse(reader.result);
    message.textContent = result.text;

    messageContainer.appendChild(message);
  };
  reader.readAsText(event.data);
};

function send() {
  var message = {};
  message.text = messageInput.value;
  ws.send(JSON.stringify(message));

  messageInput.value = '';
}

sendButton.addEventListener('click', () => {
  send();
});
