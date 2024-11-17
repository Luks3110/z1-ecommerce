import { createClient } from 'redis';
import { injectable } from "tsyringe";

@injectable()
export default class Redis {
    private client: ReturnType<typeof createClient>;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        return new Error('Redis connection retries exhausted');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.on('connect', () => console.log('Redis Client Connected'));

        this.connect();
    }

    private async connect() {
        await this.client.connect();
    }

    public getClient() {
        return this.client;
    }
}
