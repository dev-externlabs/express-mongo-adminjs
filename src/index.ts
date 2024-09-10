import App from './app';


const app = new App();

const startServer = async(): Promise<void> => {
  await app.start();
};

startServer();
