import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import Home from './page';

test('renders Home component', () => {
  const { getByText } = render(<Home />);
  expect(getByText(/Design Your/i)).toBeDefined();
});
