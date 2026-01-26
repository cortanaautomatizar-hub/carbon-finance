import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BalanceCard } from '@/components/BalanceCard';
import { formatarMoedaBRL } from '@/lib/saldoConsolidado';

describe('BalanceCard', () => {
  it('renders with default balance and formatted BRL', () => {
    render(<BalanceCard />);

    const balance = screen.getByTestId('balance-value');
    expect(balance.textContent).toBe(formatarMoedaBRL(24850.75));
  });

  it('shows percentual variation when provided (positive)', () => {
    render(<BalanceCard variacaoPercentual={2.5} />);

    expect(screen.getByText('+2.50%')).toBeDefined();
    // color class applied through text-success; check presence
    expect(screen.getByText('+2.50%').className).toMatch(/text-success/);
  });

  it('toggles hide/show balance', async () => {
    const user = userEvent.setup();
    render(<BalanceCard />);

    const toggleBtn = screen.getByLabelText('Ocultar saldo');
    const balance = screen.getByTestId('balance-value');

    expect(balance.textContent).toBe(formatarMoedaBRL(24850.75));

    await user.click(toggleBtn);

    // When hidden, we show placeholder
    expect(balance.textContent).toBe('••••••');

    // Button should now say 'Mostrar saldo'
    expect(screen.getByLabelText('Mostrar saldo')).toBeDefined();
  });

  it('calls onNovaTransacao when quick action clicked', async () => {
    const user = userEvent.setup();
    const fn = vi.fn();

    render(<BalanceCard onNovaTransacao={fn} />);

    const quickBtn = screen.getByLabelText('Nova transação');
    await user.click(quickBtn);

    expect(fn).toHaveBeenCalledOnce();
  });
});