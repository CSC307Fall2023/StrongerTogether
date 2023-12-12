This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, get a database running. You will need Docker installed on your machine. 

```bash
docker-compose up
```

Extra Note on error messages:

If running docker-compose up causes this error message:
```
Error response from daemon: driver failed programming external connectivity on endpoint strongertogether-db-1 (3e34b4cc5af11e1260570363f3db3c67af670fc30cff08e2fa2117114ffbcb3c): Bind for 0.0.0.0:5432 failed: port is already allocated
```
Check out the StackOverFlow if needed or follow the steps below: [Docker Error](https://stackoverflow.com/a/63819488)

Follow these steps to fix it:

**Step-1: check all the running containers using the command:**

```
docker ps
```

**Step-2: Find out the container id of the container which is running on the same port, you are trying to reach.**

**Step-3: Stop the container which one is running on the same port using this command:**

```
docker stop <container id>
```

**Step-4: Compose Docker again**
```bash
docker-compose up
```

Then, make sure all your node modules are installs

```bash
npm install
```

Next, make sure you modify the .env file to have the correct information for database connection. 

Make sure the database is migrated. 

```bash
npx prisma migrate dev
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

- [Prisma Documentation](https://www.prisma.io/docs/getting-started) - the docs for the ORM we are using. 

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Look at your database

```bash
npx prisma studio
```


