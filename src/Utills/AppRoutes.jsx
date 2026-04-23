import CustDB from "../Components/CustDB";
import EOD from "../Components/EOD";
import HomePage from "../Components/HomePage";
import NewBills from "../Components/NewBills";
import Staff from "../Components/Staff";
import Stocks from "../Components/Stocks";
import TopBar from "../Components/TopBar";
import ViewBills from "../Components/ViewBills";
import AnimatedPage from "../Components/AnimatedPage";
import Login from "../Components/Login";
import Admin from "../Components/Admin";
import SuperUser from "../Components/SuperUser";

import ProtectedRoute from "../Components/ProtectedRoute";

export default [
    {
        path: '/EOD',
        element: <ProtectedRoute><AnimatedPage><EOD/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/home',
        element: <ProtectedRoute><AnimatedPage><HomePage/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/',
        element: <Login/>
    },
    {
        path: '/newbills',
        element: <ProtectedRoute><AnimatedPage><NewBills/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/viewbills',
        element: <ProtectedRoute><AnimatedPage><ViewBills/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/stocks',
        element: <ProtectedRoute><AnimatedPage><Stocks/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/staff',
        element: <ProtectedRoute><AnimatedPage><Staff/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/customers',
        element: <ProtectedRoute><AnimatedPage><CustDB/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['admin']}><AnimatedPage><Admin/></AnimatedPage></ProtectedRoute>
    },
    {
        path: '/superuser',
        element: <ProtectedRoute allowedRoles={['superuser']}><AnimatedPage><SuperUser/></AnimatedPage></ProtectedRoute>
    }
]
