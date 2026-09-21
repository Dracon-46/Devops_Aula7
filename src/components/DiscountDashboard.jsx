import { useState } from 'react';

import {
  calculateDiscount
} from '../services/discountService';

export default function DiscountDashboard() {

  const [value, setValue] = useState('');

  const [result, setResult] = useState(null);

  function handleCalculate() {

    const response =
      calculateDiscount(Number(value));

    setResult(response);
  }

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Calculadora de Descontos Pro
        </h1>

        <p style={styles.subtitle}>
          Cálculo automático de descontos
        </p>

        <div style={styles.formGroup}>

          <label style={styles.label}>
            Valor da Compra
          </label>

          <input
            type="number"

            placeholder="Digite o valor"

            value={value}

            onChange={(e) =>
              setValue(e.target.value)
            }

            style={styles.input}
          />

        </div>

        <button
          onClick={handleCalculate}
          style={styles.button}
        >
          Calcular Desconto
        </button>

        {

          result && (

            <div style={styles.resultCard}>

              <div style={styles.row}>
                <span>
                  Valor Original
                </span>

                <strong>
                  R$ {result.originalValue}
                </strong>
              </div>

              <div style={styles.row}>
                <span>
                  Desconto Aplicado
                </span>

                <strong>
                  {result.discount}%
                </strong>
              </div>

              <div style={styles.row}>
                <span>
                  Economia
                </span>

                <strong>
                  R$ {result.discountValue}
                </strong>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.totalRow}>
                <span>
                  Valor Final
                </span>

                <strong>
                  R$ {result.finalValue}
                </strong>
              </div>

            </div>

          )

        }

      </div>

    </div>

  );
}

const styles = {

  container: {

    minHeight: '100vh',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    background: '#f3f4f6',

    padding: '24px',

    fontFamily:
      'Roboto, Arial, sans-serif'
  },

  card: {

    width: '100%',

    maxWidth: '420px',

    background: '#ffffff',

    borderRadius: '16px',

    padding: '32px',

    boxShadow:
      '0 2px 10px rgba(0,0,0,0.08)'
  },

  title: {

    margin: 0,

    fontSize: '28px',

    color: '#212121'
  },

  subtitle: {

    marginTop: '8px',

    marginBottom: '32px',

    color: '#757575'
  },

  formGroup: {

    display: 'flex',

    flexDirection: 'column',

    marginBottom: '24px'
  },

  label: {

    marginBottom: '8px',

    fontSize: '14px',

    fontWeight: '500',

    color: '#424242'
  },

  input: {

    width: '100%',

    padding: '14px',

    border: '1px solid #d6d6d6',

    borderRadius: '8px',

    background: '#ffffff',

    color: '#212121',

    fontSize: '16px',

    outline: 'none',

    boxSizing: 'border-box',

    transition: '0.2s',

    boxShadow:
      'inset 0 1px 2px rgba(0,0,0,0.04)'
  },

  button: {

    width: '100%',

    padding: '14px',

    border: 'none',

    borderRadius: '8px',

    background: '#1976d2',

    color: '#ffffff',

    fontSize: '16px',

    fontWeight: 'bold',

    cursor: 'pointer'
  },

  resultCard: {

    marginTop: '28px',

    padding: '20px',

    borderRadius: '12px',

    background: '#fafafa',

    border: '1px solid #eeeeee'
  },

  row: {

    display: 'flex',

    justifyContent: 'space-between',

    marginBottom: '14px',

    color: '#424242'
  },

  divider: {

    height: '1px',

    background: '#e0e0e0',

    margin: '18px 0'
  },

  totalRow: {

    display: 'flex',

    justifyContent: 'space-between',

    fontSize: '20px',

    color: '#212121'
  }

};
