import json
import logging
import time

import requests
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Create a logger
logger = logging.getLogger(__name__)

regions = {
    "г. Москва": "77",
    "Белгородская область": "31",
    "Брянская область": "32",
    "Владимирская область": "33",
    "Воронежская область": "36",
    "Ивановская область": "37",
    "Калужская область": "40",
    "Костромская область": "44",
    "Курская область": "46",
    "Липецкая область": "48",
    "Московская область": "50",
    "Орловская область": "57",
    "Рязанская область": "62",
    "Смоленская область": "67",
    "Тамбовская область": "68",
    "Тверская область": "69",
    "Тульская область": "71",
    "Ярославская область": "76",
    "Республика Адыгея": "1",
    "Республика Калмыкия": "8",
    "Краснодарский край": "23",
    "Астраханская область": "30",
    "Волгоградская область": "34",
    "Ростовская область": "61",
    "город Севастополь": "92",
    "Республика Крым": "91",
    "Республика Карелия": "10",
    "Республика Коми": "11",
    "Архангельская область": "29",
    "Калининградская область": "39",
    "Ленинградская область": "47",
    "Мурманская область": "51",
    "Новгородская область": "53",
    "Псковская область": "60",
    "Ненецкий автономный округ": "83",
    "Вологодская область": "35",
    "г. Санкт Петербург": "78",
    "Республика Саха-Якутия": "14",
    "Камчатский край": "41",
    "Приморский край": "25",
    "Хабаровский край": "27",
    "Амурская область": "28",
    "Магаданская область": "49",
    "Республика Бурятия": "3",
    "Забайкальский край": "75",
    "Сахалинская область": "65",
    "Еврейский АО": "79",
    "Чукотский АО": "87",
    "Республика Алтай": "4",
    "Республика Тыва": "17",
    "Республика Хакасия": "19",
    "Алтайский край": "22",
    "Красноярский край": "24",
    "Иркутская область": "38",
    "Кемеровская область - Кузбасс": "42",
    "Новосибирская область": "54",
    "Омская область": "55",
    "Томская область": "70",
    "Курганская область": "45",
    "Свердловская область": "66",
    "Тюменская область": "72",
    "Челябинская область": "74",
    "Ханты-Мансийский автономный округ – Югра": "86",
    "Ямало-Ненецкий АО": "89",
    "Республика Башкортостан": "2",
    "Республика Марий Эл": "12",
    "Республика Мордовия": "13",
    "Республика Татарстан": "16",
    "Удмуртская Республика": "18",
    "Чувашская Республика": "21",
    "Кировская область": "43",
    "Нижегородская область": "52",
    "Оренбургская область": "56",
    "Пензенская область": "58",
    "Пермский край": "59",
    "Самарская область": "63",
    "Саратовская область": "64",
    "Ульяновская область": "73",
    "Республика Дагестан": "5",
    "Республика Ингушетия": "6",
    "Кабардино-Балкарская Республика": "7",
    "Карачаево-Черкесская Республика": "9",
    "Республика Северная Осетия - Алания": "15",
    "Ставропольский край": "26",
    "Чеченская Республика": "20",
    "Донецкая Народная Республика": "93",
    "Луганская Народная Республика": "94",
    "Запорожская область": "90",
    "Херсонская область": "95",
}


logger.info("parsing data")
r = requests.get("https://fsp-russia.ru/region/regions/")
soup = BeautifulSoup(r.text, "html.parser")

html_content = r.text

soup = BeautifulSoup(html_content, "html.parser")

regions_with_district_name = []

for item in soup.find_all(class_="accordion-item"):
    header = item.find("h4")
    if header:
        district_name = header.text.strip()
        region = (
            item.find("div", class_="cont sub")
            .find("p", class_="white_region")
            .text.strip()
        )
        leader = (
            item.find("div", class_="cont ruk")
            .find("p", class_="white_region")
            .text.strip()
        )
        contacts = (
            item.find("div", class_="cont con")
            .find("p", class_="white_region")
            .text.strip()
        )
        regions_with_district_name.append(
            {
                "district": district_name,
                "region": region,
                "manager": leader,
                "email": contacts,
            }
        )


regions_full = []

for contact in soup.find_all(class_="contact_td"):
    region_elem = contact.find(class_="cont sub")
    leader_elem = contact.find(class_="cont ruk")
    contact_elem = contact.find(class_="cont con")

    region = (
        region_elem.find("p", class_="white_region").text.strip()
        if region_elem
        else "Не указано"
    )
    leader = (
        leader_elem.find("p", class_="white_region").text.strip()
        if leader_elem
        else "Не указано"
    )
    contact_info = (
        contact_elem.find("p", class_="white_region").text.strip()
        if contact_elem
        else "Не указано"
    )

    regions_full.append({"region": region, "manager": leader, "email": contact_info})
regions_full = regions_full[1:]


districts = []

for i in range(len(regions_with_district_name)):
    z = i + 1
    if z != len(regions_with_district_name):
        districts += [
            (
                regions_with_district_name[i]["district"],
                regions_with_district_name[z]["region"],
            )
        ]
    else:
        z -= 1
        districts += [(regions_with_district_name[i]["district"], "")]


ready = []

for district in districts:
    for region in regions_full:
        if region["region"] != district[1] and region.get("district") == None:
            ready += [
                {
                    "district": district[0],
                    "region": region["region"],
                    "managers": [region["manager"]],
                    "email": region["email"],
                }
            ]
        else:
            regions_full = regions_full[regions_full.index(region) :]
            break


URL = "https://fsp-platform.ru/api/organizations/?"

logger.info("start updating organizations")
for region in ready:
    region["id"] = regions[region["region"]]
    logger.info(region)
    response = requests.post(URL, data=json.dumps(region), verify=False)
    time.sleep(0.5)
    if response.status_code != 200:
        logger.error(
            f"Error creating/updating organization {region['region']}: {response.text}"
        )

logger.info("finished updating organizations")
