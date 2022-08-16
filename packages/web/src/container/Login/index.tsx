import { Cell, Input, Button, Checkbox, Toast } from "zarm"
import CustomIcon from "@/components/CustomIcon"

import Captcha from "react-captcha-code"

import style from "./style.module.less"
import { useCallback, useState } from "react"
import { post } from "@/utils"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [verify, setVerify] = useState("")

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

    if (!verify) {
      Toast.show("请输入验证码")
      return
    }

    if (verify !== captcha) {
      Toast.show("验证码错误")
      return
    }

    try {
      const { data } = await post("/user/register", {
        username,
        password,
      })
      Toast.show("注册成功")
    } catch (error) {
      Toast.show("系统错误")
    }
  }

  return (
    <div className={style.auth}>
      <div className={style.head} />

      <div className={style.tab}>
        <span>注册</span>
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

        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入验证码"
            onChange={(value?: string) => setVerify(value!)}
          />
          <Captcha charNum={4} onChange={handleChange} />
        </Cell>
      </div>

      <div className={style.operation}>
        <div className={style.agree}>
          <Checkbox />
          <label className="text-light">
            阅读并同意<a>《掘掘手札条款》</a>
          </label>
        </div>

        <Button block theme="primary" onClick={onSubmit}>
          注册
        </Button>
      </div>
    </div>
  )
}

export default Login
