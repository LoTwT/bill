import { Icon, Pull } from "zarm"

import style from "./style.module.less"
import { useState, useEffect, useRef } from "react"
import BillItem from "@/components/BillItem"
import dayjs from "dayjs"
import { get, LOAD_STATE, REFRESH_STATE } from "@/utils"
import PopupType from "@/components/PopupType"
import PopupDate from "@/components/PopupDate"
import CustomIcon from "@/components/CustomIcon"
import PopupAddBill from "@/components/PopupAddBill"
import { CommonRef, Nullable } from "@/types"

function Home() {
  // 当前筛选时间
  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM"))
  // 分页
  const [page, setPage] = useState(1)
  // 账单列表
  const [list, setList] = useState([])
  // 分页总数
  const [totalPage, setTotalPage] = useState(0)
  // 下拉刷新状态
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)
  // 上拉加载状态
  const [loading, setLoading] = useState(LOAD_STATE.normal)
  // 当前筛选类型
  const [currentSelect, setCurrentSelect] = useState<Record<string, any>>({})

  // 总支出
  const [totalExpense, setTotalExpense] = useState(0)
  // 总收入
  const [totalIncome, setTotalIncome] = useState(0)

  const typeRef = useRef<Nullable<CommonRef>>(null)

  const monthRef = useRef<Nullable<CommonRef>>(null)

  const addRef = useRef<Nullable<CommonRef>>(null)

  useEffect(() => {
    // 初始化
    getBillList()
  }, [page, currentSelect, currentTime])

  // 获取账单方法
  const getBillList = async () => {
    const { data } = await get(
      `/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
        currentSelect.id || "all"
      }`,
    )

    // 下拉刷新，重置数据
    if (page === 1) setList(data.list)
    else setList(list.concat(data.list))

    setTotalExpense(data.totalExpense.toFixed(2))
    setTotalIncome(data.totalIncome.toFixed(2))

    setTotalPage(data.totalPage)

    // 上滑加载状态
    setLoading(LOAD_STATE.success)
    setRefreshing(REFRESH_STATE.success)
  }

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page != 1) setPage(1)
    else getBillList()
  }

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef?.current?.show()
  }

  // 筛选类型
  const select = (item: any) => {
    setRefreshing(REFRESH_STATE.loading)
    // 触发刷新列表，将分页重置为 1
    setPage(1)
    setCurrentSelect(item)
  }

  // 选择月份弹窗
  const monthToggle = () => monthRef?.current?.show()

  // 筛选月份
  const selectMonth = (item: any) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentTime(item)
  }

  const addToggle = () => addRef?.current?.show()

  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <div className={style.expense}>
            总支出：<b>￥ {totalExpense}</b>
          </div>
          <div className={style.income}>
            总收入：<b>￥ {totalIncome}</b>
          </div>
        </div>

        <div className={style.typeWrap}>
          <div className={style.left} onClick={toggle}>
            <span className={style.title}>
              {currentSelect.name || "全部类型"}{" "}
              <Icon className={style.arrow} type="arrow-bottom" />
            </span>
          </div>

          <div className={style.right}>
            <span className={style.time} onClick={monthToggle}>
              {currentTime} <Icon className={style.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>

      <div className={style.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : null}
      </div>

      <div className={style.add} onClick={addToggle}>
        <CustomIcon type="tianjia" />
      </div>

      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} onSelect={selectMonth} mode="month" />
      <PopupAddBill ref={addRef} onReload={refreshData} />
    </div>
  )
}

export default Home
