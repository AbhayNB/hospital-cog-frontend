// Simple script to test login and get a token
const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_URL = `${API_BASE_URL}/auth/authenticate`;

// Function to test login with different credentials
async function testLogin(email, password) {
  try {
    console.log(`Attempting login with: ${email} / ${password}`);
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.text();
    console.log('Login status:', response.status);
    console.log('Response:', data);
    
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      if (jsonData.accessToken) {
        console.log('Token received:', jsonData.accessToken);
        return jsonData.accessToken;
      }
    } catch (e) {
      console.log('Response is not valid JSON');
    }
    
    return null;
  } catch (error) {
    console.error('Error during login:', error.message);
    return null;
  }
}

// Try different common credentials
async function tryCommonCredentials() {
  const credentials = [
    { email: 'patient@example.com', password: 'password' },
    { email: 'admin@example.com', password: 'password' },
    { email: 'doctor@example.com', password: 'password' },
    { email: 'user@example.com', password: 'password' },
    { email: 'test@example.com', password: 'password' },
    { email: 'admin', password: 'admin' },
    { email: 'user', password: 'user' },
    { email: 'admin@healthcare.com', password: 'admin' },
    { email: 'patient@healthcare.com', password: 'patient' },
    { email: 'doctor@healthcare.com', password: 'doctor' }
  ];
  
  for (const cred of credentials) {
    console.log('\n=== Testing Login ===');
    const token = await testLogin(cred.email, cred.password);
    
    if (token) {
      console.log('\n=== SUCCESS: Found working credentials ===');
      console.log(`Email: ${cred.email}`);
      console.log(`Password: ${cred.password}`);
      console.log(`Token: ${token}`);
      return token;
    }
  }
  
  console.log('\n=== FAILED: No working credentials found ===');
  return null;
}

// Execute tests
tryCommonCredentials();