import vine from '@vinejs/vine'

export const roleUpdateValidator = vine.compile(
  vine.object({
    role: vine.enum(['admin', 'user']).strip(),
  })
)
