import ErrorPage from './Pages/ErrorPage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: < ErrorPage/>, 
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'Register',
        element: <Register />
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