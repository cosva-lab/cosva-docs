import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import 'utils/highlight';
import ReactQuill from 'react-quill';
// @mui
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
//
import { EditorProps } from './types';
import { StyledEditor } from './styles';
import Toolbar, { formats } from './toolbar';
import { resizeImage } from 'utils/resizeImage';
import { richStyles } from 'components/html-content/styles';

// ----------------------------------------------------------------------

export default function Editor({
  id = 'minimal-quill',
  error,
  simple = false,
  helperText,
  sx,
  value,
  onChange,
  ...other
}: EditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(() => String(value || ''));
  const [isReady, setIsReady] = useState(true);

  // Resetear estado cuando cambia el id (por ejemplo, al cambiar de idioma)
  useEffect(() => {
    setIsHtmlMode(false);
    setHtmlContent(String(value || ''));
    setIsReady(false);
    // Delay más largo para asegurar que el DOM anterior se limpie completamente
    // y que Quill pueda inicializar correctamente el toolbar
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Sincronizar htmlContent cuando value cambia
  useEffect(() => {
    if (!isHtmlMode) {
      const newValue = String(value || '');
      setHtmlContent(newValue);
    }
  }, [value, isHtmlMode]);

  const getEditorHtml = useCallback((): string => {
    const quill = quillRef.current?.getEditor();
    if (quill?.root?.innerHTML) {
      return quill.root.innerHTML;
    }
    return String(value || '');
  }, [value]);

  const handleToggleHtmlMode = useCallback(() => {
    if (isHtmlMode) {
      // Cambiar de HTML a modo normal: insertar HTML en el editor
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const delta = quill.clipboard.convert(htmlContent);
        quill.setContents(delta, 'user');
      }
      setIsHtmlMode(false);
    } else {
      // Cambiar de modo normal a HTML: obtener HTML del editor
      setHtmlContent(getEditorHtml());
      setIsHtmlMode(true);
    }
  }, [isHtmlMode, htmlContent, getEditorHtml]);

  const handleHtmlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newHtml = event.target.value;
      setHtmlContent(newHtml);
      if (onChange) {
        // En modo HTML, solo pasamos el string HTML
        (onChange as (content: string) => void)(newHtml);
      }
    },
    [onChange]
  );

  const insertImage = useCallback(
    (quill: ReturnType<ReactQuill['getEditor']>, imageUrl: string) => {
      if (!quill) return;
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', imageUrl);
    },
    []
  );

  const imageHandler = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      try {
        const compressedFile = await resizeImage(file, {
          maxWidthOrHeight: 1920,
          quality: 80,
        });
        const reader = new FileReader();
        reader.onload = () => insertImage(quill, reader.result as string);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback: usar imagen original
        const reader = new FileReader();
        reader.onload = () => insertImage(quill, reader.result as string);
        reader.readAsDataURL(file);
      }
    };
  }, [insertImage]);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: `#${id}`,
        handlers: {
          image: imageHandler,
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      syntax: true,
      clipboard: {
        matchVisual: false,
      },
    };
  }, [id, imageHandler]);

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: theme => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: theme => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        {isReady && (
          <Toolbar
            key={id}
            id={id}
            isSimple={simple}
            isHtmlMode={isHtmlMode}
            onToggleHtmlMode={handleToggleHtmlMode}
          />
        )}
        <Box sx={{ position: 'relative' }}>
          {/* ReactQuill siempre montado pero oculto en modo HTML */}
          <Box
            sx={{
              ...(isHtmlMode && {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: 0,
                pointerEvents: 'none',
                zIndex: -1,
                ...richStyles
              }),
            }}
          >
            {isReady && (
              <ReactQuill
                key={id}
                ref={quillRef}
                modules={modules}
                formats={formats}
                placeholder="Write something awesome..."
                value={value || ''}
                onChange={onChange}
                {...other}
              />
            )}
          </Box>

          {/* TextField para modo HTML */}
          {isHtmlMode && (
            <Box
              sx={{
                p: 2,
                minHeight: 160,
                maxHeight: 640,
                overflow: 'auto',
                backgroundColor: theme => alpha(theme.palette.grey[500], 0.08),
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={10}
                value={htmlContent}
                onChange={handleHtmlChange}
                placeholder="Escribe o pega tu HTML aquí..."
                variant="standard"
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}
