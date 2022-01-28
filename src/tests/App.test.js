import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';

it('Testa se o topo da aplicação contém um conjunto fixo de links de navegação.', () => {
  const { getByRole } = renderWithRouter(<App />);
  const links = [...getByRole('navigation').children];
  const linkText = ['Home', 'About', 'Favorite Pokémons'];

  links.map((element, index) => {
    expect(element).toBeInTheDocument();
    // console.log(element.textContent);
    expect(element.textContent).toBe(linkText[index]);
  });
});

it('Testa se a aplicação é redirecionada para a página inicial,\n na URL "/" ao clicar no link Home da barra de navegação.', () => {
  const { history, getByRole } = renderWithRouter(<App />);
  const links = [...getByRole('navigation').children];
  const pathNames = ['/', '/about', '/favorites'];
  links.map((element, index) => {
    userEvent.click(element);
    const { pathname } = history.location;
    console.log('path: ', pathname);
    expect(pathname).toBe(pathNames[index]);
  });
  history.push('/not-foud');
  const textNotFound = screen.getByRole('heading', {level: 2});
  expect(textNotFound).toBeInTheDocument();
  expect(textNotFound.textContent).toBe('Page requested not found 😭');
});
