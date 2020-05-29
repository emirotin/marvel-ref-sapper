import marvel from "./marvel";

const comicsCharacters = async (comicsId) => {
  const [characters1, characters2] = await Promise.all([
    marvel.comics(comicsId).characters.get({ orderBy: "name", page: 1 }),
    marvel.comics(comicsId).characters.get({ orderBy: "name", page: 2 }),
  ]);
  return [...characters1.data.results, ...characters2.data.results];
};

const characterComics = async (characterId) => {
  const [comics1, comics2] = await Promise.all([
    marvel.characters(characterId).comics.get({ orderBy: "-focDate", page: 1 }),
    marvel.characters(characterId).comics.get({ orderBy: "-focDate", page: 2 }),
  ]);
  return [...comics1.data.results, ...comics2.data.results];
};

const noralizeCharacters = (characters, currentCharacterId) => {
  const charactersById = new Map();
  const counts = new Map();

  characters.forEach((charactersInner) => {
    charactersInner.forEach((character) => {
      if (character.id === currentCharacterId) {
        return;
      }
      if (counts.has(character.id)) {
        counts.set(character.id, 1 + counts.get(character.id));
      } else {
        counts.set(character.id, 1);
        charactersById.set(character.id, character);
      }
    });
  });

  return [...counts.entries()]
    .map((pair) => ({
      id: pair[0],
      count: pair[1],
    }))
    .sort((o1, o2) => o2.count - o1.count)
    .slice(0, 16)
    .map((o) => charactersById.get(o.id));
};

const getRelatedCharacters = async (characterId) => {
  const comicsIds = (await characterComics(characterId)).map((c) => c.id);
  const characters = await Promise.all(comicsIds.map(comicsCharacters));
  return noralizeCharacters(characters, parseInt(characterId, 10));
};

export default getRelatedCharacters;
