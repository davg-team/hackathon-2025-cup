# Стили

В АИС «Федерация Спортивного Программирования» используется комбинированный подход к стилизации компонентов, включающий глобальные стили, компонентные CSS и библиотеку UI-компонентов.

## Глобальные стили

Основные стили располагаются в директории `src/app/styles/` и включают следующие файлы:

### reset.css

Сброс стандартных стилей браузера для обеспечения единообразного отображения:

```css
:root {
  font-size: 1em;
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}
```

### index.css

Импортирует reset.css и определяет базовые стили для общих элементов:

```css
@import "./reset.css";

.active {
  text-decoration: underline;
}

img {
  object-fit: cover;
}
```

### styles.css

Основной файл стилей, содержащий настройки для тем (светлая и тёмная) и подключение шрифтов:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
```

Файл содержит обширные CSS-переменные для цветовых схем, определенные для обеих тем:

```css
.g-root_theme_light {
    --g-font-family-sans: 'JetBrains Mono';
    --g-font-family-monospace: 'Ubuntu Mono', 'Menlo', 'Monaco', 'Consolas', 'Ubuntu Mono', 'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', 'Courier', monospace;
    
    --g-color-private-white-50: rgba(255,255,255,0.05);
    /* ... более сотни цветовых переменных ... */
    --g-color-text-link-visited-hover: var(--g-color-private-purple-800-solid);
}

.g-root_theme_dark {
    --g-font-family-sans: 'JetBrains Mono';
    --g-font-family-monospace: 'Ubuntu Mono', 'Menlo', 'Monaco', 'Consolas', 'Ubuntu Mono', 'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', 'Courier', monospace;
    
    --g-color-private-white-50: rgba(255,255,255,0.05);
    /* ... более сотни цветовых переменных ... */
    --g-color-text-link-visited-hover: var(--g-color-private-purple-850-solid);
}
```

## Компонентные стили

Некоторые компоненты содержат собственные CSS-файлы для стилизации. Например, компонент `LoginButton` имеет свой файл стилей:

### features/components/LoginButton/index.css

```css
.modal-container {
  width: 500px;
  padding: 1rem;
}

.full-width {
  width: 100%;
}

.popup__item {
  min-height: 55px;
  max-height: 55px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 3px solid var(--g-color-text-link);
  padding: .3rem;
  border-radius: 1rem;
  transition: all .3s;
}

/* ... другие стили ... */
```

## UI-библиотека @gravity-ui

Проект интенсивно использует компоненты и стили из библиотеки @gravity-ui:

### Импорт стилей библиотеки

```tsx
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
```

### Компоненты с предустановленными стилями

Проект использует множество готовых компонентов из @gravity-ui:
- Button, Card, Text, Icon - базовые компоненты интерфейса
- Flex, Container, Row, Col - компоненты для построения лейаута
- Modal, Popup - компоненты для отображения всплывающих окон
- Loader - компонент загрузки
- UserLabel - компонент для отображения информации о пользователе
- Toaster - система уведомлений

### Пример использования компонентов с готовыми стилями

```tsx
<Card theme="normal">
  <Flex direction="column" spacing={{ p: 3 }}>
    <Flex justifyContent="center" alignItems="center" gap="3">
      <Text variant="display-2">Создание команды</Text>
      <Button onClick={() => setOpenModal1(false)}>
        <Icon data={/* ... */} />
      </Button>
    </Flex>
    {/* ... содержимое карточки ... */}
  </Flex>
</Card>
```

## Динамическое управление темами

Приложение поддерживает переключение между светлой и тёмной темой:

```tsx
const [theme, setTheme] = useState<"light" | "dark">("light");

useEffect(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  } catch (error) {
    console.error("can't get theme from localstorage", error);
  }
}, []);

const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  try {
    localStorage.setItem("theme", newTheme);
  } catch (error) {
    console.error("can't save them in localstorage", error);
  }
};
```

Тема применяется с помощью провайдеров:

```tsx
<ThemeProvider theme={theme}>
  <PageConstructorProvider theme={theme === "light" ? Theme.Light : Theme.Dark}>
    {/* ... содержимое приложения ... */}
  </PageConstructorProvider>
</ThemeProvider>
```

## Специальные визуальные эффекты

Проект включает специальный визуальный эффект "снег", подключаемый через CDN:

```html
<link href="https://cdn.jsdelivr.net/gh/Alaev-Co/snowflakes/dist/snow.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/Alaev-Co/snowflakes/dist/Snow.min.js"></script>
```

И управляемый через React:

```tsx
const toggleSnow = (enable: boolean) => {
  if (enable) {
    snowInstance.current = new Snow();
  } else {
    if (snowInstance.current) {
      const snowflakesBox = document.querySelectorAll(".snowflakes-box");
      const snowballBox = document.querySelectorAll(".snowball-box");
      snowflakesBox.forEach((item) => item.remove());
      snowballBox.forEach((item) => item.remove());
      snowInstance.current = null;
    }
  }
};
```

## Responsive design

В проекте используются компоненты с поддержкой адаптивного дизайна:
- `Container`, `Row`, `Col` - сетка для размещения элементов
- `Flex` с параметрами `gap`, `direction`, `wrap` для гибкого управления расположением
- Медиа-запросы для адаптации под различные устройства

## Стилизация конкретных элементов

### Кнопки и ссылки

Использование готовых компонентов с возможностью настройки:

```tsx
<Button 
  view="action"
  size="l"
  disabled={isLoading}
  onClick={handleClick}
>
  Создать
</Button>

<LinkCustom to="/path" classN="additional-class">
  Текст ссылки
</LinkCustom>
```

### Карточки событий

```tsx
<Card
  view="filled"
  maxWidth={"340px"}
  width={"max"}
  className={spacing({ p: 3 })}
>
  <Flex direction={"column"} height={"100%"} justifyContent={"space-between"}>
    {/* Содержимое карточки */}
  </Flex>
</Card>
```
