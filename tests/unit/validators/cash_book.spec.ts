import { test } from '@japa/runner'
import { cashBookValidator, updateCashBookValidator } from '#validators/cash_book'

test.group('Cash Book Validator | Unit', () => {
  test('should validate cash book creation', async ({ assert }) => {
    const payload = {
      type: 'masuk',
      amount: 100000,
      description: 'Test description',
      transactionDate: new Date(),
    }

    const result = await cashBookValidator.validate(payload)

    assert.equal(result.type, 'masuk')
    assert.equal(result.amount, 100000)
  })

  test('should reject invalid type', async ({ assert }) => {
    const payload = {
      type: 'invalid',
      amount: 100000,
      transactionDate: new Date(),
    }

    await assert.rejects(() => cashBookValidator.validate(payload), 'Invalid enum value')
  })

  test('should reject negative amount', async ({ assert }) => {
    const payload = {
      type: 'masuk',
      amount: -1000,
      transactionDate: new Date(),
    }

    await assert.rejects(() => cashBookValidator.validate(payload), 'The number must be positive')
  })

  test('should validate update cash book', async ({ assert }) => {
    const payload = {
      amount: 200000,
    }

    const result = await updateCashBookValidator.validate(payload)

    assert.equal(result.amount, 200000)
  })
})
