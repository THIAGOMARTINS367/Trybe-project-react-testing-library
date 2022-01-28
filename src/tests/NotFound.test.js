import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import NotFound from '../components/NotFound';
import { element } from 'prop-types';


it('Testa se página contém um heading h2\n com o texto: "Page requested not found 😭".', () => {
  const { getByRole, getAllByRole } = renderWithRouter(<NotFound />);
  const headingNotFound = getByRole('heading');
  const imgNotFound = getAllByRole('img');
  let srcImgNotFound = '';
  imgNotFound.map((element) => {
    if (element.src !== undefined) {
      srcImgNotFound = element.src;
    }
  });
  expect(headingNotFound.textContent).toBe('Page requested not found 😭');
  expect(srcImgNotFound).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
});
