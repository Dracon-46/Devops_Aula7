import {
  render,
  screen,
  fireEvent
}
from '@testing-library/react';

import {
  test,
  expect
}
from 'vitest';

import DiscountDashboard
from '../../components/DiscountDashboard';

test(
  'deve calcular desconto',
  () => {

    render(
      <DiscountDashboard />
    );

    fireEvent.change(

      screen.getByPlaceholderText(
        'Digite o valor'
      ),

      {
        target: {
          value: '50'
        }
      }

    );
    fireEvent.click(

      screen.getByText(
        'Calcular Desconto'
      )

    );

    expect(

      screen.getByText(
        /10%/
      )

    ).toBeTruthy();

  }
);
