const router = require('koa-router')()

//判断是否登录
async function isLoginUser(ctx, next) {
  if (!ctx.session.user) {
    ctx.flash = {warning: '未登录, 请先登录'}
    return ctx.redirect('/signin')
  }
  await next()
}

//判断是否有权限登录
async function isAdmin(ctx, next) {
  if (!ctx.session.user) {
    ctx.flash = {warning: '未登录, 请先登录'}
  }
  if (!ctx.session.user.isAdmin) {
    ctx.flash = {warning: '没有权限'}
  }
  await next()
}


module.exports = (app) => {
  // router.get('/', require('./posts').index)
  router.get('/', require('./home').index)
  // router.get('/about', require('./about').index)

  router.get('/signup', require('./user').signup)
  router.post('/signup', require('./user').signup)
  router.get('/signin', require('./user').signin)
  router.post('/signin', require('./user').signin)
  router.get('/signout', isLoginUser, require('./user').signout)
  router.get('/posts/create', isLoginUser, require('./posts').create)
  router.post('/posts/create', isLoginUser, require('./posts').create)
  router.get('/posts', require('./posts').index)
  router.get('/posts/:id', require('./posts').show)
  router.get('/posts/:id/edit', isLoginUser, require('./posts').edit)
  router.post('/posts/:id/edit', isLoginUser, require('./posts').edit)
  router.get('/posts/:id/delete', isLoginUser, require('./posts').delete)

  router.post('/comments/create', isLoginUser, require('./comments').create)
  router.get('/comments/:id/delete', isLoginUser, require('./comments').delete)

  router.get('/category', isAdmin, require('./category').list)
  router.get('/category/create', require('./category').create)
  router.post('/category/create', require('./category').create)
  router.get('/category/:id/delete', isAdmin, require('./category').delete)

  app
    .use(router.routes())
    .use(router.allowedMethods())

  // 404
  app.use(async (ctx, next) => {
    await ctx.render('404', {
      title: 'page not find'
    })
  })
}
