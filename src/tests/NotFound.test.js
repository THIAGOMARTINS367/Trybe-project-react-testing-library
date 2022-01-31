import React from 'react';
import renderWithRouter from './renderWithRouter';
import NotFound from '../components/NotFound';

const text1 = 'Testa se página contém um heading h2\n com o texto: ';
const text2 = '"Page requested not found 😭".';
it(text1 + text2, () => {
  const { getByRole, getAllByRole } = renderWithRouter(<NotFound />);
  const headingNotFound = getByRole('heading');
  const imgNotFound = getAllByRole('img');
  let srcImgNotFound = '';
  imgNotFound.forEach((element) => {
    if (element.src !== undefined) {
      srcImgNotFound = element.src;
    }
  });
  expect(headingNotFound.textContent).toBe('Page requested not found 😭');
  expect(srcImgNotFound).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
});
