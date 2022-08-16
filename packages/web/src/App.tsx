import { Routes, Route, useLocation } from "react-router-dom"
import routes from "@/router"

import { ConfigProvider } from "zarm"
import NavBar from "./components/NavBar"
import { useEffect, useState } from "react"

function App() {
  const location = useLocation()
  // 获取当前路径
  const { pathname } = location
  // 底部导航栏路径
  const needNav = ["/", "/data", "/user"]
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname])

  return (
    <>
      {/* @ts-ignore */}
      <ConfigProvider primaryColor={"#007fff"}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </ConfigProvider>

      {/* 导航栏 */}
      <NavBar showNav={showNav} />
    </>
  )
}

export default App
