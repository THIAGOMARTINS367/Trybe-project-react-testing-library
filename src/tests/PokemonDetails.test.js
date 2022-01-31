import React from 'react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import pokemons from '../data';
import PokemonDetails from '../components/PokemonDetails';
import App from '../App';

const text1 = 'Testa se as informações detalhadas do Pokémon\n';
const text2 = 'selecionado são mostradas na tela.';
it(text1 + text2, () => {
  const pikachu = pokemons[0];
  const { id, name, summary } = pikachu;
  const { getByRole, getByText } = renderWithRouter(
    <PokemonDetails
      pokemons={ pokemons }
      isPokemonFavoriteById={ { id: false } }
      onUpdateFavoritePokemons={ () => '' }
      match={ {
        params: {
          id: String(id),
        },
      } }
    />,
  );
  const headingDetails = getByRole('heading', { name: `${name} Details` });
  const summaryDetails = getByRole('heading', { name: 'Summary' });
  const summaryParagraph = getByText(`${summary}`);
  expect(headingDetails).toBeInTheDocument();
  expect(summaryDetails).toBeInTheDocument();
  expect(summaryParagraph).toBeInTheDocument();
});

const textTest1 = 'Não deve existir o link de navegação para os detalhes\n';
const textTest2 = 'do Pokémon selecionado na página de detalhes do pokémon.';
it(textTest1 + textTest2, () => {
  const { getByRole } = renderWithRouter(<App />);
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  userEvent.click(linkMoreDetails);
  expect(linkMoreDetails).not.toBeInTheDocument();
});

const text1Test = 'Testa se existe na página uma seção com os mapas\n';
const text2Test = 'contendo as localizações do pokémon.';
it(text1Test + text2Test, () => {
  const pikachu = pokemons[0];
  const { id, name, foundAt } = pikachu;
  const { getAllByRole, getByRole, getByText } = renderWithRouter(
    <PokemonDetails
      pokemons={ pokemons }
      isPokemonFavoriteById={ { id: false } }
      onUpdateFavoritePokemons={ () => '' }
      match={ {
        params: {
          id: String(id),
        },
      } }
    />,
  );
  const headingLocations = getByRole('heading', { name: `Game Locations of ${name}` });
  expect(headingLocations).toBeInTheDocument();
  foundAt.forEach((element, index) => {
    const location = getByText(element.location);
    const imagesOfTheLocations = getAllByRole('img', { name: `${name} location` });
    expect(location).toBeInTheDocument();
    expect(imagesOfTheLocations[index]).toBeInTheDocument();
    expect(imagesOfTheLocations[index].src).toBe(element.map);
  });
});

it('Testa se o usuário pode favoritar um pokémon através da página de detalhes.', () => {
  const { getByLabelText, getByRole, getByTestId } = renderWithRouter(<App />);
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  const pokemonName = getByTestId('pokemon-name');
  userEvent.click(linkMoreDetails);
  const favoriteCheckbox = getByLabelText('Pokémon favoritado?');
  userEvent.click(favoriteCheckbox);
  const favoriteIcon = getByRole('img', {
    name: `${pokemonName.textContent} is marked as favorite`,
  });
  expect(favoriteIcon).toBeInTheDocument();
  userEvent.click(favoriteCheckbox);
  expect(favoriteIcon).not.toBeInTheDocument();
});
