import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import PageConstr from "features/components/PageConstr";
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from "shared/tools";

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

function UserProfileMainContent() {
  const navigate = useNavigate();
  const roles = getRoleFromToken();
  if (roles && roles.length > 0) {
    if (
      roles.includes("fsp_staff") ||
      roles.includes("root") ||
      roles.includes("fsp_region_head")
    ) {
      return <>fsp or root lk</>;
    } else if (roles.includes("user")) {
      return <>user lk</>;
    }
  } else navigate("/");
}

const CalendarPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={UserProfileMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default CalendarPage;
