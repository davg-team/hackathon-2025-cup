/* eslint-disable @typescript-eslint/no-explicit-any */
import PageConstr from "features/components/PageConstr";
import MainContent from "pages/TeamMainContent";


interface TeamProps {
  navigation: any;
  navigation_custom: any;
}

const Team = ({ navigation, navigation_custom }: TeamProps) => {
  return (
    <PageConstr Component={MainContent} navigation={navigation} navigation_custom={navigation_custom} />
  )
}

export default Team;