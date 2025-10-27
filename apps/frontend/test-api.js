const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('https://portfolio-cms-mocha-ten.vercel.app/api/projects?where[slug][equals]=leo&depth=2');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
