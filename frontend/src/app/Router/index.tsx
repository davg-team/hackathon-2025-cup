import LoginCallback from "features/components/LoginCallback";
import Logout from "features/components/Logout";
import Landing from "pages/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getNavigationCustoms, useProps } from "features/components/Navigation";
import { NavigationData } from "@gravity-ui/page-constructor";
import FederalCalendar from "pages/FederalCalendar";

interface RouterProps {
  theme: string;
  setTheme: () => void;
}

const Router = ({ theme, setTheme }: RouterProps) => {
  const navigation: NavigationData = useProps(theme, setTheme);
  const navigation_custom = getNavigationCustoms();

  const hostname = window.location.hostname;
  const subdomain = hostname.split(".")[0];
  const isSubdomain =
    subdomain !== "fsp-platform" &&
    subdomain !== "localhost" &&
    subdomain !== "fsp" &&
    subdomain !== "demo-front" &&
    subdomain !== "zsn5k9p7-3000";
  const subdomainRegionId = isSubdomain ? subdomain : null;
  if (subdomainRegionId) {
    // устанавливаем id региона в localStorage
    localStorage.setItem("regionId", subdomainRegionId);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/calendar"
          element={
            <FederalCalendar
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/callback/auth/return/:provider"
          element={<LoginCallback />}
        />

        <Route
          path="/"
          element={
            <Landing
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />

        <Route
          path="/calendar"
          element={
            <FederalCalendar
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
