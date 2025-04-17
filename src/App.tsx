import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import RedirectHome from "./components/RedirectHome";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="*" element={<RedirectHome />} />
    </Routes>
  );
}
