# Telemetry Server

This is a telemetry server written in Node.js that collects data from the redstone tools mod so we can better understand how the mod is being used

## Getting Started

### Installation

To get started with the telemetry server, you'll need to clone the repository:

`git clone https://github.com/RedstoneTools/telemetry.git`

Then, navigate to the project directory and install the dependencies:

`cd telemetry`
`pnpm install` (Make sure pnpm is installed `npm i -g pnpm`)

### Configuring

Next, copy the config template at `src/config.template.json` to `src/config.json`:

`cp src/config.template.json src/config.json`

Then configure the options with your preferred text editor

### Usage

Now build the project with:

`pnpm build`

And run with:

`pnpm start`

## Routes

All routes start at `/api/v1/`

### POST /session/create

`/session/create` creates a new session using Mojang's authentication system, it requires the client to send:

| Field           | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| serverId        | The uuid of the player without hyphens                        |
| selectedProfile | The uuid of the player with hyphens                           |
| accessToken     | A JWT given to the client from mojang's authentication system |

this route returns a token that the user can use to authenticate themselves in all other routes, the token will expire in 5 minutes (unless configured otherwise) after it has been created

### POST /session/refresh

`/session/refresh` refreshes the user's session and gives them a new token it requires the same authentication information as session/create but also takes the client's old token to prolong the session

### POST /command

`/command` reports to the telemetry server when a command is run it takes the client's token as well as 1 other field

| Field   | Description                   |
| ------- | ----------------------------- |
| command | The command that the user ran |

### POST /exception

`/exception` reports whenever there is an exception in the mod as well as the token it has 2 other fields

| Field       | Description                                       |
| ----------- | ------------------------------------------------- |
| is_fatal    | A boolean which states if the exception was fatal |
| stack_trace | The stack trace which the exception made          |
