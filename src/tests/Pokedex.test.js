import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';
import { element } from 'prop-types';

it('Testa se página contém um heading h2 com o texto: "Encountered pokémons".', () => {
  const { getByRole } = renderWithRouter(<App />);
  const headingEncounteredPokemons = getByRole('heading', { name: 'Encountered pokémons' });
  expect(headingEncounteredPokemons).toBeInTheDocument();
});

it('Testa se é exibido o próximo Pokémon da lista\n quando o botão "Próximo pokémon" é clicado.' , () => {
  const { getByRole, getByTestId } = renderWithRouter(<App />);
  const nextPokemonButton = getByRole('button', { name: 'Próximo pokémon' });
  const namesPokemons = [];
  const quantityOfPokemons = 9;
  expect(nextPokemonButton).toBeInTheDocument();
  for (let index = 1; index < quantityOfPokemons; index += 1) {
    const namePokemon = getByTestId('pokemon-name').textContent;
    let pokemonIsRepeated = false;
    if (namesPokemons.includes(namePokemon)) {
      pokemonIsRepeated = `Este Pokémon já havia sido passado: ${namePokemon}`
    }
    expect(nextPokemonButton).toBeInTheDocument();
    expect(pokemonIsRepeated).toBe(false);
    namesPokemons.push(namePokemon);
    userEvent.click(nextPokemonButton);
  }
  userEvent.click(nextPokemonButton);
  const firstPokemonName = getByTestId('pokemon-name');
  expect(firstPokemonName.textContent).toBe(namesPokemons[0]);
});

it('Testa se é mostrado apenas um Pokémon por vez.' , () => {
  const { getByRole, getAllByTestId } = renderWithRouter(<App />);
  const nextPokemonButton = getByRole('button', { name: 'Próximo pokémon' });
  const quantityOfPokemons = 9;
  expect(nextPokemonButton).toBeInTheDocument();
  for (let index = 1; index <= quantityOfPokemons; index += 1) {
    const namePokemon = getAllByTestId('pokemon-name');
    expect(nextPokemonButton).toBeInTheDocument();
    expect(namePokemon.length).toBe(1);
    userEvent.click(nextPokemonButton);
  }
});

it('Testa se a Pokédex tem os botões de filtro por tipo\n de Pokémon e se realmente está filtrando.', () => {
  const { getByTestId, getAllByTestId, getByRole } = renderWithRouter(<App />);
  let buttonsFilterByType = getAllByTestId('pokemon-type-button');
  const buttonAllTypes = getByRole('button', { name: 'All' });
  const buttons = [];
  let repeatedButton = false;
  buttonsFilterByType.push(buttonAllTypes);
  buttonsFilterByType.forEach((element) => {
    if (buttons.includes(element.textContent) === false) {
      buttons.push(element.textContent);
    } else {
      repeatedButton = `O botão ${element.textContent} está se repetindo na tela.`
    }
    expect(repeatedButton).toBe(false);
  });
  buttonsFilterByType = buttonsFilterByType.filter((element) => element.textContent !== 'All');
  buttonsFilterByType.forEach((element) => {
    userEvent.click(element);
    let pokemonType = getByTestId('pokemon-type');
    expect(pokemonType.textContent).toBe(element.textContent);
    expect(buttonAllTypes).toBeInTheDocument();
    const nextPokemon = getByTestId('next-pokemon');
    userEvent.click(nextPokemon);
    pokemonType = getByTestId('pokemon-type');
    expect(pokemonType.textContent).toBe(element.textContent);
    expect(buttonAllTypes).toBeInTheDocument();
  });
});

it('Testa se a Pokédex contém um botão para resetar o filtro.', () => {
  const { history, getByTestId, getAllByTestId, getByRole } = renderWithRouter(<App />);
  const buttonsFilterByType = getAllByTestId('pokemon-type-button');
  let buttonAllTypes = getByRole('button', { name: 'All' });
  const quantityOfPokemons = 9;
  const pokemonTypes = [];
  userEvent.click(buttonAllTypes);
  for (let index = 1; index < quantityOfPokemons; index += 1) {
    const pokemonType = getByTestId('pokemon-type');
    pokemonTypes.push(pokemonType);
    const nextPokemon = getByTestId('next-pokemon');
    userEvent.click(nextPokemon);
  }
  buttonsFilterByType.forEach((element) => {
    expect(pokemonTypes.includes(element.textContent));
  });
  history.push('/');
  buttonAllTypes = getByRole('button', { name: 'All' });
  expect(buttonAllTypes).toBeInTheDocument();
});