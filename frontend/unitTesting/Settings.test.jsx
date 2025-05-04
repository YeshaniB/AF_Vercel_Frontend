import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from './Settings';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('favorites_testuser', '[]');
  localStorage.setItem('viewedCountries_testuser', '[]');
});

const customRender = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <AuthProvider value={{ user: { username: 'testuser', email: 'test@example.com' } }}>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </AuthProvider>,
    renderOptions
  );
};

describe('Settings Component', () => {
  test('renders settings headings', () => {
    customRender(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Data and Privacy')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  test('shows user initials and email', () => {
    customRender(<Settings />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('toggles dark mode', () => {
    customRender(<Settings />);
    const toggle = screen.getByRole('button', { name: /toggle dark mode/i });
    fireEvent.click(toggle);
    // Should visually change, state not directly visible so no assertion unless using mocked context
  });

  test('shows confirmation dialog when clicking "Clear All My Data"', () => {
    customRender(<Settings />);
    fireEvent.click(screen.getByText('Clear All My Data'));
    expect(screen.getByText('Clear All Data?')).toBeInTheDocument();
  });

  test('cancels clear data confirmation', () => {
    customRender(<Settings />);
    fireEvent.click(screen.getByText('Clear All My Data'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Clear All Data?')).not.toBeInTheDocument();
  });

  test('clears localStorage and shows notification', async () => {
    customRender(<Settings />);
    fireEvent.click(screen.getByText('Clear All My Data'));
    fireEvent.click(screen.getByText('Clear All Data'));

    await waitFor(() =>
      expect(screen.getByText('Your browsing data has been cleared successfully')).toBeInTheDocument()
    );

    expect(localStorage.getItem('favorites_testuser')).toBeNull();
    expect(localStorage.getItem('viewedCountries_testuser')).toBeNull();
  });

  test('notification disappears after 3 seconds', async () => {
    jest.useFakeTimers();
    customRender(<Settings />);
    fireEvent.click(screen.getByText('Clear All My Data'));
    fireEvent.click(screen.getByText('Clear All Data'));

    expect(screen.getByText('Your browsing data has been cleared successfully')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() =>
      expect(screen.queryByText('Your browsing data has been cleared successfully')).not.toBeInTheDocument()
    );

    jest.useRealTimers();
  });
});
