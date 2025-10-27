import { Controller, useFormContext } from 'react-hook-form';
import { Stack, TextField, FormHelperText } from '@mui/material';
import { useRef } from 'react';

type RHFCodesProps = {
  name: string;
  length?: number;
};

export default function RHFCode({ name, length = 6 }: RHFCodesProps) {
  const { control } = useFormContext();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusNext = (index: number) => {
    const next = inputsRef.current[index + 1];
    if (next) next.focus();
  };

  const focusPrev = (index: number) => {
    const prev = inputsRef.current[index - 1];
    if (prev) prev.focus();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = '', onChange }, fieldState: { error } }) => {
        const codeArray = String(value)
          .split('')
          .concat(Array(length).fill(''))
          .slice(0, length);

        const handleChange = (char: string, index: number) => {
          const newValue = codeArray
            .map((v, i) => (i === index ? char : v))
            .join('');
          onChange(newValue);

          if (char && index < length - 1) focusNext(index);
        };

        const handleKeyDown = (
          e: React.KeyboardEvent<HTMLDivElement>,
          index: number
        ) => {
          if (e.key === 'Backspace' && !codeArray[index]) {
            focusPrev(index);
          }
        };

        const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
          e.preventDefault();
          const pastedData = e.clipboardData.getData('text');
          const cleanData = pastedData.replace(/\D/g, ''); // Remove non-digit characters
          
          if (cleanData.length > 0) {
            const newCodeArray = Array(length).fill('');
            const dataToUse = cleanData.slice(0, length);
            
            for (let i = 0; i < dataToUse.length; i++) {
              newCodeArray[i] = dataToUse[i];
            }
            
            const newValue = newCodeArray.join('');
            onChange(newValue);
            
            // Focus the next empty field or the last field
            const nextEmptyIndex = newCodeArray.findIndex(char => char === '');
            const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
            const targetInput = inputsRef.current[focusIndex];
            if (targetInput) {
              targetInput.focus();
            }
          }
        };

        return (
          <div>
            <Stack direction="row" spacing={1.5} justifyContent="center">
              {codeArray.map((char, index) => (
                <TextField
                  key={index}
                  inputRef={el => (inputsRef.current[index] = el)}
                  value={char}
                  onChange={e => handleChange(e.target.value.slice(-1), index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      width: '3rem',
                      fontSize: '1.5rem',
                    },
                  }}
                  error={!!error}
                />
              ))}
            </Stack>

            {error && (
              <FormHelperText sx={{ textAlign: 'center' }} error>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}
