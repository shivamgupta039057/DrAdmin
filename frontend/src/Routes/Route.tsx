import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import PageTitle from '../components/PageTitle';
import SignIn from '../pages/Authentication/SignIn';
import ECommerce from '../pages/Dashboard/ECommerce';
import localStorageKeys from '../constant/localStorageKeys';
import { ROUTES_CONST } from '../constant/routeConstant';
import Doctors from '../pages/Doctors/Doctors.tsx';
import Protected from './ProtectedRoutes';
import DefaultLayout from '../layout/DefaultLayout';
import Patient from '../pages/Patient/Patient.tsx';
import Page404 from '../pages/Page404.tsx';
// import Cities from '../pages/State/State.tsx';
import State from '../pages/State/State.tsx';
import City from '../pages/City/CityData.tsx';
import MedicinePage from '../pages/Medicine/Medicine.tsx';
import TestPage from '../pages/Test/Test.tsx';
import ViewPatients from "../pages/ViewPatients/ViewPatients.js"
import ViewPrescription from "../pages/precription/viewPricription.jsx"
import NotificationMedicine from '../pages/Medicine/NotificationMedicine.tsx';

function AllRoutes() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const isAuthenticated = localStorage.getItem(localStorageKeys.token);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const routeConfig = [
    { path: ROUTES_CONST.MEDICINE, component: MedicinePage },
    { path: ROUTES_CONST.TEST, component: TestPage },
    { path: ROUTES_CONST.DOCTOR, component: Doctors },
    { path: ROUTES_CONST.MEDICINE_NOTIFICATION, component: NotificationMedicine },
    {path : ROUTES_CONST.PATIENT , component : Patient},
    {path : ROUTES_CONST.HOME , component : ECommerce},
    {path : `${ROUTES_CONST.VIEWPATIENT}/:patientId` , component : ViewPatients},
    {path : `${ROUTES_CONST.VIEWPRESCRIPTION}/:prescriptionId` , component : ViewPrescription},


  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>

        <Route
          path={ROUTES_CONST.AUTH.SIGNIN}
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES_CONST.HOME} replace />
            ) : (
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            )
          }
        />

        <Route element={<DefaultLayout />}>
          {routeConfig?.map((item) => {

            return(
              <Route
              key={item?.path}
              path={item?.path}
              element={<Protected Component={item?.component} />}
            />
            )
          })}
        </Route>

        
        
      <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default AllRoutes;

