"use strict"

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app

  const _jwt = middleware.jwtErr(app.config.jwt.secret)

  router.get("/", controller.home.index)

  router.post("/api/user/register", controller.user.register)
  router.post("/api/user/login", controller.user.login)
  router.get("/api/user/verify", _jwt, controller.user.verify)
  router.get("/api/user/info", _jwt, controller.user.getUserInfo)
  router.post("/api/user/info", _jwt, controller.user.editUserInfo)

  router.post("/api/upload", controller.upload.upload)

  router.post("/api/bill/add", _jwt, controller.bill.add)
  router.get("/api/bill/list", _jwt, controller.bill.list)
  router.get("/api/bill/detail", _jwt, controller.bill.detail)
  router.post("/api/bill/update", _jwt, controller.bill.update)
  router.post("/api/bill/delete", _jwt, controller.bill.delete)
  router.get("/api/bill/data", _jwt, controller.bill.data)
}
