import { Client, ID, Query, TablesDB, type Models } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

type AppwriteClientWithPing = Client & {
    ping: () => Promise<unknown>;
};

const client = new Client()
    .setProject("69e3a57a0014c4d9ad26")
    .setEndpoint("https://sgp.cloud.appwrite.io/v1") as AppwriteClientWithPing;

client.ping = async () => {
    const response = await fetch(`${client.config.endpoint}/ping`);
    return response.json();
};

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {

    try {
        const result = await tablesDB.listRows<Models.Row & { count?: number }>({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [Query.equal("searchTerm", query)],
        });


        if (result.rows.length > 0) {
            const existingMovie = result.rows[0];
            const currentCount = Number(existingMovie.count ?? 0);

            await tablesDB.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: existingMovie.$id,
                data: { count: currentCount + 1 },
            });
        } else {
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm: query,
                    movie_id: movie.id,
                    count: 1,
                    title: movie.title,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                },
            });
        }
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await tablesDB.listRows<Models.Row & { count?: number }>({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [Query.limit(5), Query.orderDesc('count')],
        });

        return result.rows as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export { client };
