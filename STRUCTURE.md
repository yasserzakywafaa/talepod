# Project Folder Structure

    project-name
    ├── web
    │   ├── build
    │   ├── node_modules
    │   ├── public
    │   ├── src
    │   ├   ├── application
    │   ├   ├── assets
    │   ├   ├── components
    │   ├   ├── pages
    │   ├   ├── shared
    │   ├   │    |── domain
    │   ├   │    |── hooks
    │   ├   │    |── utils
    │   ├   ├── App.tsx
    │   ├   └── index.tsx
    |   ├── .env
    |   ├── package.json
    |   ├── tsconfig.json
    |   └── yarn.lock
    ├── server
    │   ├── node_modules
    │   ├── assets
    │   │   ├── audio
    │   │       └── textToSpeech
    │   ├── src
    │   │   ├── controllers
    │   │   ├── models
    │   │   │   ├── endpoints.ts
    │   │   │   └── mongodb
    │   │   │       ├── audioFile.ts
    │   │   │       └── index.ts
    │   │   ├── routes
    │   │   │   └── openaiRoutes.ts
    │   │   ├── config.ts
    │   │   └── server.ts
    │   ├── .env
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── yarn.lock
    ├── deploy
    │   ├── .env
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── yarn.lock
    │   └── server
    ├── templates
    │   ├── web
    │   └── server
    ├── node_modules
    ├── .dockerignore
    ├── .env
    ├── .gitignore
    ├── .gitlab-ci.yml
    ├── package.json (if needed)
    ├── README.md
    ├── tsconfig.json (if needed)
    ├── STRUCTURE.md
    └── yarn.lock
