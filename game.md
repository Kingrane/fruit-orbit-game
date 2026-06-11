Act as an expert indie game developer and senior frontend engineer. Write a complete, fully functional, and single-file HTML/JS/CSS game inspired by "Suika Game" (Watermelon Game), but with a circular gravity mechanics as seen in modern viral variations.
The entire code must be в html css js можешь 3 файла сделать so it can be run instantly in any browser. Use HTML5 Canvas or Matter.js (via CDN) for physics if necessary, ensuring smooth physics and collision handling.
Visual Style & Aesthetic:
Cute, cozy, and minimalist aesthetic (similar to Japanese kawaii games).
Pastel background color palette (soft cream, light blue, or gentle pink gradient).
Fruits should look adorable: bright vibrant colors, round shapes, and cute simple vector faces (eyes and smiles) drawn on them.
Smooth animations when fruits merge or pop.
Core Gameplay Mechanics:
Playfield: A circular orbit or bounded circular area in the center of the screen, rather than a standard rectangular box. Gravity should pull objects toward the center point of this circle (orbital/center-directed gravity).
Controls: The player moves the mouse or taps around the central area. A dotted guide line should show the trajectory from the outer edge towards the inner area. Clicking/tapping releases the current fruit, shooting or dropping it into the playfield based on the aim.
Next Fruit Preview: Show a UI element at the top indicating the "Next" fruit that will be available to shoot.
Merge/Evolution Logic: When two identical fruits collide, they must instantly merge into a single, larger fruit of the next tier at the point of collision.
Score System: Merging fruits awards points based on their tier. Display the current "Score" and a persistent "Best Score" in a clean, minimalist font in the top-left corner.
Combo System: If multiple merges happen in quick succession, display a "COMBO x1.X" text animation near the merge event and multiply the points.
Game Over Condition: If the fruits stack up and cross the outer boundary line of the circular playfield for more than 3 seconds, the game ends. Display a beautiful "Game Over" overlay with a "Restart" button.
Fruit Evolution Hierarchy (from smallest to largest):
Cherry (Smallest, Red)
Strawberry (Pink)
Grape (Purple)
Dekopon/Mandarin (Orange)
Persimmon (Orange-Red)
Apple (Bright Red)
Pear (Yellow-Green)
Peach (Pink-Orange)
Pineapple (Yellow, Spiky shape)
Melon (Green)
Watermelon (Largest, Striped Green)
их всех сделаешь svg и в папку fruits типо положи
Please provide the complete code without placeholders, ensuring that assets (like faces or icons) are drawn using Canvas API vectors or clean CSS so no external image links break. styles for these fruits to ensure the application remains self-contained and lightweight. Ну и все картинки фруктиков сделай сам svg and ensure the interface is responsive and mobile-friendly.


Делаем игру для Яндекс игры, если есть возможность ищи информацию про платформу и документации и критерии чтобы игру пропустили.
У тебя также есть опыт интеграции Yandex Games SDK для монетизации (Interstitial и Rewarded Video).

Монетизация (Yandex Games SDK)
Fullscreen (Interstitial): Показывается перед возвращением в главное меню после игр (каждые 2-3 игры).
Rewarded Video: Кнопка на экране поражения/победы для умножения награды в 2 раза. Игра должна корректно ставить звук на паузу во время показа рекламы.
Интеграция яндекс игры обязательно, с переводом там типо по ru en как надо, и вся инициализация yandex games sdk