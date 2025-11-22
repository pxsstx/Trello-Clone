แน่นอน! ผมจัดให้เป็นตัวอย่าง README.md แบบครบขั้นตอนสำหรับโปรเจกต์ Next.js ที่ใช้ Docker Compose, Prisma, Bun runtime หลังจาก clone มาจาก GitHub:

# Project Name

> Short description of your project

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the Project](#running-the-project)
- [Docker](#docker)
- [Prisma](#prisma)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Requirements

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) runtime
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
```

2. Install dependencies using Bun:

```bash
bun install
```

Or, if you use npm:

```bash
npm install
```

---

## Environment Variables

Create a .env file in the root directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your_jwt_secret"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Adjust the values according to your local setup.

---

Database (Prisma) 1. Generate Prisma client:

```bash
bun prisma generate
```

    2.	Apply migrations:

```bash
bun prisma migrate dev
```

    3.	Check the database status:

```bash
bun prisma db pull
bun prisma studio
```

---

## Running the Project

1. Start the development server:

```bash
bun dev
```

Or with npm:

```bash
npm run dev
```

2.  Open your browser:

```bash
http://localhost:3000
```

---

## Docker

1. Build and start containers:

```bash
docker-compose up -d --build
```

2. Check running containers:

```bash
docker ps
```

3. Stop containers:

```bash
docker-compose down
```

---

## Prisma + Docker

If you are using PostgreSQL via Docker Compose:

```bash
docker-compose exec db psql -U youruser -d yourdatabase
```

Then you can run Prisma commands inside the container.

---

## Scripts

_Script Description_

**bun dev** - Run Next.js in development

**bun build** - Build Next.js app

**bun prisma:generate** - Generate Prisma client

**bun prisma:migrate** - Apply database migrations

**bun prisma:studio** - Open Prisma Studio UI

---

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit changes: git commit -m "Add new feature"
4. Push to branch: git push origin feature/your-feature
5. Create a Pull Request

---
