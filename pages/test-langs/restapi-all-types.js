const fetch = require('node-fetch');

// URL of the API endpoint
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

// Example GET request
fetch(apiUrl)
  .then(response => response.json())
  .then(data => console.log('GET request response:', data))
  .catch(error => console.error('Error making GET request:', error));

// Example POST request
const postData = {
  title: 'foo',
  body: 'bar',
  userId: 1
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => console.log('POST request response:', data))
.catch(error => console.error('Error making POST request:', error));

// Example PUT request
const putData = {
  id: 1,
  title: 'foo',
  body: 'bar',
  userId: 1
};

fetch(`${apiUrl}/1`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(putData)
})
.then(response => response.json())
.then(data => console.log('PUT request response:', data))
.catch(error => console.error('Error making PUT request:', error));

// Example DELETE request
fetch(`${apiUrl}/1`, {
  method: 'DELETE'
})
.then(response => {
  if (response.ok) {
    console.log('DELETE request was successful');
  } else {
    console.error('DELETE request failed');
  }
})
.catch(error => console.error('Error making DELETE request:', error));
