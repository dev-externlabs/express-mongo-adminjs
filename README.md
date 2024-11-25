# RESTful API Node Server


## Project Structure

```
├── 📄CHANGELOG.md
├── 📄Dockerfile
├── 📄README.md
├── 📂config
│   ├── 📄 config.ts
│   ├── 📄 logger.ts
│   ├── 📄 morgan.ts
│   ├── 📄 passport.ts
│   ├── 📄 roles.ts
│   ├── 📂strategies
│   └── tokens.ts
├── 📄ecosystem.config.json
├── 📄jest.config.js
├── 📄package-lock.json
├── 📄package.json
├── 📂src
│   ├── 📄app.ts
│   ├── 📂controllers
│   ├── 📂docs
│   ├── 📄index.ts
│   ├── 📂interfaces
│   ├── 📂middlewares
│   ├── 📂models
│   ├── 📂routes
│   ├── 📂services
│   ├── 📂utils
│   └── 📂validations
├── 📂tests
│   ├── 📂fixtures
│   ├── 📂integration
│   ├── 📂unit
│   └── 📂utils
└── 📄tsconfig.json

```

## Notes
### ENV Updation

Whenever you add a env variable make sure to update the validation in config.ts as well.

[Swagger Link](http://localhost:3000/v1/docs)

<br>
<br>


## Dev mode
[how-to-watch-and-reload-ts-node-when-typescript-files-change](https://stackoverflow.com/questions/37979489/how-to-watch-and-reload-ts-node-when-typescript-files-change) going through this thread and after reading this in tsx

>Type checking is important but it can be time-consuming and expensive to do on every run.... Modern IDEs like VSCode provide real-time type checking via IntelliSense, reducing the need for manual type checks.

I think it's good to leave type checking on vs-code, without being it a blockage in development.

18 directories, 16 files
