import EOD from './Components/EOD'
import NewBills from './Components/NewBills'
import TopBar from './Components/TopBar'
import ViewBills from './Components/ViewBills'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppRoutes from './Utills/AppRoutes'
import { Toaster } from 'react-hot-toast'


function App() {
        const router = createBrowserRouter(AppRoutes)
  return <>
        <Toaster position="top-right" />
        <RouterProvider router={router} />         
  </>
}

export default App
