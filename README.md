# JRequioma eLearning
Arcanys eLearning platform created with Vue 3, [Mock Service Worker](https://mswjs.io/), and [mswjs/data](https://github.com/mswjs/data)

## Dummy Accounts
On startup, there are three accounts that will be created with the help of mswjs/data that would persist data. These are:

Email | Password | Role
--- | --- | ---
johndoe@test.com | pass | admin
jamessmith@test.com | pass | instructor
adamsilver@test.com | pass | student

Refer to [setup data file](/elearning/src/mocks/db.ts) for more information on the relationship of models.

## Login
![Login](/readme-images/login.png)

## Create an account
![Create an account](/readme-images/create-account.png)

## Admin view
![Admin view](/readme-images/admin.png)
## Instructor view
![Instructor view](/readme-images/instructor.png)

## Student view
![Student view](/readme-images/student.png)

### Student modules
![Student modules](/readme-images/modules.png)