# Mercadito

Creation of an ecommerce website from scratch using:
* [React](https://reactjs.org/) - Javascript Library for building user interfaces
* [Nextjs](https://nextjs.org/) - React framework for server side rendered applications 
* [GraphQL](https://graphql.org/) - GraphQL is a query language for APIs 
* [Apollo](https://www.apollographql.com/) - A platform for providing a communication layer that seamlessly connects application clients to back-end services.

Used external services:
* [Cloudinary](https://cloudinary.com) - image hosting
* [Prisma](https://www.prisma.io/) - Database ORM / GraphQL Server
* [Mailtrap](https://mailtrap.io/) - SMTP server for email testing
* [Stripe](https://stripe.com/) - Service for online payments. To make testing transaction you can use the following [card numbers](https://stripe.com/docs/testing#cards)

## Available Commands

In the `backend` directory you can run the following command:
### `npm run dev`
Starts the backend server

In the `frontend` directory you can run the following command:
### `npm run dev`
Runs the application in development mode

## Notes
To avoid creating a search component from scratch, I used [Downshift](https://github.com/downshift-js/downshift), which was a nice and accessible solution.

There was an issue deploying the react-app in heroku, since apps cannot set cookies for *.herokuapp.com. So whenever I wanted to access the frontend of my app, it just displayed a Heroku error page and on the heroku logs it just showed multiple requests with a connection rejected.
On the other hand, deploying the app on [now.sh](https://zeit.co/) worked like a charm.
A [thread](https://github.com/apollographql/apollo-client/issues/4193) on github helped me to fix this issue and I was able to deploy both apps on [`heroku`](https://mercaditomx.herokuapp.com) and [`now`](https://zeit.co/pakman198/frontend/jyamgh4dy).

Another interesting thing was deploying the `graphql-yoga` server (`backend` folder) and the `react app` as if they were in different repositories.
You can actually have everything under the same repo and treat subfolders as if they were different repos by usign `git subtree`. I ended up using a solution form [stackoverflow](https://stackoverflow.com/a/28904116/3818768) since i was having issues running the command.

##### This is the project for the [Advanced React & GraphQL](https://AdvancedReact.com) course by [Wes Bos](https://WesBos.com/).

