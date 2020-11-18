import React from 'react';
import { render } from '@testing-library/react';
import Monopoly from './monopoly.module';

test('renders learn react link', () => {
  const { getByText } = render(<Monopoly />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
