const axios = require('axios');

// API key from the nutrition_api.ts file
const API_KEY = 'asEMGkqvhvAzj0/qcLoVZg==RO39NiRxjmfd5foR';

async function testApiNinjas() {
  try {
    console.log('Testing API Ninjas connection...');
    const response = await axios.get('https://api.api-ninjas.com/v1/nutrition', {
      params: { query: 'apple' },
      headers: { 'X-Api-Key': API_KEY }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testApiNinjas();