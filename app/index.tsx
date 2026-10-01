import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { getSeries } from "../src/database/serieRepository";
import { Serie, SerieFilter } from "../src/types/serie";

const filtros: {
  label: string;
  value: SerieFilter;
}[] = [
  {
    label: "Todas",
    value: "todas",
  },
  {
    label: "Assistindo",
    value: "assistindo",
  },
  {
    label: "Concluídas",
    value: "concluidas",
  },
];

export default function Index() {
  const [filtro, setFiltro] = useState<SerieFilter>("todas");

  const [series, setSeries] = useState<Serie[]>([]);

  const carregarSeries = useCallback(async () => {
    const resultado = await getSeries(filtro);
    setSeries(resultado);
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarSeries();
    }, [carregarSeries]),
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <View className="mb-4 flex-row gap-2">
        {filtros.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setFiltro(item.value)}
            className={
              filtro === item.value
                ? "rounded-lg bg-blue-600 px-4 py-2"
                : "rounded-lg bg-gray-200 px-4 py-2"
            }
          >
            <Text
              className={
                filtro === item.value ? "font-bold text-white" : "text-black"
              }
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          gap: 12,
          paddingBottom: 16,
        }}
        renderItem={({ item }) => (
          <View
            className={
              item.concluida === 1
                ? "rounded-xl bg-gray-200 p-4"
                : "rounded-xl bg-gray-100 p-4"
            }
          >
            <Text className="text-lg font-bold text-black">{item.titulo}</Text>

            <Text className="mt-1 text-gray-700">{item.plataforma}</Text>

            <Text className="mt-1 text-gray-700">
              {item.temporadas}{" "}
              {item.temporadas === 1 ? "temporada" : "temporadas"}
            </Text>

            <Text className="mt-1 text-gray-700">
              {item.nota !== null ? `⭐ ${item.nota}` : "Sem nota"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="mt-8 text-center text-gray-500">
            Nenhuma série encontrada.
          </Text>
        }
      />

      <Pressable
        onPress={() => router.push("/form")}
        className="mb-4 items-center rounded-xl bg-blue-600 py-3"
      >
        <Text className="font-bold text-white">+ Nova série</Text>
      </Pressable>
    </View>
  );
}
