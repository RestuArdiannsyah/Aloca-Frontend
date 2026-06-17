import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/user/Dashboard";
import ErrorPage from "./pages/404";

function App() {
  const AlocaRouter = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={AlocaRouter} />;
}

export default App;
