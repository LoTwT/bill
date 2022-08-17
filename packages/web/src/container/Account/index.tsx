import Header from "@/components/Header"
import { post } from "@/utils"
import { Button, Cell, Input, Toast } from "zarm"
import { createForm } from "rc-form"
import s from "./style.module.less"

interface IAccountProps {
  form: any
}

function Account(props: IAccountProps) {
  const { form } = props

  // Account 通过 createForm 高阶组件包裹之后，可以再 props 中获取到 form 属性
  const { getFieldProps, getFieldError } = form

  // 提交修改方法
  const submit = () => {
    form.validateFields(async (error: any, value: any) => {
      // 表单验证全部通过，error 为 false，否则为 true
      if (!error) {
        if (value.newpass !== value.newpass2) {
          Toast.show("两次密码输入不一致")
          return
        }

        await post("/api/user/modify_pass", {
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_pass2: value.newpass2,
        })

        Toast.show("密码修改成功")
      }
    })
  }

  return (
    <>
      <Header title="重置密码" />
      <div className={s.account}>
        <div className={s.form}>
          <Cell title="原密码">
            <Input
              clearable
              type="text"
              placeholder="请输入原密码"
              {...getFieldProps("oldpass", { rules: [{ require: true }] })}
            />
          </Cell>

          <Cell title="新密码">
            <Input
              clearable
              type="text"
              placeholder="请输入新密码"
              {...getFieldProps("newpass", { rules: [{ required: true }] })}
            />
          </Cell>

          <Cell title="确认密码">
            <Input
              clearable
              type="text"
              placeholder="再输入新密码"
              {...getFieldProps("newpass2", { rules: [{ required: true }] })}
            />
          </Cell>
        </div>

        <Button className={s.btn} block theme="primary" onClick={submit}>
          提交
        </Button>
      </div>
    </>
  )
}

export default createForm()(Account)
