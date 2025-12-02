import vine from '@vinejs/vine'

export const productValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(100),
    price: vine.number().min(0),
    description: vine.string().minLength(10).maxLength(1000).optional(),
    stock: vine.number().min(0),
    image: vine.string().url().optional(),
  })
)
