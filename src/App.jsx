import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/auth/Login';
import AuthLayout from './components/layouts/AuthLayout';
import Register from './pages/auth/Register';
import Dashboard from './pages/view/admin/Dashboard';
import CreateRoom from './pages/view/admin/CreateRoom';
import JoinRoom from './pages/view/admin/JoinRoom';

const router=createBrowserRouter([
  {
    path:'/',
    element:<Home/>,
  },
  { 
    path:'/auth',
    element:<AuthLayout/>,
    children:[
      {
        path:'login',
        element:<Login/>
      },
      {
        path:'register',
        element:<Register/>
      }
    ]
  },
  {
    path:'/dashboard',
    element:<Dashboard/>,
    children:[ 
      {
        index: true,               //   ── /dashboard
        element: <Dashboard />
      },
      {
        path: 'create-room',       //   ── /dashboard/create-room
        element: <CreateRoom />
      },
      {
        path: 'join-room',         //   ── /dashboard/join-room
        element: <JoinRoom />
      }
    ]
  }
])
export default router;
