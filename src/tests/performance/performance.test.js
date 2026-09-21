import {
  test,
  expect
}
from 'vitest';

import {
  calculateDiscount
}
from '../../services/discountService';

test(
  'performance',
  () => {

    const start =
      performance.now();

    for (
      let i = 0;
      i < 10000;
      i++
    ) {

      calculateDiscount(50);

    }

    const end =
      performance.now();

    expect(
      end - start
    ).toBeLessThan(100);

  }
);
