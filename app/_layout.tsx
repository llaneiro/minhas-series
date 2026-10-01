import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Minhas Séries",
        }}
      />

      <Stack.Screen
        name="form"
        options={{
          title: "Nova Série",
        }}
      />

      <Stack.Screen
        name="detalhe"
        options={{
          title: "Detalhes da Série",
        }}
      />
    </Stack>
  );
}
