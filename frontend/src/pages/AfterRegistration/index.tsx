import { Flex, Row, Text } from "@gravity-ui/uikit";
import { Link, useNavigate } from "react-router-dom";

const AfterRegistration = () => {
  const navigate = useNavigate()
  return (
    <Row space="0">
      <Flex
        width="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={{ p: 3 }}
      >
        <Flex width="80%" direction="column">
          <Text variant="display-2">Поздравляем!</Text>
          <Text variant="header-1">
            Вы успешно подали заявку за получение выбранной роли.
          </Text>
          <Text variant="header-1">
            Ожидайте рассмотрения вашей заявки администратором. После одобрения
            на указанную вами почту придет уведомление.
          </Text>
          <Text variant="header-1">
            После получения уведомления перезайдите в аккаунт.
          </Text>
          <span>
            <Text variant="header-1">
              Если хотите войти за администратора, то нужно открыть эту ссылку в режиме инкогнито
            </Text>{" "}<Text variant="code-3">https://fsp-platform.ru/api/auth/root</Text>
          </span>
          <Text variant="header-1">
            <Link
              className="pc-navigation-link pc-navigation-item__content pc-navigation-item__content_type_link"
              to="/"
              onClick={() => {
                navigate('/')
                window.location.reload()
              }}
            >
              Вернуться на главную
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Row>
  );
};

export default AfterRegistration;
