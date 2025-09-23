import { useRef, useState } from 'react';

import {
  Box,
  Flex,
  IconButton,
  Text,
  TextField,
  VisuallyHidden,
} from '@radix-ui/themes';

interface PhoneNumberInputProps {
  value: string;
  onValueChange: (value: string) => void;
  length?: number;
}

export function PhoneNumberInput({
  value,
  onValueChange,
  length = 8,
}: PhoneNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.length > length) {
      return;
    }

    onValueChange(value);
    setFocusIndex(value.length);
  };

  const handleCodeClick = (index: number) => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(index, index + length);

    if (value.length < index) {
      setFocusIndex(value.length);
    } else {
      setFocusIndex(index);
    }
  };

  const lengthArray = Array.from({ length }).map((_, index) => ({ id: index }));

  const getVariant = ({
    isFilled,
    isFocuedIndex,
  }: {
    isFilled: boolean;
    isFocuedIndex: boolean;
  }) => {
    if (isFocused && isFocuedIndex) {
      return 'surface' as const;
    }
    if (isFilled) {
      return 'soft' as const;
    }
    return 'outline' as const;
  };

  return (
    <Box>
      <Text size="4">010 - </Text>
      <Flex gap="1" align="center">
        {lengthArray.map(({ id }, index) => {
          const isFilled = Boolean([...value][index]);
          const isFocuedIndex = focusIndex === index;

          return (
            <>
              <IconButton
                size="2"
                variant={getVariant({ isFilled, isFocuedIndex })}
                onClick={() => handleCodeClick(index)}
                key={id}
                type="button"
              >
                {[...value][index]}
              </IconButton>
              {index === 3 && <Text size="4">-</Text>}
            </>
          );
        })}
      </Flex>

      <VisuallyHidden>
        <TextField.Root
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputMode="numeric"
          pattern="\d*"
          enterKeyHint="enter"
        />
      </VisuallyHidden>
    </Box>
  );
}
