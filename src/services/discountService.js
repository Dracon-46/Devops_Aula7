export function calculateDiscount(value) {

  if (value <= 0) {
    throw new Error('Valor inválido');
  }

  const discount =
    value < 100 ? 10 : 5;

  const discountValue =
    (value * discount) / 100;

  const finalValue =
    value - discountValue;

  return {

    originalValue: value,

    discount,

    discountValue:
      Number(discountValue.toFixed(2)),

    finalValue:
      Number(finalValue.toFixed(2))

  };
}
