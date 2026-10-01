import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  createSerie,
  getSerieById,
  updateSerie,
} from "../src/database/serieRepository";

export default function Form() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [temporadas, setTemporadas] = useState("");
  const [nota, setNota] = useState<number | null>(null);

  const editando = id !== undefined;

  useEffect(() => {
    if (!id) {
      return;
    }

    carregarSerie();
  }, [id]);

  async function carregarSerie() {
    const serie = await getSerieById(Number(id));

    if (!serie) {
      Alert.alert("Erro", "Série não encontrada.");
      router.back();
      return;
    }

    setTitulo(serie.titulo);
    setPlataforma(serie.plataforma);
    setTemporadas(String(serie.temporadas));
    setNota(serie.nota);
  }

  function selecionarNota(valor: number) {
    if (nota === valor) {
      setNota(null);
      return;
    }

    setNota(valor);
  }

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadasNumero = Number(temporadas);

    if (!tituloLimpo) {
      Alert.alert("Atenção", "Informe o título da série.");
      return;
    }

    if (!plataformaLimpa) {
      Alert.alert("Atenção", "Informe a plataforma.");
      return;
    }

    if (
      temporadas.trim() === "" ||
      !Number.isFinite(temporadasNumero) ||
      temporadasNumero < 0
    ) {
      Alert.alert(
        "Atenção",
        "Temporadas precisa ser um número maior ou igual a 0.",
      );
      return;
    }

    if (editando) {
      await updateSerie(Number(id), {
        titulo: tituloLimpo,
        plataforma: plataformaLimpa,
        temporadas: temporadasNumero,
        nota,
      });
    } else {
      await createSerie({
        titulo: tituloLimpo,
        plataforma: plataformaLimpa,
        temporadas: temporadasNumero,
        nota,
      });
    }

    router.back();
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      {/* Título */}
      <View>
        <Text className="mb-2 font-bold text-black">Título *</Text>

        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título da série"
          placeholderTextColor="#9CA3AF"
          className="rounded-lg border border-gray-300 px-3 py-3 text-black"
        />
      </View>

      {/* Plataforma */}
      <View>
        <Text className="mb-2 font-bold text-black">Plataforma *</Text>

        <TextInput
          value={plataforma}
          onChangeText={setPlataforma}
          placeholder="Plataforma"
          placeholderTextColor="#9CA3AF"
          className="rounded-lg border border-gray-300 px-3 py-3 text-black"
        />
      </View>

      {/* Temporadas */}
      <View>
        <Text className="mb-2 font-bold text-black">Temporadas *</Text>

        <TextInput
          value={temporadas}
          onChangeText={setTemporadas}
          placeholder="Número de temporadas"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          className="rounded-lg border border-gray-300 px-3 py-3 text-black"
        />
      </View>

      {/* Nota */}
      <View>
        <Text className="mb-2 font-bold text-black">Nota</Text>

        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((valor) => (
            <Pressable
              key={valor}
              onPress={() => selecionarNota(valor)}
              className="flex-1 items-center py-2"
            >
              <MaterialCommunityIcons
                name={nota !== null && valor <= nota ? "star" : "star-outline"}
                size={40}
                color={nota !== null && valor <= nota ? "#FACC15" : "#D1D5DB"}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Botão salvar */}
      <Pressable
        onPress={salvar}
        className="items-center rounded-lg bg-blue-600 py-3"
      >
        <Text className="font-bold text-white">
          {editando ? "Salvar alterações" : "Cadastrar série"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
