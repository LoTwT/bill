import { Cell, Input, Button, Checkbox, Toast } from "zarm"
import CustomIcon from "@/components/CustomIcon"
import { useCallback, useState } from "react"
import { post } from "@/utils"
import Captcha from "react-captcha-code"

import cx from "classnames"
import style from "./style.module.less"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [verify, setVerify] = useState("")

  // 登录注册类型
  const [type, setType] = useState("login")

  // 验证码变化后的值
  const [captcha, setCaptcha] = useState("")

  const handleChange = useCallback((captcha: string) => {
    console.log("captcha", captcha)
    setCaptcha(captcha)
  }, [])

  const onSubmit = async () => {
    if (!username) {
      Toast.show("请输入账号")
      return
    }

    if (!password) {
      Toast.show("请输入密码")
      return
    }

    try {
      // 判断是否是登录状态
      if (type === "login") {
        // 登录接口，获取 token
        const { data } = await post("/api/user/login", {
          username,
          password,
        })
        // token 写入 localStorage
        localStorage.setItem("token", data.token)
      } else {
        if (!verify) {
          Toast.show("请输入验证码")
          return
        }

        if (verify !== captcha) {
          Toast.show("验证码错误")
          return
        }

        const { data } = await post("/api/user/register", {
          username,
          password,
        })
        Toast.show("注册成功")

        // 注册成功，将 tab 切换到 login 状态
        setType("login")
      }
    } catch (error) {
      Toast.show("系统错误")
    }
  }

  return (
    <div className={style.auth}>
      <div className={style.head} />

      <div className={style.tab}>
        <span
          className={cx({ [style.active]: type === "login" })}
          onClick={() => setType("login")}
        >
          登录
        </span>
        <span
          className={cx({ [style.active]: type === "register" })}
          onClick={() => setType("register")}
        >
          注册
        </span>
      </div>

      <div className={style.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value?: string) => setUsername(value!)}
          />
        </Cell>

        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value?: string) => setPassword(value!)}
          />
        </Cell>

        {type === "register" ? (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value?: string) => setVerify(value!)}
            />
            <Captcha charNum={4} onChange={handleChange} />
          </Cell>
        ) : null}
      </div>

      <div className={style.operation}>
        {type === "register" ? (
          <div className={style.agree}>
            <Checkbox />
            <label className="text-light">
              阅读并同意<a>《掘掘手札条款》</a>
            </label>
          </div>
        ) : null}

        <Button block theme="primary" onClick={onSubmit}>
          {type === "login" ? "登录" : "注册"}
        </Button>
      </div>
    </div>
  )
}

export default Login
