/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import { Container,Flex,Text } from "@gravity-ui/uikit"
import PageConstr from "features/components/PageConstr"
import { Link } from "react-router-dom"
import {federalDistricts} from 'shared/data'

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

const MainContent = () => {
  return (
    <Container>
      <Text variant="display-2">Региональные представительства ФСП</Text>
      <Flex direction='column'>
        {
          Object.keys(federalDistricts).map((key) => {
            return (
              <Flex key={key} direction='column'>
                {/* @ts-ignore */}
                <Text variant="display-1">{federalDistricts[key].name}</Text>
                <Flex direction='column'>
                  {
                    // @ts-ignore
                    federalDistricts[key].regions.map((item) => {
                      return (
                        <Link key={item.code} className="pc-link-block__link pc-link-block__link_theme_light pc-link-block__link_has-arrow" to={`/region/${item.code}`}>{item.name}</Link>
                      )
                    })
                  }
                </Flex>
              </Flex>
            )
          })
        }
      </Flex>
    </Container>
  )
}

const Regional = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr Component={MainContent} navigation={navigation} navigation_custom={navigation_custom} />
  )
}

export default Regional