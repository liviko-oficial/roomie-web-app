# Liviko Backend

## api docs

The API documentation is at src/aip-docs

## Quick start

### Pre-requisites

- Have `bun` already install, if you don't have it you can download it at the official [bun site](http://localhost:300)
- Set up MongoDB locally, you can either do it with docker, you can download it here [docker for windows](https://docs.
  docker.com/desktop/setup/install/windows-install/) [docker for windows](https://docs.docker.com/desktop/setup/install/mac-install/)
  or at the
  official [mongodb site](https://www.mongodb.com/try/download/community)
- Have a `.env.local` at `/server/` directory, you can set it up by:
    1) Copy the `.env.example` file into a new file call `.env.local`.
    2) Change the value of `DB_URL` to your MongoDB database url with the following form
       `mongodb://<user>:<password>@mongodb:<port>/<database>`.
  > If you need to develop any additional services (i.e. email service) ask the administrators for the
  > corresponding `api key`.

### Steps

1. Clone the repository and cd to the server (back end)

    ```shell
    git clone git@github.com:liviko-oficial/roomie-web-app.git
    cd rommie-web-app/server
    ```

2. Install dependencies and run project (make sure you have the pre-requisites)

    ```shell
    bun install 
    bun run dev:server
    ```
   
