import Header from "@/components/Header"
import { useLocation, useNavigate } from "react-router-dom"
import qs from "query-string"
import { useState, useEffect, useRef } from "react"
import { get, post } from "@/utils"

import s from "./style.module.less"
import cx from "classnames"
import CustomIcon from "@/components/CustomIcon"
import { typeMap } from "../../utils/index"
import dayjs from "dayjs"
import { Modal, Toast } from "zarm"
import PopupAddBill from "@/components/PopupAddBill"
import { CommonRef, Nullable } from "@/types"

function Detail() {
  const location = useLocation()
  const navigate = useNavigate()

  // 查询字符串反序列化
  const { id } = qs.parse(location.search)

  // 订单详情数据
  const [detail, setDetail] = useState<Record<string, any>>({})

  const editRef = useRef<Nullable<CommonRef>>(null)

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const { data } = await get(`/bill/detail?id=${id}`)
    setDetail(data)
  }

  // 删除
  const deleteDetail = () => {
    Modal.confirm({
      title: "删除",
      content: "确认删除账单？",
      onOk: async () => {
        const { data } = await post("/api/bill/delete", { id })
        Toast.show("删除成功")
        navigate(-1)
      },
    })
  }

  return (
    <div className={s.detail}>
      <Header title="账单详情" />

      <div className={s.card}>
        <div className={s.type}>
          {/* 通过 pay_type 属性，判断收入/支出，设置不同颜色 */}
          <span
            className={cx({
              [s.expense]: detail.pay_type == 1,
              [s.income]: detail.pay_type === 2,
            })}
          >
            {/* typeMap 是事先约定好的 icon 列表 */}
            <CustomIcon
              className={s.iconfont}
              type={detail.type_id ? typeMap[detail.type_id].icon : 1}
            />
          </span>

          <span>{detail.type_name || ""}</span>
        </div>

        {detail.pay_type == 1 ? (
          <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
        ) : (
          <div className={cx(s.amount, s.income)}>+{detail.amount}</div>
        )}

        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format("YYYY-MM-DD HH:mm")}</span>
          </div>

          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || "-"}</span>
          </div>
        </div>

        <div className={s.operation}>
          <span onClick={deleteDetail}>
            <CustomIcon type="shanchu" />
            删除
          </span>
          <span onClick={() => editRef?.current?.show()}>
            <CustomIcon type="tianjia" />
            编辑
          </span>
        </div>
      </div>

      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  )
}

export default Detail
