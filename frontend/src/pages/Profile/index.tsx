import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import { Col, Container, Row } from "@gravity-ui/uikit";
import PageConstr from "features/components/PageConstr";

function ProfileMainContent() {
  return (
    <Container>
      <Row space={"0"}>
        <Col s={"12"} l={"4"}>
          <img src="" width={"160"} height={"160"} />
        </Col>
        <Col s={"12"} l={"8"}></Col>
      </Row>
    </Container>
  );
}

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const ProfilePage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={ProfileMainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default ProfilePage;
