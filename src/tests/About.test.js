import React from 'react';
import renderWithRouter from './renderWithRouter';
import About from '../components/About';

it('Teste se a página contém dois parágrafos com texto sobre a Pokédex.', () => {
  const { queryByText } = renderWithRouter(<About />);
  const paragraph1 = queryByText('This application simulates a Pokédex, a digital encyclopedia containing all Pokémons');
  const paragraph2 = queryByText('One can filter Pokémons by type, and see more details for each one of them');
  const informationAboutThePokedex = [paragraph1, paragraph2];
  informationAboutThePokedex.map((element) => {
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });
});

it('Testa se a página contém um heading "h2" com o texto "About Pokédex".', () => { 
  const { getByRole } = renderWithRouter(<About />);
  const titleH2 = getByRole('heading', {name: 'About Pokédex'});
  expect(titleH2).toBeInTheDocument();
});

it('Teste se a página contém a imagem de uma Pokédex.', () => {
  const { getByRole } = renderWithRouter(<About />);
  const pokedexImage = getByRole('img');
  expect(pokedexImage.src).toBe(
    'https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png'
  );
});
