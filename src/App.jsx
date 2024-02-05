import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Homepage from "./pages/Homepage";
// import Pricing from "./pages/Pricing";
// import Product from "./pages/Product";
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";

// dist/index.html                   0.48 kB │ gzip:   0.32 kB
// dist/assets/index-51a496c6.css   30.22 kB │ gzip:   5.23 kB
// dist/assets/index-32abc2f3.js   513.83 kB │ gzip: 150.27 kB

const Homepage = lazy(() => import("./pages/Homepage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Product = lazy(() => import("./pages/Product"));
const Login = lazy(() => import("./pages/Login"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// dist/index.html                           0.48 kB │ gzip:   0.32 kB
// dist/assets/Logo-515b84ce.css             0.03 kB │ gzip:   0.05 kB
// dist/assets/Login-f39ef3ff.css            0.35 kB │ gzip:   0.22 kB
// dist/assets/Product-cf1be470.css          0.47 kB │ gzip:   0.27 kB
// dist/assets/PageNav-d3c5d403.css          0.51 kB │ gzip:   0.28 kB
// dist/assets/Homepage-16210d00.css         0.51 kB │ gzip:   0.31 kB
// dist/assets/AppLayout-c49eff02.css        1.91 kB │ gzip:   0.70 kB
// dist/assets/index-42bcf7b0.css           26.55 kB │ gzip:   4.55 kB
// dist/assets/Product.module-02d70b80.js    0.06 kB │ gzip:   0.07 kB
// dist/assets/PageNotFound-0dec7937.js      0.15 kB │ gzip:   0.15 kB
// dist/assets/Logo-1ccaa2ce.js              0.22 kB │ gzip:   0.20 kB
// dist/assets/PageNav-90c265f7.js           0.49 kB │ gzip:   0.27 kB
// dist/assets/Pricing-d807778f.js           0.66 kB │ gzip:   0.42 kB
// dist/assets/Homepage-fe7ea818.js          0.67 kB │ gzip:   0.41 kB
// dist/assets/Product-5c30995f.js           0.86 kB │ gzip:   0.49 kB
// dist/assets/Login-015ba474.js             1.01 kB │ gzip:   0.54 kB
// dist/assets/AppLayout-238fbbb4.js       159.88 kB │ gzip:  48.95 kB
// dist/assets/index-870ab774.js           352.44 kB │ gzip: 100.92 kB

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="product" element={<Product />} />
              <Route path="login" element={<Login />} />

              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
