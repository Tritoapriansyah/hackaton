import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const RoleController = () => import('#controllers/role_controller')
const ProductsController = () => import('#controllers/products_controller')
const TransactionController = () => import('#controllers/transaction_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const LogsController = () => import('#controllers/logs_controller')
const SwaggerController = () => import('#controllers/swagger_controller')
const CashBooksController = () => import('#controllers/cash_books_controller')
const OperasionalsController = () => import('#controllers/operasionals_controller')
const RekapsController = () => import('#controllers/rekaps_controller')
const HppsController = () => import('#controllers/hpps_controller')

/**
 * API Documentation routes
 */
router.get('/api-docs', [SwaggerController, 'serve'])
router.get('/api-docs.json', [SwaggerController, 'spec'])

/**
 * Authentication routes - no middleware
 */
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('api/auth')
  .use(middleware.throttleAuth())

/**
 * Role management routes - auth middleware
 */
router
  .group(() => {
    router.get('/current', [RoleController, 'current']).use(middleware.auth())
    router.get('/statistics', [RoleController, 'statistics']).use([middleware.auth()])
  })
  .prefix('api/ranking')
  .use(middleware.auth())

/**
 * Transaction routes
 */
router
  .group(() => {
    router.get('/my-transactions', [TransactionController, 'myTransactions'])
    router.get('/transaction/:transactionId', [TransactionController, 'show'])
    router.get('/statistics', [TransactionController, 'statistics'])
    router.get('/status/:status', [TransactionController, 'byStatus'])
    router.get('/method-distribution', [TransactionController, 'methodDistribution'])
  })
  .prefix('api/transactions')
  .use(middleware.auth())

/**
 * Product management routes
 */
router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
    router.get('/export', [ProductsController, 'export'])
    router.post('/import', [ProductsController, 'import'])
    router.get('/:id', [ProductsController, 'show'])
    router.get('/:id/logs', [LogsController, 'productLogs'])
    router.get('/:id/stock-history', [LogsController, 'stockHistory'])
    router.post('/', [ProductsController, 'store'])
    router.put('/:id', [ProductsController, 'update'])
    router.patch('/:id/stock', [ProductsController, 'updateStock'])
    router.delete('/:id', [ProductsController, 'destroy'])
  })
  .prefix('api/products')
  .use(middleware.auth())

router.on('/').renderInertia('home')

/**
 * Dashboard routes
 */
router
  .group(() => {
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
  })
  .prefix('api/dashboard')
  .use(middleware.auth())

/**
 * Logs routes
 */
router
  .group(() => {
    router.get('/', [LogsController, 'index'])
    router.get('/recent', [LogsController, 'recent'])
    router.post('/cleanup', [LogsController, 'cleanup'])
  })
  .prefix('api/logs')
  .use(middleware.auth())

/**
 * Cash Book routes (Buku Kas)
 * User can create, read, update, delete their own entries
 * Admin can do everything
 */
router
  .group(() => {
    router.get('/', [CashBooksController, 'index'])
    router.get('/statistics', [CashBooksController, 'statistics'])
    router.get('/:id', [CashBooksController, 'show'])
    router.post('/', [CashBooksController, 'store'])
    router.put('/:id', [CashBooksController, 'update'])
    router.delete('/:id', [CashBooksController, 'destroy'])
  })
  .prefix('api/cash-books')
  .use(middleware.auth())

/**
 * Operasional routes (Biaya Operasional)
 * Admin can manage, User can view
 */
router
  .group(() => {
    router.get('/', [OperasionalsController, 'index'])
    router.get('/statistics', [OperasionalsController, 'statistics'])
    router.get('/:id', [OperasionalsController, 'show'])
    router.post('/', [OperasionalsController, 'store'])
    router.put('/:id', [OperasionalsController, 'update'])
    router.delete('/:id', [OperasionalsController, 'destroy'])
  })
  .prefix('api/operasional')
  .use(middleware.auth())

/**
 * Rekap routes (Summary/Report)
 */
router
  .group(() => {
    router.get('/', [RekapsController, 'index'])
    router.get('/penjualan', [RekapsController, 'penjualan'])
    router.get('/produk', [RekapsController, 'produk'])
    router.get('/operasional', [RekapsController, 'operasional'])
    router.get('/keuangan', [RekapsController, 'keuangan'])
  })
  .prefix('api/rekap')
  .use(middleware.auth())

/**
 * HPP routes (Harga Pokok Penjualan)
 */
router
  .group(() => {
    router.get('/calculate', [HppsController, 'calculate'])
    router.get('/product/:productId', [HppsController, 'byProduct'])
  })
  .prefix('api/hpp')
  .use(middleware.auth())
