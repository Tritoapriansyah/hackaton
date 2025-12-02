import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const RoleController = () => import('#controllers/role_controller')
const ProductsController = () => import('#controllers/products_controller')
const TransactionController = () => import('#controllers/transaction_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

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
}).prefix('api/ranking').use(middleware.auth())

/**
 * Transaction routes
 */
router.group(() => {
  router.get('/my-transactions', [TransactionController, 'myTransactions'])
  router.get('/transaction/:transactionId', [TransactionController, 'show'])
  router.get('/statistics', [TransactionController, 'statistics'])
  router.get('/status/:status', [TransactionController, 'byStatus'])
  router.get('/method-distribution', [TransactionController, 'methodDistribution'])
}).prefix('api/transactions').use(middleware.auth())

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

router.on('/').renderInertia('home')

/**
 * Dashboard routes
 */
router.group(() => {
  router.get('/overview', [DashboardController, 'overview'])
  router.get('/stats', [DashboardController, 'stats'])
  router.get('/stock-distribution', [DashboardController, 'stockDistribution'])
  router.get('/revenue-timeseries', [DashboardController, 'revenueTimeSeries'])
  router.get('/transaction-timeseries', [DashboardController, 'transactionTimeSeries'])
  router.get('/transaction-status', [DashboardController, 'transactionStatus'])
  router.get('/payment-methods', [DashboardController, 'paymentMethods'])
  router.get('/top-selling-products', [DashboardController, 'topSellingProducts'])
  router.get('/revenue-by-product', [DashboardController, 'revenueByProduct'])
  router.get('/top-products', [DashboardController, 'topProducts'])
  router.get('/role-distribution', [DashboardController, 'roleDistribution'])
  router.get('/low-stock-alerts', [DashboardController, 'lowStockAlerts'])
}).prefix('api/dashboard').use(middleware.auth())