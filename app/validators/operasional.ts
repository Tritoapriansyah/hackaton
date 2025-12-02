import vine from '@vinejs/vine'

/**
 * Validator for creating operasional entry
 */
export const operasionalValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255),
    price: vine.number().positive(),
    description: vine.string().maxLength(500).optional(),
    priode: vine.enum(['monthly', 'annual']),
  })
)

/**
 * Validator for updating operasional entry
 */
export const updateOperasionalValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).optional(),
    price: vine.number().positive().optional(),
    description: vine.string().maxLength(500).optional(),
    priode: vine.enum(['monthly', 'annual']).optional(),
  })
)
