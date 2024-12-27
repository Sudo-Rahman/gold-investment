import type {MetalsTimeSeries} from "$lib/model/MetalsTimeSeries";
import { writeFile, readFile, access,mkdir } from 'fs/promises';
import path from 'path';
import {format} from "date-fns";
import type {CurrentMetalsPrice} from "$lib/model/CurrentMetalsPrice";

export class CacheApiResponse{

    public async getMetalsTimeSeries() : Promise<MetalsTimeSeries | null> {

        const now = new Date();

        const cacheDir = path.join(process.cwd(), 'cache');
        const cacheFile = path.join(cacheDir, `metals-time-series`);

        try {
            // verify if the directory exists, if not create it
            await access(cacheDir).catch(async () => {
                await mkdir(cacheDir, { recursive: true });
            });

            // verify if cache exists
            await access(cacheFile);
            const cached = await readFile(cacheFile, 'utf-8');
            const { data, date } = JSON.parse(cached);

            // Vérifier si le cache est expiré
            const parsed_date = format(new Date(date), 'yyyy-MM-dd');
            if (parsed_date === format(now, 'yyyy-MM-dd')) {
                return data as MetalsTimeSeries;
            }
        } catch {
            return null;
        }
        return null;
    }

    public async cacheMetalsTimeSeries(data: MetalsTimeSeries) : Promise<void> {

            const now = new Date();

            const cacheDir = path.join(process.cwd(), 'cache');
            const cacheFile = path.join(cacheDir, `metals-time-series`);

            try {
                // Vérifier si le répertoire existe, sinon le créer
                await access(cacheDir).catch(async () => {
                    await mkdir(cacheDir, { recursive: true });
                });

                await writeFile(cacheFile, JSON.stringify({
                    data : data,
                    date: format(now, 'yyyy-MM-dd')
                }), 'utf-8');
            } catch {}
    }


    public async getCurrentMetalPrice() : Promise<CurrentMetalsPrice | null> {
        const cacheDir = path.join(process.cwd(), 'cache');
        const cacheFile = path.join(cacheDir, `current-metal-price`);

        const now = new Date();

        try {
            // verify if the directory exists, if not create it
            await access(cacheDir).catch(async () => {
                await mkdir(cacheDir, { recursive: true });
            });

            // verify if cache exists
            await access(cacheFile);
            const cached = await readFile(cacheFile, 'utf-8');
            const { data, date } = JSON.parse(cached);

            // verify if the cache is expired
            const parsed_date = format(new Date(date), 'yyyy-MM-dd');
            if (parsed_date === format(now, 'yyyy-MM-dd')) {
                return data as CurrentMetalsPrice;
            }
        } catch {return null;}
        return null;
    }

    public async cacheCurrentMetalPrice(data: CurrentMetalsPrice) : Promise<void> {
        const now = new Date();

        const cacheDir = path.join(process.cwd(), 'cache');
        const cacheFile = path.join(cacheDir, `current-metal-price`);

        try {
            // Vérifier si le répertoire existe, sinon le créer
            await access(cacheDir).catch(async () => {
                await mkdir(cacheDir, { recursive: true });
            });

            await writeFile(cacheFile, JSON.stringify({
                data : data,
                date: format(now, 'yyyy-MM-dd')
            }), 'utf-8');
        } catch {}
    }
}

export const cacheApiResponse = new CacheApiResponse()