import { Stack } from "expo-router";
import { useEffect } from "react";
import { client } from "../services/appwrite";
import "./globals.css";

export default function RootLayout() {
    useEffect(() => {
        client.ping().catch((error: unknown) => {
            console.warn("Appwrite ping failed:", error);
        });
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        </Stack>
    );
}
