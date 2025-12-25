import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/hooks/useAuth';
import RootNavigation from './src/navigation';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}