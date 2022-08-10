/* eslint valid-jsdoc: "off" */

"use strict"

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1659883750936_744"

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: "app/public/upload",
  }

  config.security = {
    csrf: {
      enable: false,
      ignoreJson: true,
    },
    // 白名单
    domainWhiteList: ["*"],
  }

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: "localhost",
      // 端口
      port: "3306",
      // 用户名
      user: "root",
      // 密码
      password: "123456",
      // 数据库名
      database: "bill",
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }

  config.jwt = {
    secret: "lotwt",
  }

  config.multipart = {
    mode: "file",
  }

  config.cors = {
    origin: "*", // 允许所有跨域访问
    credentials: true, // 允许 cookie 跨域
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  }

  return {
    ...config,
    ...userConfig,
  }
}
