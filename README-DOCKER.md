# Docker — Build or Kill

Инструкция по запуску приложения **Build or Kill** в Docker-контейнере на вашем компьютере.

---

## Предварительные требования

Перед началом убедитесь, что на вашем компьютере установлен **Docker Desktop**:

- **Windows**: [Скачать Docker Desktop для Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- **macOS**: [Скачать Docker Desktop для macOS](https://docs.docker.com/desktop/setup/install/mac-install/)
- **Linux**: [Скачать Docker Desktop для Linux](https://docs.docker.com/desktop/setup/install/linux/)

После установки убедитесь, что Docker работает:

```bash
docker --version
```

Вы должны увидеть что-то вроде: `Docker version 27.x.x`

---

## Пошаговая инструкция

### Шаг 1. Клонируйте репозиторий

Откройте терминал (Terminal, PowerShell или Git Bash) и выполните:

```bash
git clone https://github.com/SSerg-dev/build-or-kill.git
cd build-or-kill
```

### Шаг 2. Соберите Docker-образ

Находясь в папке проекта, выполните:

```bash
docker build -t build-or-kill .
```

Эта команда:
- Скачает базовый образ Node.js 22 (Alpine Linux — лёгкий, ~170 МБ)
- Установит зависимости (`npm ci`)
- Скопирует код приложения в контейнер

Сборка занимает 30–60 секунд при первом запуске.

### Шаг 3. Запустите контейнер

```bash
docker run -d -p 5173:5173 --name build-or-kill build-or-kill
```

Параметры:
- `-d` — запуск в фоновом режиме
- `-p 5173:5173` — проброс порта (порт на вашем компьютере → порт в контейнере)
- `--name build-or-kill` — имя контейнера для удобства

### Шаг 4. Откройте приложение

Откройте браузер и перейдите по адресу:

```
http://localhost:5173
```

Вы увидите приложение **Build or Kill** — можете заполнить форму и нажать "Analyze idea".

---

## Полезные команды

### Проверить, что контейнер запущен

```bash
docker ps
```

Вы увидите строку с `build-or-kill` в столбце NAMES.

### Остановить контейнер

```bash
docker stop build-or-kill
```

### Запустить контейнер снова

```bash
docker start build-or-kill
```

### Посмотреть логи контейнера

```bash
docker logs build-or-kill
```

### Удалить контейнер

```bash
docker rm -f build-or-kill
```

### Пересобрать образ (после обновления кода)

```bash
git pull origin master
docker rm -f build-or-kill
docker build -t build-or-kill .
docker run -d -p 5173:5173 --name build-or-kill build-or-kill
```

---

## Использование с OpenAI API (опционально)

По умолчанию приложение работает в **mock-режиме** — генерирует тестовые ответы без реального AI. Чтобы использовать настоящий AI через OpenAI, передайте ваш API-ключ:

```bash
docker run -d -p 5173:5173 --name build-or-kill \
  -e OPENAI_API_KEY=sk-ваш-ключ-здесь \
  build-or-kill
```

---

## Запуск на другом порту

Если порт 5173 занят, используйте другой:

```bash
docker run -d -p 3000:5173 --name build-or-kill build-or-kill
```

Теперь приложение доступно по адресу: `http://localhost:3000`

---

## Устранение проблем

| Проблема | Решение |
|---|---|
| `port is already allocated` | Остановите процесс на порту 5173 или используйте другой порт (см. выше) |
| `docker: command not found` | Установите Docker Desktop (ссылки выше) |
| `Cannot connect to the Docker daemon` | Запустите Docker Desktop |
| Контейнер сразу останавливается | Посмотрите логи: `docker logs build-or-kill` |
