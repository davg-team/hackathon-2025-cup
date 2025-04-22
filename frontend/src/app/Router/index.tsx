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
import EventsMainContent from "pages/EventsMainContent";
import TeamsMainContent from "pages/Teams";
import TrackEventsMainContent from "pages/TrackEventsMainContent";
import AddEvent from "pages/AddEvent";
import AddReportMainContent from "pages/AddReport";
import PeoplePage from "pages/People";
import AfterRegistration from "pages/AfterRegistration";

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
            <Region
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/region/:id/events"
          element={
            <EventsMainContent
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/region/:id/teams"
          element={
            <TeamsMainContent
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/region/:id/track-events"
          element={
            <TrackEventsMainContent
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/region/:id/add-event"
          element={
            <AddEvent
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/region/:id/add-report"
          element={
            <AddReportMainContent
              navigation={navigation}
              navigation_custom={navigation_custom}
            />
          }
        />
        <Route
          path="/region/:id/presenters"
          element={
            <PeoplePage
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
