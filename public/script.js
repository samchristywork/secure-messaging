const ws = new WebSocket(`ws://${window.location.host}`);
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const keyButton = document.getElementById('key-button');

var key = prompt('Enter key:');

function hsv(h, s, v) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function randomColor() {
  return hsv(Math.random() * 360, 0.95, 0.95);
}

const myColor = randomColor();

function setKey() {
  key = prompt('Enter key:');
  render();
}

function encryptString(str, secretKey) {
  return CryptoJS.AES.encrypt(str, secretKey).toString();
}

function decryptString(encryptedStr, secretKey) {
  var bytes = CryptoJS.AES.decrypt(encryptedStr, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

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
