import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        fullName: vine.string().maxLength(100), // Optional but validated
        email: vine.string().email(),
        password: vine.string().minLength(8),
        phone: vine.string().mobile({ strict: true }).optional(), // Make phone optional
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string(),
    })
)

