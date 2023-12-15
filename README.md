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

Next, make sure you modify the .env file to have the correct information for database connection. The information is in our cover letter we submitted.

Make sure the database is migrated. 

```bash
npx prisma migrate dev
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Look at your database

```bash
npx prisma studio
```

# Login Credentials If you ned admin:
Create an account using calpoly.edu email, but if that doesn't work here is our admin account

Username: admin@calpoly.edu

Password: 12345678

