import LoginCallback from "features/components/LoginCallback";
import Logout from "features/components/Logout";
import Landing from "pages/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getNavigationCustoms, useProps } from "features/components/Navigation";
import { NavigationData } from "@gravity-ui/page-constructor";
import FederalCalendar from "pages/FederalCalendar";
import Region from "pages/Region";
import Team from "pages/Team";
import Regions from "pages/Regions";
import AfterRegistration from "pages/AfterRegistration";
import MainContent from "pages/MainContentLK";
import ApplicationsPage from "pages/Applications";
import Page403 from "pages/403";
import Page404 from "pages/404";
import MyCompetitionsPage from "pages/MyCompetitions";
import ProfilePage from "pages/Profile";
import CompetitionsPage from "pages/Competitions";
import EventPage from "pages/EventMainContent";
import CompetitionTeamReginsterPage from "pages/CompetitionTeamRegister";

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
    subdomain !== "frontend" &&
    subdomain !== "zsn5k9p7-3000";
  const subdomainRegionId = isSubdomain ? subdomain : null;
  if (subdomainRegionId) {
    // устанавливаем id региона в localStorage
    localStorage.setItem("regionId", subdomainRegionId);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/403" element={<Page403 />} />
        <Route path="/404" element={<Page404 />} />
        <Route
          path="/calendar"
          element={
            <FederalCalendar
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/competitions/register"
          element={
            <CompetitionTeamReginsterPage
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/lk/competitions"
          element={
            <MyCompetitionsPage
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/competitions"
          element={
            <CompetitionsPage
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/competitions/:id"
          element={
            <EventPage
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/lk"
          element={
            <ProfilePage
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/after-register" element={<AfterRegistration />} />
        <Route
          path="/callback/auth/return/:provider"
          element={<LoginCallback />}
        />

        <Route
          path="/regions"
          element={
            <Regions
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />

        <Route
          path="/teams/:id"
          element={
            <Team
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />

        {/* region routes */}
        <Route
          path="/region/:id"
          element={
            <MainContent
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />

        <Route
          path="/applications"
          element={
            <ApplicationsPage
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />

        {isSubdomain ? (
          <Route
            path="/"
            element={
              <Region
                navigation={navigation}
                navigation_custom={navigation_custom}
              />
            }
          />
        ) : (
          <Route
            path="/"
            element={
              <Landing
                navigation={navigation}
                navigation_custom={navigation_custom}
              />
            }
          />
        )}

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
