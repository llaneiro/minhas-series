# Minhas Séries

Aplicativo desenvolvido em React Native com Expo para cadastrar e acompanhar séries.

## Funcionalidades

- Cadastro de séries
- Edição de séries
- Exclusão de séries
- Visualização dos detalhes de uma série
- Avaliação de 1 a 5 estrelas
- Marcação de séries como concluídas
- Filtro por todas, assistindo e concluídas
- Persistência dos dados utilizando SQLite

## Tecnologias utilizadas

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- Expo SQLite

## Estrutura do projeto

```text
minhas-series/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── form.tsx
│   └── detalhe.tsx
│
├── src/
│   ├── database/
│   │   ├── database.ts
│   │   └── serieRepository.ts
│   │
│   └── types/
│       └── serie.ts
│
├── global.css
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
└── package.json
```

## Como executar o projeto

Instale as dependências:

```bash
npm install
```

Depois, inicie o projeto:

```bash
npx expo start
```

O aplicativo pode ser executado utilizando um dispositivo físico ou um emulador compatível com Expo.

## Teste de persistência

Para testar a persistência dos dados, foram cadastradas 3 séries, depois, o aplicativo foi fechado completamente e aberto novamente para verificar se os dados continuavam salvos.

### Evidências


https://github.com/user-attachments/assets/b3b5dee2-9a3d-4979-be11-72e9512874c3



## Diário do copiloto

### Registro 1 — Etapa 2

**O que eu pedi:** ajuda para criar os tipos da série e principalmente para entender como fazer os filtros.

**O que a IA sugeriu (resumo):** criar um tipo `SerieFilter` com os valores `todas`, `assistindo` e `concluidas`, em vez de trabalhar diretamente com os valores `0` e `1` do banco.

**O que eu fiz:** eu questionei essa parte porque, no banco, `concluida` usa `0` e `1`, então não entendi de primeira por que o filtro precisava usar textos. A IA explicou que o `SerieFilter` representa o filtro escolhido pela tela, enquanto `0` e `1` representam o valor armazenado no banco. Depois dessa explicação, aceitei a ideia.

Por exemplo, ficou assim:

```ts
export type SerieFilter = "todas" | "assistindo" | "concluidas";
```

No repository, esses valores são transformados nos valores usados pelo SQLite.

### Registro 2 — Etapa 3

**O que eu pedi:** ajuda para criar a conexão com o SQLite e a tabela `series`.

**O que a IA sugeriu (resumo):** criar uma função `getDatabase()` para abrir o banco e uma função `runMigrations()` para criar a tabela usando `CREATE TABLE IF NOT EXISTS`.

**O que eu fiz:** durante os testes apareceu o erro `no such table: series`. O problema era que a migration existia no projeto, mas ainda não estava sendo executada antes de o repository tentar acessar a tabela.

Em uma primeira versão, a abertura do banco e a execução da migration ficaram separadas. Isso parecia funcionar pela estrutura do código, mas na prática o repository tentou consultar a tabela antes de ela existir.

Corrigi a implementação para que a migration fosse executada na inicialização do banco, antes de o repository começar a fazer as consultas:

```ts
if (!db) {
  db = await SQLite.openDatabaseAsync("minhas-series.db");

  await runMigrations(db);
}
```

Essa correção foi necessária porque não bastava ter a função `runMigrations()` no projeto. Ela precisava ser realmente executada antes do primeiro acesso à tabela. Depois disso, o repository conseguiu acessar a tabela normalmente e o erro deixou de acontecer.

### Registro 3 — Etapa 4

**O que eu pedi:** ajuda para criar o repository e fazer as operações de cadastro, busca, edição, conclusão e exclusão das séries.

**O que a IA sugeriu (resumo):** deixar as operações do SQLite dentro do `serieRepository.ts` e usar `?` nas consultas para passar os valores separadamente.

**O que eu fiz:** aceitei essa estrutura porque ela seguia a separação que vimos em aula. Também mantive os valores como parâmetros das consultas, por exemplo:

```ts
await db.runAsync(`DELETE FROM series WHERE id = ?`, [id]);
```

Assim, os valores não ficam diretamente dentro da string SQL.

### Registro 4 — Etapa 5

**O que eu pedi:** ajuda porque a série nova não aparecia na lista quando eu voltava do formulário.

**O que a IA sugeriu (resumo):** usar `useFocusEffect` do Expo Router. A explicação foi que o `useEffect` com `[]` roda quando a tela é montada, mas voltar para a lista não significa montar a tela novamente, porque ela continua na pilha de navegação.

A IA também explicou que o `useFocusEffect` deve ser usado junto com `useCallback`.

**O que eu fiz:** aceitei a sugestão e troquei o carregamento da lista para:

```tsx
useFocusEffect(
  useCallback(() => {
    carregarSeries();
  }, [carregarSeries]),
);
```

Depois disso, quando eu cadastrava ou editava uma série e voltava para a lista, os dados eram carregados novamente.

### Registro 5 — Etapas 6 e 7

**O que eu pedi:** ajuda para fazer o formulário funcionar tanto para cadastrar quanto para editar uma série e criar a tela de detalhes.

**O que a IA sugeriu (resumo):** usar a mesma tela `form.tsx` para os dois casos, verificando se existe um `id` na URL. Se existir, a tela carrega a série e funciona como edição; se não existir, funciona como cadastro.

**O que eu fiz:** aceitei essa estrutura e também adaptei alguns detalhes durante o desenvolvimento. Na avaliação por estrelas, por exemplo, fiz com que clicar novamente na nota escolhida removesse a avaliação:

```ts
function selecionarNota(valor: number) {
  if (nota === valor) {
    setNota(null);
    return;
  }

  setNota(valor);
}
```

Na tela de detalhes também coloquei uma confirmação antes de excluir a série.
