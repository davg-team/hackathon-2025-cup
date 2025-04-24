import { Button, Text, Card, Flex } from "@gravity-ui/uikit";

interface IData {
  img: string;
  captain: string;
  title: string;
}

function ApplicationCard({ data }: { data: IData }) {
  return (
    <Card spacing={{ p: "3" }} view="raised" width={"100%"}>
      <Flex
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex gap={"2"} width={"60%"}>
          <img src={data.img} width={72} height={72} />
          <Flex direction={"column"}>
            <Text variant="display-1">{data.title}</Text>
            <Text variant="subheader-3">Капитан: {data.captain}</Text>
          </Flex>
        </Flex>
        <Flex gap={"2"}>
          <Button view="action">Принять</Button>
          <Button view="outlined-action">Отколнить</Button>
        </Flex>
      </Flex>
    </Card>
  );
}

function ApplicationsTab() {
  return (
    <Flex width={"100%"} direction={"column"} gap={"2"}>
      <br />
      <br />
      <ApplicationCard
        data={{ title: "Соперники", captain: "КФУшник", img: "" }}
      />
      <ApplicationCard
        data={{ title: "Соперники", captain: "КФУшник", img: "" }}
      />
      <ApplicationCard
        data={{ title: "Соперники", captain: "КФУшник", img: "" }}
      />
    </Flex>
  );
}

export default ApplicationsTab;
