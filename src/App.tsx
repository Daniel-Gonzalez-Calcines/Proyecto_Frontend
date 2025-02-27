import ErrorPage from './Pages/ErrorPage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ShowPersonalSessions from './Pages/ShowPersonalSessions'
import Upload from './Pages/Upload'
import MainStats from './Pages/mainStats'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />, 
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'Register',
        element: <Register />
      }, 
      {
        path: 'ShowPersonalSessions',
        element: <ShowPersonalSessions />
      }, 
      {
        path: 'Upload',
        element: <Upload/>
      },
      {
        path: 'mainStats',
        element: <MainStats />
      }
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App