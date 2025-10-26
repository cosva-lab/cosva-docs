// i18n
import 'locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// routes
import Router from 'routes/sections';
// theme
import ThemeProvider from 'theme';
// locales
import { LocalizationProvider } from 'locales';
// hooks
import { useScrollToTop } from 'hooks/use-scroll-to-top';
// components
import ProgressBar from 'components/progress-bar';
import { MotionLazy } from 'components/animate/motion-lazy';
import SnackbarProvider from 'components/snackbar/snackbar-provider';
import { SettingsProvider, SettingsDrawer } from 'components/settings';
// auth
// import { AuthProvider, AuthConsumer } from 'auth/context/jwt';
// import { AuthProvider, AuthConsumer } from 'auth/context/auth0';
import { AuthProvider, AuthConsumer } from 'auth/context/amplify';
// import { AuthProvider, AuthConsumer } from 'auth/context/firebase';

// ----------------------------------------------------------------------

export default function App() {
  const charAt = `

  ░░░    ░░░
  ▒▒▒▒  ▒▒▒▒
  ▒▒ ▒▒▒▒ ▒▒
  ▓▓  ▓▓  ▓▓
  ██      ██

  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');

  useScrollToTop();

  return (
    <AuthProvider>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <SettingsDrawer />
                <ProgressBar />
                <AuthConsumer>
                  <Router />
                </AuthConsumer>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}
