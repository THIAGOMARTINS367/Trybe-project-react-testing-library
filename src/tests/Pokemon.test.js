import React from 'react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import pokemons from '../data';
import Pokemon from '../components/Pokemon';
import App from '../App';

const testIdPokemonName = 'pokemon-name';
const testIdPokemonType = 'pokemon-type';
const testIdPokemonWeight = 'pokemon-weight';
it('Testa se é renderizado um card com as informações de determinado pokémon.', () => {
  const pikachu = pokemons[0];
  const { id, name, type, averageWeight: { value, measurementUnit }, image } = pikachu;
  const { getByTestId, getByRole } = renderWithRouter(
    <Pokemon pokemon={ pikachu } isFavorite={ false } />,
  );
  const pokemonName1 = getByTestId(testIdPokemonName);
  const pokemonType1 = getByTestId(testIdPokemonType);
  const pokemonWeight1 = getByTestId(testIdPokemonWeight);
  const pokemonImage = getByRole('img');
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  const linkMoreDetailsFormatted = linkMoreDetails.href.replace('http://localhost/pokemons/', '');
  expect(pokemonName1.textContent).toBe(name);
  expect(pokemonType1.textContent).toBe(type);
  expect(pokemonWeight1.textContent).toBe(`Average weight: ${value} ${measurementUnit}`);
  expect(pokemonImage.src).toBe(image);
  expect(Number(linkMoreDetailsFormatted)).toBe(id);
});

const text1 = 'Teste se ao clicar no link de navegação do Pokémon,\n';
const text2 = 'é feito o redirecionamento da aplicação para';
const text3 = ' a página de detalhes do mesmo.';
it(text1 + text2 + text3, () => {
  const { history, getByRole, getByTestId, getByLabelText } = renderWithRouter(<App />);
  const namePokemon = getByTestId(testIdPokemonName);
  const typePokemon = getByTestId(testIdPokemonType);
  const weightPokemon = getByTestId(testIdPokemonWeight);
  const imagePokemon = getByRole('img', { name: `${namePokemon.textContent} sprite` });
  let pokemonId = '';
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  pokemons.forEach((element) => {
    if (element.name === namePokemon.textContent) {
      pokemonId = element.id;
    }
  });
  expect(linkMoreDetails).toBeInTheDocument();
  userEvent.click(linkMoreDetails);
  const { pathname } = history.location;
  const pathnameFormatted = pathname
    .replace('pokemons', '')
    .replace('/', '')
    .replace('/', '');
  const pokemonNameDetail = getByTestId(testIdPokemonName);
  const pokemonTypeDetail = getByTestId(testIdPokemonType);
  const pokemonWeightDetail = getByTestId(testIdPokemonWeight);
  const pokemonImageDetail = getByRole('img', {
    name: `${pokemonNameDetail.textContent} sprite`,
  });
  const favoriteButton = getByLabelText('Pokémon favoritado?');
  userEvent.click(favoriteButton);
  const favoriteIcon = getByRole('img', {
    name: `${pokemonNameDetail.textContent} is marked as favorite`,
  });
  expect(Number(pathnameFormatted)).toBe(pokemonId);
  expect(pokemonNameDetail.textContent).toBe(namePokemon.textContent);
  expect(pokemonTypeDetail.textContent).toBe(typePokemon.textContent);
  expect(pokemonWeightDetail.textContent).toBe(weightPokemon.textContent);
  expect(pokemonImageDetail.alt).toBe(imagePokemon.alt);
  expect(favoriteIcon).toBeInTheDocument();
  expect(favoriteIcon.src.replace('http://localhost', '')).toBe('/star-icon.svg');
});
