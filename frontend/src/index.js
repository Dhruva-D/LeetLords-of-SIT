import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './index.css';
import Register from './components/Register';

const Structure = () =>{
  return(
    <div className='bg-black'>
      <Outlet />
    </div>
  )
}

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Structure />,
    children:[
      {
        path:'/',
        element:<App />
      },
      {
        path:'/register',
        element:<Register />
      }
    ]
  }
])

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Structure /> */}
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
