import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { registerValidator, loginValidator } from '#validators/user'

@inject()
export default class AuthController {
    constructor(protected authService: AuthService) { }

    async register({ request, response, auth }: HttpContext) {
        const payload = await request.validateUsing(registerValidator)
        console.log('Payload validated:', payload)
        const user = await this.authService.register(payload)
        await auth.use('web').login(user)
        return response.created({
            message: 'User created successfully',
            user,
        })
    }

    async login({ request, response, auth }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator)
        const user = await this.authService.login(email, password)
        await auth.use('web').login(user)
        return response.ok({
            message: 'Login successful',
            user,
        })
    }
}