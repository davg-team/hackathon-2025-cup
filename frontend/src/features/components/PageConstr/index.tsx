/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  PageConstructor,
  CustomItems,
  NavigationData,
} from "@gravity-ui/page-constructor";
import { ReactNode } from "react";

interface PageConstrProps {
  Component: () => ReactNode;
  navigation: NavigationData;
  navigation_custom: CustomItems;
}

const PageConstr = ({
  Component,
  navigation,
  navigation_custom,
}: PageConstrProps) => {
  return (
    <>
      <PageConstructor
        custom={{
          navigation: navigation_custom,
          blocks: {
            "main-content": Component,
          },
        }}
        content={{ blocks: [{ type: "main-content" }] }}
        navigation={navigation}
      />
    </>
  );
};

export default PageConstr;
