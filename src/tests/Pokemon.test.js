import React from 'react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import pokemons from '../data';
import Pokemon from '../components/Pokemon';
import App from '../App';

it('Testa se é renderizado um card com as informações de determinado pokémon.', () => {
  const pikachu = pokemons[0];
  const { id, name, type, averageWeight: { value, measurementUnit}, image } = pikachu;
  const { getByTestId, getByRole } = renderWithRouter(<Pokemon pokemon={pikachu} isFavorite={false} />);
  const pokemonName = getByTestId('pokemon-name');
  const pokemonType = getByTestId('pokemon-type');
  const pokemonWeight = getByTestId('pokemon-weight');
  const pokemonImage = getByRole('img');
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  const linkMoreDetailsFormatted = linkMoreDetails.href.replace('http://localhost/pokemons/', '');
  expect(pokemonName.textContent).toBe(name);
  expect(pokemonType.textContent).toBe(type);
  expect(pokemonWeight.textContent).toBe(`Average weight: ${value} ${measurementUnit}`);
  expect(pokemonImage.src).toBe(image);
  expect(Number(linkMoreDetailsFormatted)).toBe(id);
});

it('Teste se ao clicar no link de navegação do Pokémon,\n é feito o redirecionamento da aplicação para a página de detalhes do mesmo.', () => {
  const { history, getByRole, getByTestId, getByLabelText } = renderWithRouter(<App />);
  const pokemonName = getByTestId('pokemon-name');
  const pokemonType = getByTestId('pokemon-type');
  const pokemonWeight = getByTestId('pokemon-weight');
  const pokemonImage = getByRole('img', { name: `${pokemonName.textContent} sprite` });
  let pokemonId = '';
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  pokemons.forEach((element) => {
    if (element.name === pokemonName.textContent) {
      pokemonId = element.id;
    }
  });
  expect(linkMoreDetails).toBeInTheDocument();
  userEvent.click(linkMoreDetails);
  const { pathname } = history.location;
  const pathnameFormatted = pathname.replace('pokemons', '').replace('/', '').replace('/', '');
  const pokemonNameDetail = getByTestId('pokemon-name');
  const pokemonTypeDetail = getByTestId('pokemon-type');
  const pokemonWeightDetail = getByTestId('pokemon-weight');
  const pokemonImageDetail = getByRole('img', { name: `${pokemonNameDetail.textContent} sprite` });
  const favoriteButton = getByLabelText('Pokémon favoritado?');
  userEvent.click(favoriteButton);
  const favoriteIcon = getByRole('img', { name: `${pokemonNameDetail.textContent} is marked as favorite` });
  expect(Number(pathnameFormatted)).toBe(pokemonId);
  expect(pokemonNameDetail.textContent).toBe(pokemonName.textContent);
  expect(pokemonTypeDetail.textContent).toBe(pokemonType.textContent);
  expect(pokemonWeightDetail.textContent).toBe(pokemonWeight.textContent);
  expect(pokemonImageDetail.alt).toBe(pokemonImage.alt);
  expect(favoriteIcon).toBeInTheDocument();
  expect(favoriteIcon.src.replace('http://localhost', '')).toBe('/star-icon.svg');
});

