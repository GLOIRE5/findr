import { useEffect } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router";
import Header from "./components/Header";
import ItemsList from "./pages/ItemsList";
import ReportItem from "./pages/ReportItem";
import "./App.css";

function Layout() {
  const { hash, key } = useLocation();

  // New page starts at the top; #section links (e.g. Browse -> /#items) scroll to it
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash, key]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <ItemsList /> },
      { path: "/report", element: <ReportItem /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
