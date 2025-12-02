import vine from '@vinejs/vine'

/**
 * Validator for creating cash book entry
 */
export const cashBookValidator = vine.compile(
  vine.object({
    type: vine.enum(['masuk', 'keluar']),
    amount: vine.number().positive(),
    description: vine.string().maxLength(500).optional(),
    category: vine.string().maxLength(100).optional(),
    referenceNumber: vine.string().maxLength(100).optional(),
    transactionDate: vine.date(),
  })
)

/**
 * Validator for updating cash book entry
 */
export const updateCashBookValidator = vine.compile(
  vine.object({
    type: vine.enum(['masuk', 'keluar']).optional(),
    amount: vine.number().positive().optional(),
    description: vine.string().maxLength(500).optional(),
    category: vine.string().maxLength(100).optional(),
    referenceNumber: vine.string().maxLength(100).optional(),
    transactionDate: vine.date().optional(),
  })
)
