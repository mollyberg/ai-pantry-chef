import fs from 'fs';

const imageBase64 = fs.readFileSync('/tmp/image2_base64.txt', 'utf8');

const response = await fetch('http://localhost:3001/ai/detect-ingredients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: imageBase64,
    mediaType: 'image/jpeg'
  })
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));