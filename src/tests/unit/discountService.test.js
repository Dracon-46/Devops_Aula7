import {
  describe,
  test,
  expect
}
from 'vitest';

import {
  calculateDiscount
}
from '../../services/discountService';

describe('Teste Unitário', () => {

  test(
    'deve aplicar 10%',
    () => {

      const result =
        calculateDiscount(50);

      expect(
        result.discount
      ).toBe(10);

    }
  );

  test(
    'deve aplicar 5%',
    () => {

      const result =
        calculateDiscount(300);

      expect(
        result.discount
      ).toBe(5);

    }
  );

});
