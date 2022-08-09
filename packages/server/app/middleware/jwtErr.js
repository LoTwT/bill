module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token =
      ctx.request.header.authorization ?? ctx.request.header.Authorization

    let decode

    if (token != "null" && token) {
      try {
        // 验证 token
        decode = ctx.app.jwt.verify(token, secret)
        await next()
      } catch (error) {
        console.log("jwt error => ", error)
        ctx.status = 200
        ctx.body = {
          code: 401,
          msg: "token 已过期，请重新登录",
          data: null,
        }

        return
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: 401,
        msg: "token 不存在",
        data: null,
      }

      return
    }
  }
}
