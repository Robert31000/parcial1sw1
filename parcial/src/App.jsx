
import { createBrowserRouter } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import React from 'react';
import Layout from './Pages/Layouts/Layout';
import Login from './Pages/views/Login';
import AuthLayout from './Pages/Layouts/AuthLayout';
import Register from './Pages/views/Register';
import Dashboard from './Pages/views/admin/Dashboard';
import NewProject from './Pages/views/admin/NewProject';
import ProjectEditor from './Pages/views/admin/Editor';

const router=createBrowserRouter([
  { 
    path: '/',
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: <Home /> 
      
      },
    ] },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path:'/dashboard',
    element:<Dashboard/>,
    children:[
      {
        path:'newproject',
        element:<NewProject/>
      },
      {
        path: 'projects/:projectId/editor',
        element: <ProjectEditor />
      }
      
    ]
  }
]);

export default router;