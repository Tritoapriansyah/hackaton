import client from '@api-ts/client'

async function debugAuth() {
  try {
    // Create admin user
    await client.post('/api/auth/register').json({
      fullName: 'Admin Test',
      email: 'admin@debug.com',
      password: 'password123',
      phone: '081234567890',
    })
    console.log('Admin user created')
    
    // Login
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'admin@debug.com',
      password: 'password123',
    })
    
    console.log('Login response status:', loginResponse.status())
    console.log('Login response body:', await loginResponse.json())
    
    const cookies = loginResponse.headers()['set-cookie']
    console.log('Set-cookie header:', cookies)
    
    // Make stats request
    const statsResponse = await client
      .get('/api/roles/statistics')
      .header('cookie', cookies?.[0] || '')
    
    console.log('Stats response status:', statsResponse.status())
    console.log('Stats response body:', await statsResponse.json())
    
  } catch (error) {
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response body:', await error.response.json().catch(() => 'No JSON'))
    }
  }
}

debugAuth()