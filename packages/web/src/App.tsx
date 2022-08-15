import { BrowserRouter, Routes, Route } from "react-router-dom"
import routes from "./router/index"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
