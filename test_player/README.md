Терминал игрока для теста сетевой игры "Хакатон ItStep 2023"
Для запуска нужен установленный node.js (https://nodejs.org)
Запуск производится из командной строки.

1. Перед первым запуском необходимо установить зависимости:

npm install

2. В файле config.json указать актуальный ip тестового сервера

3. Запуск:

npm start

4. Описание API для запросов от игры:

GET http://<this_host>:<port>/ready  - игроку приготовиться.
Ответ: код статуса 200

GET http://<this_host>:<port>/over   - игра окончена.
Ответ: код статуса 200

GET http://<this_host>:<port>/action?unit=N  - запрос действий от игрока, N - номер активного юнита.
Ответ: код статуса 200 + json-строка. Пример:
    {select: "auto"} или {"unit": 4, "action": {"type": "run", "angle": 45, "force": 100}}
    