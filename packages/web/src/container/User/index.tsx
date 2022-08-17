import { useState, useEffect } from "react"
import { get } from "@/utils"

import s from "./style.module.less"

function User() {
  const [user, setUser] = useState<Record<string, any>>({})

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get("/user/get_userinfo")
    setUser(data)
  }

  return (
    <div className={s.user}>
      <div className={s.head}>
        <div className={s.info}>
          <span>昵称：{user.username || "--"}</span>
          <span>
            <img
              style={{
                width: 30,
                height: 30,
                verticalAlign: "-10px",
              }}
              src="//s.yezgea02.com/1615973630132/geqian.png"
              alt=""
            />
            <b>{user.signature || "暂无个签"}</b>
          </span>
        </div>

        <img
          className={s.avatar}
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
          }}
          src={user.avatar ?? ""}
          alt=""
        />
      </div>
    </div>
  )
}

export default User
