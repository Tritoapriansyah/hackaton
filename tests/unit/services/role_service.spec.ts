import { test } from '@japa/runner'
import { RoleService } from '#services/role_service'
import User from '#models/user'

test.group('Role Service | Unit', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should check user role', async ({ assert }) => {
    const service = new RoleService()
    const user = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    })

    assert.isTrue(service.hasRole(user, 'admin'))
    assert.isFalse(service.hasRole(user, 'user'))
  })

  test('should check if user has any of specified roles', async ({ assert }) => {
    const service = new RoleService()
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    assert.isTrue(service.hasAnyRole(user, ['user', 'admin']))
    assert.isFalse(service.hasAnyRole(user, ['admin']))
  })

  test('should update user role', async ({ assert }) => {
    const service = new RoleService()
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    const updated = await service.updateRole(user.id, 'admin')

    assert.equal(updated.role, 'admin')
  })

  test('should get count by role', async ({ assert }) => {
    const service = new RoleService()

    await User.createMany([
      { email: 'admin1@example.com', password: 'pass', role: 'admin' },
      { email: 'admin2@example.com', password: 'pass', role: 'admin' },
      { email: 'user1@example.com', password: 'pass', role: 'user' },
      { email: 'user2@example.com', password: 'pass', role: 'user' },
      { email: 'user3@example.com', password: 'pass', role: 'user' },
    ])

    const stats = await service.getCountByRole()

    assert.equal(stats.admin, 2)
    assert.equal(stats.user, 3)
  })
})
