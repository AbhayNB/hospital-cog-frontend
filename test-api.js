// Simple script to test API connection using browser fetch

const API_URL = 'http://localhost:8080/api';

async function testApiConnection() {
  try {
    console.log('Testing API connection to:', API_URL);
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API connection successful!');
      console.log('Response:', data);
      return true;
    } else {
      console.error('API connection failed with status:', response.status);
      console.error('Response text:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('API connection error:', error.message);
    return false;
  }
}

// Test doctors search endpoint
async function testDoctorsSearch() {
  try {
    console.log('\nTesting doctors search endpoint');
    const response = await fetch(`${API_URL}/doctors/search`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Doctors search successful!');
      console.log('Found', Array.isArray(data) ? data.length : 0, 'doctors');
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('Doctors search failed with status:', response.status);
      console.error('Response text:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Doctors search error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const apiConnected = await testApiConnection();
  if (apiConnected) {
    await testDoctorsSearch();
  }
}

// Execute tests when the script is loaded
runTests();