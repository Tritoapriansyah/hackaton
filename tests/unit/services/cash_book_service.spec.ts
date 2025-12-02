import { test } from '@japa/runner'
import { CashBookService } from '#services/cash_book_service'
import CashBook from '#models/cash_book'
import User from '#models/user'
import { DateTime } from 'luxon'

test.group('Cash Book Service | Unit', (group) => {
  group.each.setup(async () => {
    await CashBook.query().delete()
    await User.query().delete()
  })

  test('should create cash book entry', async ({ assert }) => {
    const service = new CashBookService()
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
    })

    const entry = await service.create(user.id, {
      type: 'masuk',
      amount: 100000,
      description: 'Test entry',
      transactionDate: DateTime.now().toJSDate(),
    })

    assert.exists(entry.id)
    assert.equal(entry.type, 'masuk')
    assert.equal(entry.amount, 100000)
    assert.equal(entry.userId, user.id)
  })

  test('should get user cash books with filters', async ({ assert }) => {
    const service = new CashBookService()
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
    })

    await service.create(user.id, {
      type: 'masuk',
      amount: 100000,
      transactionDate: DateTime.now().toJSDate(),
    })

    await service.create(user.id, {
      type: 'keluar',
      amount: 50000,
      transactionDate: DateTime.now().toJSDate(),
    })

    const result = await service.getUserCashBooks(user.id, 1, 10, { type: 'masuk' })

    assert.equal(result.data.length, 1)
    assert.equal(result.data[0].type, 'masuk')
  })

  test('should calculate user statistics', async ({ assert }) => {
    const service = new CashBookService()
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
    })

    await service.create(user.id, {
      type: 'masuk',
      amount: 100000,
      transactionDate: DateTime.now().toJSDate(),
    })

    await service.create(user.id, {
      type: 'keluar',
      amount: 30000,
      transactionDate: DateTime.now().toJSDate(),
    })

    const stats = await service.getUserStatistics(user.id)

    assert.equal(stats.totalMasuk, 100000)
    assert.equal(stats.totalKeluar, 30000)
    assert.equal(stats.balance, 70000)
    assert.equal(stats.totalEntries, 2)
  })
})
