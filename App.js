import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/hooks/useAuth';
import { CurrencyProvider } from './src/hooks/useCurrency';
import RootNavigation from './src/navigation';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <StatusBar style="auto" />
          <RootNavigation />
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}