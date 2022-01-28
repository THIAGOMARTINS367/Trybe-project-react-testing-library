import React from 'react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import FavoritePokemons from '../components/FavoritePokemons';
import App from '../App';

it('Testa se é exibido na tela a mensagem "No favorite pokemon found",\n se a pessoa não tiver pokémons favoritos.', () => {
  const { queryByText } = renderWithRouter(<FavoritePokemons />);
  const messageParagraph = queryByText('No favorite pokemon found');
  expect(messageParagraph).toBeInTheDocument();
});

it('Teste se é exibido todos os cards de pokémons favoritados.', () => {
  const { history, getByRole, getAllByTestId, getByLabelText } = renderWithRouter(<App />);
  history.push('/pokemons/25');
  const favoriteCheckbox = getByLabelText('Pokémon favoritado?');
  userEvent.click(favoriteCheckbox);
  history.push('/pokemons/4');
  userEvent.click(favoriteCheckbox);
  history.push('/pokemons/10');
  userEvent.click(favoriteCheckbox);
  const linkFavoritePokemons = getByRole('link', { name: 'Favorite Pokémons' });
  userEvent.click(linkFavoritePokemons);
  const namesOfPokemons = getAllByTestId('pokemon-name');
  const pokemonsTypes = getAllByTestId('pokemon-type');
  const pokemonsWeight = getAllByTestId('pokemon-weight');
  const favoritePokemons = {
    Pikachu: {
      type: 'Electric',
      averageWeight: 'Average weight: 6.0 kg',
    },
    Charmander: {
      type: 'Fire',
      averageWeight: 'Average weight: 8.5 kg',
    },
    Caterpie: {
      type: 'Bug',
      averageWeight: 'Average weight: 2.9 kg',
    },
  };
  const typesAndAverageWeights = Object.values(favoritePokemons);
  namesOfPokemons.map((element, index) => {
    expect(element.textContent).toBe(Object.keys(favoritePokemons)[index]);
    const pokemonFeature = {
      type: pokemonsTypes[index].textContent,
      averageWeight: pokemonsWeight[index].textContent,
    };
    expect(pokemonFeature).toEqual(typesAndAverageWeights[index]);
  });
});
