import { useScroll } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
// components
import ScrollProgress from 'components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />
      </Box>
    </>
  );
}
