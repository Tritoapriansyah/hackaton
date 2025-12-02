import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const RoleController = () => import('#controllers/role_controller')
const ProductsController = () => import('#controllers/products_controller')

router.on('/').renderInertia('home')

/**
 * Authentication routes - no middleware
 */
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
}).prefix('api/auth').use(middleware.throttleAuth())

/**
 * Role management routes - auth middleware
 */
router.group(() => {
  router.get('/current', [RoleController, 'current']).use(middleware.auth())
  router.get('/statistics', [RoleController, 'statistics']).use([middleware.auth()])
}).prefix('api/roles')

/**
 * Product management routes
 */
router.group(() => {
  router.get('/', [ProductsController, 'index'])
  router.get('/export', [ProductsController, 'export'])
  router.post('/import', [ProductsController, 'import'])
  router.get('/:id', [ProductsController, 'show'])
  router.post('/', [ProductsController, 'store'])
  router.put('/:id', [ProductsController, 'update'])
  router.patch('/:id/stock', [ProductsController, 'updateStock'])
  router.delete('/:id', [ProductsController, 'destroy'])
}).prefix('api/products').use(middleware.auth())