import router from '@adonisjs/core/services/router'
import type { HttpContext } from '@adonisjs/core/http'

export default function configureRoutes() {
  // Test endpoint to verify auth is working
  router.get('/test-auth', async ({ auth, response }: HttpContext) => {
    const user = auth.user
    return response.json({ 
      message: 'Auth test',
      authenticated: !!user,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      session: auth.use('web').sessionId ? 'Session found' : 'No session'
    })
  }).use((ctx) => ctx.auth.isAuthenticated())
  
  // Test login - no session required  
  router.post('/test-login', async ({ auth, request, response }: HttpContext) => {
    const { email, password } = request.body()
    
    try {
      const user = await auth.verify('web', email, password)
      if (user) {
        await auth.use('web').login(user)
        return response.json({ 
          message: 'Login successful',
          user: { id: user.id, email: user.email, role: user.role }
        })
      }
    } catch (error) {
      return response.status(401).json({ message: 'Invalid credentials' })
    }
  })
}

configureRoutes()