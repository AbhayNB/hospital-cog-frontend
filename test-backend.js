// Simple script to test backend connectivity
const API_BASE_URL = 'http://localhost:8080/api';

// Function to test API health
async function testApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.text();
    console.log('Health check status:', response.status);
    console.log('Response:', data);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('Error connecting to API:', error.message);
    return { success: false, error: error.message };
  }
}

// Function to test doctor search
async function testDoctorSearch() {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/search`);
    const data = await response.text();
    console.log('Doctor search status:', response.status);
    console.log('Response:', data);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('Error searching doctors:', error.message);
    return { success: false, error: error.message };
  }
}

// Function to test login
async function testLogin(email = 'patient@example.com', password = 'password') {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.text();
    console.log('Login status:', response.status);
    console.log('Response:', data);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('Error during login:', error.message);
    return { success: false, error: error.message };
  }
}

// Run tests
async function runTests() {
  console.log('=== Testing API Health ===');
  await testApiHealth();
  
  console.log('\n=== Testing Doctor Search ===');
  await testDoctorSearch();
  
  console.log('\n=== Testing Login ===');
  await testLogin();
}

// Execute tests
runTests();