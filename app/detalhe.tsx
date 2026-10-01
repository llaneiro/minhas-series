import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  deleteSerie,
  getSerieById,
  toggleSerieConcluida,
} from "../src/database/serieRepository";

import { Serie } from "../src/types/serie";

export default function Detalhe() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [serie, setSerie] = useState<Serie | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    carregarSerie();
  }, [id]);

  async function carregarSerie() {
    const resultado = await getSerieById(Number(id));

    if (!resultado) {
      Alert.alert("Erro", "Série não encontrada.");
      router.back();
      return;
    }

    setSerie(resultado);
  }

  async function alternarConcluida() {
    if (!serie) {
      return;
    }

    await toggleSerieConcluida(serie.id);

    await carregarSerie();
  }

  function editar() {
    if (!serie) {
      return;
    }

    router.push(`/form?id=${serie.id}`);
  }

  function excluir() {
    if (!serie) {
      return;
    }

    Alert.alert(
      "Excluir série",
      `Deseja realmente excluir "${serie.titulo}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteSerie(serie.id);
            router.back();
          },
        },
      ],
    );
  }

  if (!serie) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <View>
        <Text className="text-2xl font-bold text-black">{serie.titulo}</Text>
      </View>

      <View className="rounded-xl bg-gray-100 p-4">
        <Text className="mb-2 text-gray-600">Plataforma</Text>

        <Text className="text-lg font-bold text-black">{serie.plataforma}</Text>
      </View>

      <View className="rounded-xl bg-gray-100 p-4">
        <Text className="mb-2 text-gray-600">Temporadas</Text>

        <Text className="text-lg font-bold text-black">{serie.temporadas}</Text>
      </View>

      <View className="rounded-xl bg-gray-100 p-4">
        <Text className="mb-2 text-gray-600">Nota</Text>

        <Text className="text-lg font-bold text-black">
          {serie.nota !== null ? `⭐ ${serie.nota}` : "Sem nota"}
        </Text>
      </View>

      <View className="rounded-xl bg-gray-100 p-4">
        <Text className="mb-2 text-gray-600">Status</Text>

        <Text className="text-lg font-bold text-black">
          {serie.concluida === 1 ? "Concluída" : "Assistindo"}
        </Text>
      </View>

      <Pressable
        onPress={alternarConcluida}
        className="items-center rounded-lg bg-blue-600 py-3"
      >
        <Text className="font-bold text-white">
          {serie.concluida === 1
            ? "Voltar para assistindo"
            : "Marcar como concluída"}
        </Text>
      </Pressable>

      <Pressable
        onPress={editar}
        className="items-center rounded-lg bg-gray-200 py-3"
      >
        <Text className="font-bold text-black">Editar</Text>
      </Pressable>

      <Pressable
        onPress={excluir}
        className="items-center rounded-lg bg-red-600 py-3"
      >
        <Text className="font-bold text-white">Excluir</Text>
      </Pressable>
    </ScrollView>
  );
}
