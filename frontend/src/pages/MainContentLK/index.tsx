/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Avatar,
  Button,
  Card,
  Col,
  Container,
  Flex,
  Loader,
  Row,
  spacing,
  Text,
  TextArea,
  UserLabel,
  useToaster,
} from "@gravity-ui/uikit";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getById, getRegionId } from "shared/data";
import { getPayload } from "shared/jwt-tools";

import { EventsMainContent } from "pages/EventsMainContent";
import { AcceptEventsMainContent } from "pages/AcceptEvents";
import { AddEventMainContent } from "pages/AddEvent";
import { AddReportMainContent } from "pages/AddReport";
import { AnalitycsMainContent } from "pages/Analitycs";
import { PeopleMainContent } from "pages/People";
import { TrackEventsMainContent } from "pages/TrackEventsMainContent";
import { TeamsMainContent } from "pages/Teams";
import { Person } from "@gravity-ui/icons";
import { CustomItems, NavigationData } from "@gravity-ui/page-constructor";
import PageConstr from "features/components/PageConstr";

interface Presenter {
  managers: string[];
  email: string;
  description: string;
  district: string;
}

const MainContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [presenters, setPresenters] = useState<Presenter>({
    managers: [],
    email: "",
    description: "",
    district: "",
  });
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [error2, setError2] = useState<unknown>("");
  const [typeOfContent, setTypeOfContent] = useState("events");
  const location = useLocation();
  const params = useParams();
  const token = localStorage.getItem("token") as string;
  const payload = getPayload(token);
  const regionId = getRegionId(params.id);
  const { add } = useToaster();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("type-of-content") === null) {
      setSearchParams({ "type-of-content": "events" });
      return;
    }
    setTypeOfContent(searchParams.get("type-of-content") || "events");
  }, [location]);

  useEffect(() => {
    request2();
  }, []);

  if (!regionId) {
    navigate("/404");
  }

  async function request2() {
    setIsLoading2(true);
    //@ts-ignore
    const url = "/api/organizations/" + regionId;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setPresenters(data);
      setIsLoading2(false);
      setError2("");
    } else {
      setIsLoading2(false);
      setError2(data.detail);
    }
  }

  return (
    <Container>
      <Row style={{ marginBottom: "2rem" }} space="0">
        <Col s={12} l={4}>
          <div>
            <svg
              width="117"
              height="121"
              viewBox="0 0 117 121"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35.6971 99.5202C34.8332 98.8579 34.1985 97.9308 33.8635 96.8523C33.5286 95.7927 33.5286 94.6385 33.8635 93.56L34.9214 88.9621C35.1153 88.1485 35.4503 87.3916 35.9439 86.7294C36.42 86.0671 37.037 85.5184 37.7246 85.14L41.1802 83.21C43.3135 82.0369 45.006 80.1447 46.0109 77.8363C47.0159 75.5279 47.2627 72.9357 46.7162 70.457L46.6633 70.23C46.0286 67.4675 44.4242 65.0455 42.2028 63.4372C39.9637 61.8478 37.2486 61.1856 34.5864 61.6019L30.7253 62.1884C29.932 62.3019 29.1386 62.2452 28.3805 62.0181C27.6224 61.7911 26.9171 61.3937 26.3001 60.845L22.8798 57.7798C22.0335 57.1175 21.3988 56.1714 21.0815 55.1118C20.7641 54.0523 20.7465 52.8981 21.0815 51.8385C21.8043 49.4733 21.7867 46.9189 21.0286 44.5727C20.2705 42.2264 18.7895 40.2018 16.8501 38.8017C14.8932 37.4204 12.5836 36.7393 10.2387 36.8717C7.89387 37.0042 5.6548 37.9313 3.8565 39.5396C2.05819 41.1479 0.806424 43.3239 0.27751 45.7458C-0.251404 48.1677 -0.0222077 50.7032 0.947468 52.9737C1.89951 55.2443 3.53915 57.1175 5.60191 58.3285C7.66468 59.5394 10.0272 59.9935 12.3544 59.634C12.7246 59.5773 13.0949 59.4827 13.4651 59.3881L14.47 59.1799C15.2987 59.0096 16.1626 59.0286 16.9912 59.2556C17.8198 59.4827 18.5779 59.8989 19.2126 60.4855L23.8494 64.7428C24.5547 65.405 25.1012 66.2376 25.4186 67.1647C25.7359 68.1108 25.8417 69.1136 25.7006 70.0975L25.5949 70.8544L25.5067 71.5166V71.5734C25.348 72.9357 25.4362 74.317 25.7535 75.6604C25.7535 75.7361 25.7535 75.8118 25.8064 75.8874V75.9631C26.2472 77.7796 27.1111 79.4447 28.31 80.807C28.451 80.9773 28.592 81.1287 28.7507 81.28L29.262 81.8098C29.932 82.5288 30.408 83.4181 30.6724 84.3831C30.9369 85.3481 30.9545 86.3699 30.7253 87.3538L29.3149 93.6546C29.121 94.5249 28.7331 95.3386 28.2042 96.0386C27.6576 96.7387 26.9877 97.2874 26.2119 97.6659L25.348 98.0821C24.9954 98.2335 24.6428 98.4038 24.3078 98.593C22.7211 99.4823 21.3812 100.769 20.3939 102.339C18.7542 104.837 18.1195 107.902 18.6132 110.892C19.1245 113.881 20.7112 116.53 23.0737 118.271C25.4186 120.012 28.3276 120.674 31.1485 120.144C33.9693 119.615 36.4729 117.912 38.1125 115.433C39.0822 114.033 39.7345 112.406 40.0166 110.684C40.0871 110.305 40.14 109.908 40.1753 109.511L40.281 108.508C40.2105 106.748 39.7698 105.026 38.994 103.456C38.2006 101.904 37.0899 100.561 35.75 99.5202H35.6971Z"
                fill="#EDEDED"
              />
              <path
                d="M116.635 44.6928C116.081 42.8432 115.095 41.2011 113.779 39.88C112.464 38.5588 110.854 37.6152 109.106 37.1622C107.358 36.6903 105.524 36.7092 103.793 37.2188C102.063 37.7284 100.47 38.691 99.1723 40.031C98.8954 40.2952 98.6358 40.5783 98.3762 40.8803L97.7359 41.6352C97.1647 42.2958 96.4725 42.8054 95.6937 43.1263C94.9149 43.4471 94.0841 43.5792 93.2534 43.5226L87.2653 42.9941C86.3307 42.9186 85.4308 42.5789 84.652 42.0127C83.8732 41.4465 83.2328 40.6916 82.8175 39.8045L82.5059 39.1439C82.4194 38.9363 82.3329 38.7476 82.229 38.5588V38.5022C81.606 37.3132 80.7926 36.2374 79.8061 35.3503L79.6503 35.2182L79.5811 35.1427C78.2485 33.9725 76.6563 33.161 74.9602 32.8024H74.891L74.2852 32.6891L73.5757 32.6325C72.6584 32.4627 71.7931 32.0663 71.0489 31.4435C70.322 30.8206 69.7336 30.0091 69.3701 29.0843L67.051 23.158C66.7395 22.3275 66.5837 21.4405 66.6357 20.5345C66.6876 19.6475 66.9299 18.7604 67.3279 17.9866L67.7952 17.1373C68.0029 16.7975 68.176 16.4578 68.3317 16.0992C69.0413 14.5327 69.422 12.8341 69.4047 11.0977C69.3355 8.11566 68.176 5.30349 66.203 3.22739C64.2127 1.15129 61.5648 0 58.7957 0C56.0266 0 53.3787 1.17017 51.3884 3.22739C49.3982 5.30349 48.2559 8.13454 48.1867 11.0977C48.1867 12.8341 48.5501 14.5516 49.2597 16.0992C49.4328 16.4578 49.6058 16.7975 49.7962 17.1373L50.2635 17.9866C50.6789 18.7604 50.9038 19.6475 50.9558 20.5345C51.0077 21.4216 50.8692 22.3275 50.5404 23.158L48.2213 29.0843C47.8579 30.0091 47.2867 30.8206 46.5599 31.4435C45.833 32.0663 44.9676 32.4815 44.0504 32.6514L43.3581 32.7646L42.7351 32.8779H42.6831C41.4371 33.1421 40.2256 33.6517 39.1526 34.3878L38.9968 34.501C38.9968 34.501 38.9276 34.5388 38.9103 34.5576C37.4565 35.5579 36.245 36.9546 35.397 38.5777V38.6343C35.3105 38.8231 35.2066 39.0307 35.1201 39.2194C30.8107 49.1469 40.2429 54.6581 41.4198 54.9978C42.8735 55.4696 44.3965 55.6206 45.9022 55.4319C47.4079 55.2431 48.8616 54.7335 50.177 53.922L50.3673 53.7899C52.6172 52.2988 54.2613 49.9396 54.9709 47.203C55.6805 44.4663 55.4209 41.5409 54.244 38.9929L52.5307 35.256C52.1845 34.501 51.9942 33.6894 51.9769 32.8401C51.9422 32.0097 52.0807 31.1604 52.3749 30.3866L54.0191 26.0079C54.3479 24.9509 54.9882 24.0261 55.819 23.3844C56.667 22.7427 57.6708 22.3841 58.7092 22.3841C59.7476 22.3841 60.7514 22.7427 61.5994 23.3844C62.4474 24.0261 63.0705 24.9509 63.3993 26.0079L65.0781 30.3866C65.3723 31.1604 65.5107 31.9908 65.4934 32.8401C65.4761 33.6706 65.2857 34.501 64.9396 35.256L63.2435 38.9552C62.1878 41.22 61.8763 43.8246 62.3436 46.3159C62.8109 48.8072 64.057 51.0532 65.8396 52.7141L66.0126 52.8839C67.3972 54.1296 69.0413 54.9789 70.8066 55.3564C72.5719 55.7338 74.4064 55.6017 76.1197 54.9978C77.6947 54.4504 79.1138 53.5256 80.2907 52.28L83.0424 49.4112C83.5963 48.8261 84.2712 48.3543 84.9981 48.0712C85.725 47.7692 86.5211 47.6559 87.2999 47.7126L91.6785 48.0712C92.7169 48.0712 93.7207 48.4486 94.5514 49.1092C95.3821 49.7698 96.0225 50.6946 96.3513 51.7515C97.0263 53.9786 98.7223 58.244 104.918 59.5086C106.701 59.7728 108.518 59.5652 110.197 58.8669C111.875 58.1685 113.364 57.0361 114.523 55.5451C115.683 54.0541 116.479 52.28 116.808 50.3926C117.137 48.5052 117.05 46.5235 116.496 44.6928L116.548 44.7683L116.635 44.6928Z"
                fill="#EC1D35"
              />
              <g clipPath="url(#clip0_7_148)">
                <path
                  d="M89.8956 61.1566C88.426 61.6855 87.0804 62.5354 85.9296 63.6498C84.7788 64.7643 83.8758 66.1053 83.2384 67.5975C83.2384 67.6731 83.1676 67.7486 83.1499 67.8242C82.1407 70.4686 82.1053 73.3963 83.026 76.0595C83.9643 78.7228 85.8057 80.9327 88.2136 82.236L91.6838 84.1626C92.392 84.5593 93.0117 85.1071 93.4897 85.7682C93.9854 86.4293 94.3218 87.1848 94.5166 87.997L95.5789 92.5869C95.8976 93.6446 95.8976 94.7968 95.5789 95.8735C95.2425 96.9312 94.6051 97.8756 93.7376 98.5178C92.87 99.1789 91.8431 99.5378 90.7808 99.5378C89.7185 99.5378 88.6739 99.1789 87.8064 98.5367L83.982 96.0623C83.3092 95.6279 82.725 95.0424 82.2646 94.3624C81.822 93.6635 81.5033 92.8891 81.3617 92.058L80.7066 87.997C80.3171 85.4848 79.1308 83.1805 77.3603 81.4616C75.5898 79.7428 73.3058 78.685 70.8979 78.4772H70.6678C67.9766 78.2695 65.3031 79.1383 63.1785 80.895C61.0539 82.6516 59.6375 85.1826 59.1948 87.997C57.6545 97.6679 65.9228 100.822 69.1274 101.257H69.4284C71.1989 101.37 72.9694 101.011 74.5806 100.237H74.6337L75.2003 99.9345L75.8377 99.5945C76.6875 99.1412 77.6436 98.9334 78.5997 98.9712C79.5558 99.0089 80.4764 99.3111 81.3086 99.8211L86.5493 103.221C87.2752 103.693 87.8949 104.317 88.3552 105.072C88.8155 105.828 89.0988 106.678 89.2051 107.584L89.3113 108.585C89.329 108.982 89.3821 109.379 89.4529 109.775C89.7716 111.683 90.5329 113.477 91.7015 114.989C92.8523 116.5 94.3573 117.671 96.0747 118.407C97.7921 119.144 99.6334 119.39 101.475 119.163C103.298 118.936 105.051 118.2 106.538 117.066C108.026 115.933 109.23 114.403 110.009 112.646C110.788 110.89 111.124 108.944 111 107.018C110.876 105.072 110.274 103.221 109.265 101.578C108.256 99.9534 106.875 98.6312 105.246 97.7056C104.91 97.5168 104.555 97.3656 104.201 97.2145L103.334 96.799C102.555 96.4212 101.882 95.8735 101.333 95.1746C100.784 94.4757 100.412 93.6635 100.218 92.7946L98.8012 86.5048C98.5888 85.5226 98.6065 84.5026 98.8544 83.5393C99.1199 82.576 99.598 81.6883 100.271 80.9705L100.784 80.4416C100.944 80.2905 101.085 80.1394 101.227 79.9694V79.9128C102.112 78.9117 102.82 77.7406 103.298 76.4751L103.369 76.2862V76.1917C104.007 74.454 104.237 72.5841 104.024 70.733V70.6574C102.572 59.5888 92.2149 60.2499 89.8956 61.1566Z"
                  fill="#402FFF"
                />
              </g>
              <defs>
                <clipPath id="clip0_7_148">
                  <rect
                    width="52"
                    height="58.5352"
                    fill="white"
                    transform="translate(59 60.7031)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </Col>
        <Col s={12} l={8}>
          <Flex direction="column" gap="2">
            <Text variant="display-3">
              {regionId === "0"
                ? "Федерация спортивного программирования"
                : regionId && getById(regionId)}
            </Text>
            <Text variant="body-3">{presenters.district}</Text>
          </Flex>
        </Col>
      </Row>
      <Flex gap={"4"} direction={{ xl: "row-reverse", s: "column" }}>
        <Col s="12" l={"6"}>
          {regionId === "0" ? null : (
            <>
              <Card
                type="container"
                view="raised"
                style={{
                  display: "flex",
                  padding: "1.5rem 2rem",
                }}
                spacing={{ mb: "5" }}
              >
                <Flex width={"100%"} direction={"column"} gap={"2"}>
                  {isLoading2 ? (
                    <Loader />
                  ) : error2 ? (
                    <Text variant="body-3">Произошла ошибка</Text>
                  ) : (
                    <>
                      <UserLabel
                        type="email"
                        size="m"
                        text={presenters.email}
                      />

                      {regionId !== "0" && payload?.region_id === regionId ? (
                        <>
                          <Text variant="header-1">Описание</Text>
                          <TextArea
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              setPresenters({
                                ...presenters,
                                description: e.target.value,
                              })
                            }
                            minRows={5}
                            maxRows={10}
                            value={
                              presenters.description || "Описание отсутствует"
                            }
                          />
                          <Button
                            onClick={async () => {
                              const url =
                                "/api/organizations/" +
                                regionId +
                                "/description";
                              const response = await fetch(url, {
                                method: "PUT",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token",
                                  )}`,
                                },
                                body: JSON.stringify({
                                  description: presenters.description,
                                }),
                              });
                              if (response.ok) {
                                add({
                                  theme: "success",
                                  name: "Успех",
                                  title: "Описание обновлено",
                                  autoHiding: 5000,
                                });
                              } else {
                                add({
                                  theme: "danger",
                                  name: "Ошибка",
                                  title: "Не удалось обновить описание",
                                  autoHiding: 5000,
                                });
                              }
                            }}
                          >
                            Обновить описание
                          </Button>
                        </>
                      ) : (
                        <>
                          {presenters.description && (
                            <>
                              <Text variant="header-1">Описание</Text>
                              <Text variant="body-1">
                                {presenters.description}
                              </Text>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Flex>
              </Card>
            </>
          )}
          <Text variant="display-1" style={{ marginBottom: ".5rem" }}>
            Представители
          </Text>
          <br />
          <br />
          <Flex direction="column">
            <Flex direction={"column"} gap={"2"}>
              {isLoading2 ? (
                <Loader />
              ) : error2 ? (
                <Text variant="body-3">Произошла ошибка</Text>
              ) : presenters.managers.length === 0 ? (
                <Text variant="body-3">Нет представителей</Text>
              ) : (
                presenters.managers.map((presenter: string, index: number) => {
                  console.log(presenter);
                  return (
                    <Card
                      type="container"
                      view="raised"
                      spacing={{ p: "3" }}
                      key={index}
                    >
                      <Flex alignItems="center">
                        <Avatar
                          icon={Person}
                          size="l"
                          theme="brand"
                          className={spacing({ mr: 3 })}
                          view="filled"
                        />
                        <Text variant="body-3">{presenter}</Text>
                      </Flex>
                    </Card>
                  );
                })
              )}
            </Flex>
          </Flex>
        </Col>
        <Flex direction={"column"} gap={"4"}>
          {/* @ts-ignore */}
          <Flex gap="1">
            <Button
              view={typeOfContent === "events" ? "action" : "normal"}
              size="l"
              onClick={() => {
                setSearchParams({ "type-of-content": "events" });
                setTypeOfContent("events");
              }}
            >
              Соревнования
            </Button>
            <Button
              view={typeOfContent === "teams" ? "action" : "normal"}
              size="l"
              onClick={() => {
                setSearchParams({ "type-of-content": "teams" });
                setTypeOfContent("teams");
              }}
            >
              Команды
            </Button>
            {regionId !== "0" && payload?.region_id === regionId ? (
              <>
                {/*
              <Button
                view={typeOfContent === "track" ? "action" : "normal"}
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "track" });
                  setTypeOfContent("track");
                }}
              >
                Отслеживание мероприятий
              </Button>
              <Button
                view={typeOfContent === "add_event" ? "action" : "normal"}
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "add_event" });
                  setTypeOfContent("add_event");
                }}
              >
                Добавить мероприятие
              </Button>
              <Button
                view={typeOfContent === "add_report" ? "action" : "normal"}
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "add_report" });
                  setTypeOfContent("add_report");
                }}
              >
                Добавить отчет
              </Button> */}
              </>
            ) : // @ts-ignore
            payload &&
              payload.roles?.length !== 0 &&
              (payload?.roles?.includes("fsp_staff") ||
                payload?.roles?.includes("root")) &&
              regionId === "0" ? (
              <>
                {/*<Button
                view={typeOfContent === "accept_events" ? "action" : "normal"}
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "accept_events" });
                  setTypeOfContent("accept_events");
                }}
              >
                Мероприятия
              </Button>
              <Button
                view={typeOfContent === "people" ? "action" : "normal"}
                size="l"
                onClick={() => {
                  setSearchParams({ "type-of-content": "people" });
                  setTypeOfContent("people");
                }}
              >
                Представители
              </Button>

								*/}

                <Button
                  view={typeOfContent === "analytics" ? "action" : "normal"}
                  size="l"
                  onClick={() => {
                    setSearchParams({ "type-of-content": "analytics" });
                    setTypeOfContent("analytics");
                  }}
                >
                  Аналитика
                </Button>
              </>
            ) : null}
            {/* @ts-ignore */}
            {/* regionId !== "0" &&
            payload?.roles?.includes("fsp_region_head") &&
            payload?.region_id === regionId && (
              <Button
                className={spacing({ ml: 1 })}
                view={typeOfContent === "people" ? "action" : "normal"}
                size="l"
                onClick={() => {
                  setTypeOfContent("people");
                }}
              >
                Представители
              </Button>
            )*/}
          </Flex>
          <Flex width={"100%"} direction={{ l: "row", s: "column-reverse" }}>
            {typeOfContent === "events" ? (
              <Col s="12" style={{ paddingRight: "1rem" }}>
                <EventsMainContent />
              </Col>
            ) : typeOfContent === "add_event" ? (
              <Col s="12">
                <AddEventMainContent />
              </Col>
            ) : typeOfContent === "add_report" ? (
              <Col s="12">
                <AddReportMainContent />
              </Col>
            ) : typeOfContent === "people" ? (
              <Col s="12">
                <PeopleMainContent />
              </Col>
            ) : typeOfContent === "accept_events" ? (
              <Col s="12">
                <AcceptEventsMainContent />
              </Col>
            ) : typeOfContent === "track" ? (
              <Col s="12">
                <TrackEventsMainContent />
              </Col>
            ) : typeOfContent === "analytics" ? (
              <Col s="12" style={{ paddingRight: "1rem" }}>
                <AnalitycsMainContent />
              </Col>
            ) : (
              typeOfContent === "teams" && (
                <Col s="12">
                  <TeamsMainContent />
                </Col>
              )
            )}
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

interface RegionalProps {
  navigation: NavigationData;
  navigation_custom: CustomItems;
}
const RegionPage = ({ navigation, navigation_custom }: RegionalProps) => {
  return (
    <PageConstr
      Component={MainContent}
      navigation={navigation}
      navigation_custom={navigation_custom}
    />
  );
};

export default RegionPage;
