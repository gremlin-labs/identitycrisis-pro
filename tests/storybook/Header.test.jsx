import React from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as headerStories from '../../src/components/Header.stories';

const { Default } = composeStories(headerStories);

describe('Header Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { container } = render(<Default />);
    expect(container).toMatchSnapshot();
  });
});