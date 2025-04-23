import { Container, Flex, Text } from "@gravity-ui/uikit";
import { Link } from "react-router-dom";

export default function Page403() {
  return (
    <Container>
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Text variant="display-1">404 - Запрашиваемая страница не найдена</Text>
        <Link
          className="g-button g-button_view_action g-button_size_l g-button_pin_round-round"
          to={"/"}
        >
          Главная
        </Link>
      </Flex>
    </Container>
  );
}
