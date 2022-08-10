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
}
