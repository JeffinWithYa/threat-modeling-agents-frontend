# Threat Modeling with Multi-Agent Generative AI - Get help running your threat modeling exercises

![](https://github.com/JeffinWithYa/threat-modeling-agents-frontend/blob/main/dfd_demo_edited.gif)


This is an open source tool that uses the Autogen multi-agent framework and GPT4 to help working professionals quickly generate data flow diagrams, attack trees, and threat modeling reports from a description of their app architectures.

Features:

- Provide a description of your app architecture, and the tool will generate a data flow diagram using PyTM and Graphviz
- Identify the various components of your app from its description, and understand the vulnerabilities on each component using the STRIDE framework
- Get PDF reports summarizing the STRIDE vulnerabilities on your app's components
- Get PDF reports that include perspectives from technical and non-technical AI stakeholders, representing these roles in a threat modeling exercise

### Prerequisites

### Set up the microservices. See threat-model-agents (below) repo for details

```shell
git clone https://github.com/JeffinWithYa/threat-modeling-agents
```


**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/JeffinWithYa/threat-modeling-agents-frontend
```

### Install packages

```shell
npm i
```

### Setup .env file. 


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

OPENAI_API_KEY=

DATABASE_URL=

NEXT_PUBLIC_APP_URL="http://localhost:3000"

APP_RUNNER_KEY=

DFD_API_URL=
DFD_POLL_URL=
STRIDE_POLL_URL=
STRIDE_REPORT_API_URL=

ATTACK_TREE_API_URL=
ATTACK_TREE_POLL_URL=
ROLES_REPORT_API_URL=
ROLES_POLL_URL=

LAST_MESSAGE_STRIDE_API_URL=
LAST_MESSAGE_ROLES_API_URL=
LAST_MESSAGE_DFD_API_URL=
```

### Setup Prisma

Add MySQL Database (PlanetScale, etc.)

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```
