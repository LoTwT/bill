import { Button, FilePicker, Input, Toast } from "zarm"
import s from "./style.module.less"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { get, imgUrlTrans, post } from "@/utils"
import axios from "axios"
import Header from "@/components/Header"
import { baseUrl } from "@/config"

function UserInfo() {
  const navigate = useNavigate()
  // 用户
  const [user, setUser] = useState<Record<string, any>>({})
  // 头像
  const [avatar, setAvatar] = useState("")
  // 个签
  const [signature, setSignature] = useState("")
  // 登录令牌
  const token = localStorage.getItem("token")

  useEffect(() => {
    // 初始化请求
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get("/user/get_userinfo")
    setUser(data)
    setAvatar(imgUrlTrans(data.avatar))
    setSignature(data.signature)
  }

  // 获取图片回调
  const handleSelect = (file: any) => {
    if (file && file.file.size > 200 * 1024) {
      Toast.show("头像图片大小不得超过 200 KB ！")
      return
    }

    const formData = new FormData()
    // 生成 form-data 数据类型
    formData.append("file", file.file)
    // 通过 axios 设置 "Content-Type": "multipart/form-data" ，进行文件上传
    axios({
      method: "post",
      url: `${baseUrl}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token || "",
      },
    }).then((res) => {
      // 返回图片地址
      setAvatar(imgUrlTrans(res.data))
    })
  }

  // 编辑用户信息方法
  const save = async () => {
    const { data } = await post("/uer/edit_userinfo", {
      signature,
      avatar,
    })

    Toast.show("修改成功")
    // 成功后返回个人中心页
    navigate(-1)
  }

  return (
    <>
      <Header title="用户信息" />
      <div className={s.userinfo}>
        <h1>个人资料</h1>

        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式，大小 200 KB 以内图片</span>
              <FilePicker
                className={s.filePicker}
                onChange={handleSelect}
                accept="image/*"
              >
                <Button className={s.upload} theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>

        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value: any) => setSignature(value)}
            />
          </div>
        </div>

        <Button onClick={save} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </>
  )
}

export default UserInfo
