import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { TabBar } from "zarm"
import style from "./style.module.less"

import CustomIcon from "../CustomIcon"

interface INavBarProps {
  showNav: boolean
}

function NavBar(props: INavBarProps) {
  const { showNav } = props

  const [activeKey, setActiveKey] = useState("/")
  const navigateTo = useNavigate()

  const changeTab = (path: string | number | undefined) => {
    if (!path) return

    setActiveKey(path.toString())
    navigateTo(path.toString())
  }

  return (
    // @ts-ignore
    <TabBar
      visible={showNav}
      className={style.tab}
      activeKey={activeKey}
      onChange={changeTab}
    >
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="zhangdan" />}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="tongji" />}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode" />}
      />
    </TabBar>
  )
}

export default NavBar
