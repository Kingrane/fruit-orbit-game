# AGENTS.md — Фруктовая Орбита

Краткий гайд для агентов и разработчиков по проекту. Игра под **Яндекс Игры**.

## Что это

**Фруктовая Орбита** — casual merge-игра в духе Suika Game, но с **круговым полем** и гравитацией к центру.

- Игрок целится вокруг круга (мышь / тап) и запускает фрукт внутрь.
- Два одинаковых фрукта сливаются в следующий тир.
- Комбо за цепочки слияний.
- Проигрыш: фрукты слишком долго за пунктирной «опасной» зоной (~3 сек).
- Рекорд, монеты, магазин скинов, реклама через Yandex Games SDK.

Название в каталоге / UI: **Фруктовая Орбита** (EN: **Fruit Orbit**).

## Стек и структура

| Файл / папка | Назначение |
|---|---|
| `index.html` | Разметка: HUD, меню, game over, магазин |
| `styles.css` | UI, модалки, mobile / safe-area / landscape |
| `game.js` | Вся логика, физика, SDK, сейвы, магазин, реклама |
| `fruits/*.svg` | Спрайты 11 фруктов |
| `rules.md` | Чек-лист модерации Яндекс Игр (источник правды по платформе) |
| `game.md` | Исходный бриф / ТЗ |
| `working.js` | Старый черновик, **не подключать** в прод |

Зависимости (CDN):

- Matter.js — физика
- Yandex Games SDK v2 — init, ads, player data, i18n

Локально без SDK игра **должна** работать (fallback: rewarded «как будто посмотрели»).

## Геймплей (ядро)

- Физика: `Matter.Engine` с `gravity: 0`, сила к `(centerX, centerY)`.
- Тиры: cherry → strawberry → grape → mandarin → persimmon → apple → pear → peach → pineapple → melon → watermelon.
- Очки за merge = `points` тира × комбо-множитель.
- Спавн: случайные 0–3 тир (мелкие).
- Продолжить за RV: **1 раз за партию**, фрукты с края стягиваются к центру.

## Монеты и магазин

### Как начисляются монеты

1. **За очки (проигрыш)** — `floor(score / 50)`. На баланс при «Заново» / «В меню» с game over.  
2. **Пауза (бургер)** — «Продолжить» = resume; «В меню» = монеты **в 2 раза меньше** + партия считается.  
3. **x2 монеты (RV)** на game over — удваивает полную награду.  
4. **Магазин RV** — `+15` 🪙 за рекламу.  
5. **Continue (RV)** — 1× extra chance, без монет.

### Сейв

- Ключ localStorage: `fruit_orbit_save`  
  (`bestScore`, `coins`, `ownedSkins`, `equippedSkins`, `soundEnabled`, `gamesPlayed`)
- Если есть `ysdk.getPlayer` → `player.setData` / `getData` (гость тоже ок, плюс local).

### Скины

- На **каждый** фрукт свои покупки/экип.
- Каталог: classic (0), gold, ice, neon, shadow, candy.
- Цена: `base * (1 + fruitIndex * 0.45)` (base 120–520).
- Визуал: canvas / CSS `filter` + glow, без отдельных SVG.
- Табы фруктов: скролл + кнопки ‹ ›.

## Яндекс Игры (обязательное)

Сверяться с `rules.md`. В коде уже:

- `YaGames.init()`, `LoadingAPI.ready()` когда видно меню
- `GameplayAPI.start/stop`
- `game_api_pause` / `game_api_resume`
- Звук паузится при скрытии вкладки / рекламе
- Interstitial (`showFullscreen`) каждые 3 завершённые партии (после меню/рестарта с game over)
- Rewarded: continue, x2 монеты, +50 в магазине — с явным текстом награды
- i18n `ru` / `en` по `environment.i18n.lang`
- Без внешних платежей, без блокировки игры логином

### При правках рекламы

- Rewarded = **экстра** (монеты, 1 continue), не единственный способ играть.
- Во время ad: пауза геймплея + mute audio.
- Не менять вид системных блоков рекламы.

## UI-экраны

- **Старт**: play, shop, how-to, баланс монет
- **Игра**: score / best / coins, next fruit, mute, menu
- **Game over**: continue (RV), again, x2 coins (RV), menu
- **Магазин**: +50 ad, табы фруктов, список скинов buy/equip

## Мобилка

- `viewport-fit=cover`, safe-area, `100dvh`
- Touch aim + shoot, `touch-action: none`, без выделения/context menu
- Компактный HUD, скролл модалок, landscape-правки

## Локальный запуск

```bash
# из корня проекта (пример)
npx --yes serve -l 3000
# или
python -m http.server 5500
```

Открыть `http://localhost:PORT/`.

**Важно:** для телефона в одной Wi‑Fi сети — см. раздел ниже (не GitHub Pages обязательно).

### Тест на телефоне (тот же Wi‑Fi)

1. ПК и телефон в **одной** Wi‑Fi (не гостевая сеть с client isolation).
2. На ПК поднять HTTP-сервер в папке проекта (см. выше).
3. Узнать IP ПК: `ipconfig` → IPv4 (часто `192.168.x.x`).
4. На телефоне в браузере: `http://192.168.x.x:PORT/`
5. Windows Firewall: разрешить входящие на этот порт (Private network).

GitHub Pages / любой хостинг — только если нужен доступ **не** из LAN. Для Яндекс Игр билд заливается **в консоль разработчика** архивом (`index.html` в корне).

## Чего не ломать без нужды

- Порядок `LoadingAPI.ready` (только когда меню реально доступно).
- Формулу сейва / ключи localStorage (игроки потеряют прогресс).
- Имена файлов без кириллицы/пробелов (требование архива Я.Игр).
- Размер сборки &lt; 100 МБ.

## Полезные константы в `game.js`

- `COIN_SCORE_DIVISOR = 50`
- `SHOP_AD_COINS = 15`
- Монеты за проигрыш: `floor(score / 50)`; с паузы выход: половина
- Скины: base prices 120–520 × `(1 + fruitIndex * 0.45)`
- Interstitial: `gamesPlayed % 3 === 0`
- Continue: `continueUsed` один раз за `startGame`
- Пауза: `isPaused` + overlay `#pause-overlay`

## Жанр / промо (черновик каталога)

- Жанр: puzzle / arcade / merge
- Управление: тап/мышь вокруг круга → запуск фрукта
- Endless highscore + persistent best + coins/skins
