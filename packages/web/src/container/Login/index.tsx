import { Cell, Input, Button, Checkbox } from "zarm"
import CustomIcon from "@/components/CustomIcon"

import style from "./style.module.less"

function Login() {
  return (
    <div className={style.auth}>
      <div className={style.head} />

      <div className={style.tab}>
        <span>注册</span>
      </div>

      <div className={style.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input clearable type="text" placeholder="请输入账号" />
        </Cell>

        <Cell icon={<CustomIcon type="mima" />}>
          <Input clearable type="password" placeholder="请输入密码" />
        </Cell>

        <Cell icon={<CustomIcon type="mima" />}>
          <Input clearable type="text" placeholder="请输入验证码" />
        </Cell>
      </div>

      <div className={style.operation}>
        <div className={style.agree}>
          <Checkbox />
          <label className="text-light">
            阅读并同意<a>《掘掘手札条款》</a>
          </label>
        </div>

        <Button block theme="primary">
          注册
        </Button>
      </div>
    </div>
  )
}

export default Login
