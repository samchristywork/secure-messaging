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

var messages = [];

function render() {
  messageContainer.innerHTML = '';

  for (let m of messages) {
    const result = JSON.parse(m);

    var message = document.createElement('div');

    var bracket = document.createElement('span');
    bracket.textContent = '> ';

    var text = document.createElement('span');

    text.style.color = result.color;
    text.textContent = decryptString(result.text, key);

    var date = document.createElement('div');
    date.style.color = '#888';
    date.style.fontSize = '0.8em';
    date.style.marginLeft = '0.5em';
    date.style.marginRight = '0.5em';
    date.style.fontFamily = 'monospace';
    date.style.fontWeight = 'bold';
    date.style.verticalAlign = 'middle';
    date.style.display = 'inline-block';
    date.textContent = result.time;

    message.appendChild(bracket);
    message.appendChild(text);

    messageContainer.appendChild(message);
    messageContainer.appendChild(date);
  }
}

ws.onmessage = function(event) {
  const reader = new FileReader();
  reader.onload = function() {
    messages.push(reader.result);
    render();
  };
  reader.readAsText(event.data);
};

function send() {
  var message = {};
  message.text = encryptString(messageInput.value, key);
  console.log(message.text);
  message.color = myColor;
  message.time = new Date().toLocaleTimeString();
  ws.send(JSON.stringify(message));

  messageInput.value = '';
}

sendButton.addEventListener('click', () => {
  send();
});

window.onload = () => {
  messageInput.focus();
};
