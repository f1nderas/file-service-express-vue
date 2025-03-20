# file servie

## Поднимаем бекенд

```bash
cd backend
cp .env.example .env
```

### Создание бд черзе docker

```bash
docker-compose up --build -d
```

```bash
npm i
npm run prisma:generate
npm run prisma:push
npm run dev
```

## Поднимаем frontend

```bash
cd ../frontend
npm i
npm run serve
```