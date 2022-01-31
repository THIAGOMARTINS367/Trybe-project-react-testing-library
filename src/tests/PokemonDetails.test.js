import React from 'react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import pokemons from '../data';
import PokemonDetails from '../components/PokemonDetails';
import App from '../App';


it('Testa se as informações detalhadas do Pokémon\n selecionado são mostradas na tela.', () => {
  const pikachu = pokemons[0];
  const { id, name, summary } = pikachu;
  const { getByRole, getByText } = renderWithRouter(<PokemonDetails pokemons={pokemons} isPokemonFavoriteById={{}} match={{params: { id: id }}}/>);
  const headingDetails = getByRole('heading', { name: `${name} Details` });
  const summaryDetails = getByRole('heading', { name: 'Summary' });
  const summaryParagraph = getByText(`${summary}`);
  expect(headingDetails).toBeInTheDocument();
  expect(summaryDetails).toBeInTheDocument();
  expect(summaryParagraph).toBeInTheDocument();
});

it('Não deve existir o link de navegação para os detalhes\n do Pokémon selecionado na página de detalhes do pokémon.', () => {
  const { getByRole } = renderWithRouter(<App />);
  const linkMoreDetails = getByRole('link', { name: 'More details' });
  userEvent.click(linkMoreDetails);
  expect(linkMoreDetails).not.toBeInTheDocument();
});

it('Testa se existe na página uma seção com os mapas contendo as localizações do pokémon', () => {
  const pikachu = pokemons[0];
  const { id, name, foundAt } = pikachu;
  const { getAllByRole, getByRole, getByText } = renderWithRouter(<PokemonDetails pokemons={pokemons} isPokemonFavoriteById={{}} match={{params: { id: id }}}/>);
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
  const favoriteIcon = getByRole('img', { name: `${pokemonName.textContent} is marked as favorite` });
  expect(favoriteIcon).toBeInTheDocument();
  userEvent.click(favoriteCheckbox);
  expect(favoriteIcon).not.toBeInTheDocument();
});
