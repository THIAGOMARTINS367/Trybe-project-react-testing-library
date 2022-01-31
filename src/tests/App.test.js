import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';

it('Testa se o topo da aplicação contém um conjunto fixo de links de navegação.', () => {
  const { getByRole } = renderWithRouter(<App />);
  const links = [...getByRole('navigation').children];
  const linkText = ['Home', 'About', 'Favorite Pokémons'];

  links.forEach((element, index) => {
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe(linkText[index]);
  });
});

const text1 = 'Testa se a aplicação é redirecionada para a página inicial,\n';
const text2 = 'na URL "/" ao clicar no link Home da barra de navegação.';
it(text1 + text2, () => {
  const { history, getByRole } = renderWithRouter(<App />);
  const links = [...getByRole('navigation').children];
  const pathNames = ['/', '/about', '/favorites'];
  links.forEach((element, index) => {
    userEvent.click(element);
    const { pathname } = history.location;
    expect(pathname).toBe(pathNames[index]);
  });
  history.push('/not-foud');
  const textNotFound = screen.getByRole('heading', { level: 2 });
  expect(textNotFound).toBeInTheDocument();
  expect(textNotFound.textContent).toBe('Page requested not found 😭');
});
