import { app } from "./app"
import { env } from 'process';
import * as dotenv from 'dotenv';
import * as path from 'path';

const environment = env.NODE_ENV || 'local';
dotenv.config({ path: path.join(__dirname, `../../env/.env.${environment}`) });

const port = 3000;
app.listen(port, () => {
    console.log(environment)
    console.info(`listening on http://localhost:${port}`);
});