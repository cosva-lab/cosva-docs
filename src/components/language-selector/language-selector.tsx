import { useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'pt'
  | 'de'
  | 'it'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'ar'
  | 'ru'
  | 'hi';

export type Translation = {
  lang: LanguageCode;
  values: Record<string, string | undefined>;
};

export const AVAILABLE_LANGUAGES: {
  code: LanguageCode;
  name: string;
  nativeName: string;
}[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

type Props = {
  translations: Translation[];
  selectedLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  onAddLang: (lang: LanguageCode) => void;
  onRemoveLang: (lang: LanguageCode) => void;
};

export default function LanguageSelector({
  translations,
  selectedLang,
  onLangChange,
  onAddLang,
  onRemoveLang,
}: Props) {
  const [open, setOpen] = useState(false);
  const [newLang, setNewLang] = useState<LanguageCode>('es');

  const availableLangsToAdd = AVAILABLE_LANGUAGES.filter(
    lang => !translations.find(t => t.lang === lang.code)
  );

  const handleAdd = () => {
    onAddLang(newLang);
    onLangChange(newLang);
    setOpen(false);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Tabs
          value={selectedLang}
          onChange={(_, value) => onLangChange(value as LanguageCode)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {translations.map(translation => (
            <Tab
              key={translation.lang}
              value={translation.lang}
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2">
                    {AVAILABLE_LANGUAGES.find(l => l.code === translation.lang)
                      ?.nativeName || translation.lang}
                  </Typography>
                  {translations.length > 1 && (
                    <Chip
                      size="small"
                      label={
                        <Iconify
                          icon="solar:close-circle-bold"
                          width={12}
                          sx={{ cursor: 'pointer' }}
                        />
                      }
                      onClick={e => {
                        e.stopPropagation();
                        onRemoveLang(translation.lang);
                      }}
                      sx={{ height: 16, '& .MuiChip-label': { px: 0.5 } }}
                    />
                  )}
                </Stack>
              }
            />
          ))}
        </Tabs>

        {availableLangsToAdd.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpen(true)}
          >
            Add Language
          </Button>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Language</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={newLang}
                onChange={e => setNewLang(e.target.value as LanguageCode)}
                label="Language"
              >
                {availableLangsToAdd.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleAdd}>
                Add
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
