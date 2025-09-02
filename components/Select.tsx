"use client";

import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  name: string;
  id?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  onValueChange?: (value: string | undefined) => void;
  value?: string;
}

export default function Select(props: SelectProps) {
  const {
    options,
    name,
    id,
    placeholder = 'Select…',
    style,
    onValueChange,
    value: controlledValue,
  } = props;
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      const selectedOption = options.find((o) => o.value === controlledValue);
      setQuery(selectedOption ? selectedOption.label : '');
    }
  }, [controlledValue, options]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = React.useMemo(() => {
    if (!normalizedQuery) return options.slice(0, 100);
    return options
      .filter((o) => o.label.toLowerCase().includes(normalizedQuery))
      .slice(0, 100);
  }, [options, normalizedQuery]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
        const currentOption = options.find(
          (o) => o.label.toLowerCase() === query.toLowerCase()
        );
        if (!currentOption) {
          onValueChange?.(undefined);
          // Clear the hidden select element
          const hiddenSelect = containerRef.current?.querySelector('select');
          if (hiddenSelect) {
            hiddenSelect.value = '';
          }
        }
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [query, onValueChange, options]);

  React.useEffect(() => {
    const formEl = inputRef.current?.form;
    if (!formEl) return;
    const onReset = () => {
      setQuery('');
      onValueChange?.(undefined);
      
      // Clear the hidden select element
      const hiddenSelect = containerRef.current?.querySelector('select');
      if (hiddenSelect) {
        hiddenSelect.value = '';
      }
    };
    formEl.addEventListener('reset', onReset);
    return () => formEl.removeEventListener('reset', onReset);
  }, [inputRef.current, onValueChange]);

  function selectOption(option: SelectOption) {
    setQuery(option.label);
    setOpen(false);
    setHighlightIndex(-1);
    onValueChange?.(option.value);
    
    // Update the hidden select element for form submission
    const hiddenSelect = containerRef.current?.querySelector('select');
    if (hiddenSelect) {
      hiddenSelect.value = option.value;
    }
    
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((idx) =>
        Math.min((idx < 0 ? -1 : idx) + 1, filteredOptions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((idx) => Math.max((idx < 0 ? 0 : idx) - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
        selectOption(filteredOptions[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlightIndex(-1);
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <select
        name={name}
        id={id}
        style={{ display: 'none' }}
      >
        <option value="" disabled></option>
        {options.map((o) => (
          <option key={o.value} value={o.value}></option>
        ))}
      </select>

      <input
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          setOpen(true);
          setHighlightIndex(-1);
          const matchedOption = options.find(
            (o) => o.label.toLowerCase() === v.toLowerCase()
          );
          onValueChange?.(matchedOption ? matchedOption.value : undefined);
          
          // Update the hidden select element for form submission
          const hiddenSelect = containerRef.current?.querySelector('select');
          if (hiddenSelect) {
            hiddenSelect.value = matchedOption ? matchedOption.value : '';
          }
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        style={{
          width: '100%',
          padding: 6,
          marginBottom: 8,
          border: '1px solid #ccc',
          borderRadius: 4,
          ...style,
        }}
        autoComplete="off"
      />
      {open && filteredOptions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: 34,
            left: 0,
            right: 0,
            maxHeight: 220,
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          role="listbox"
        >
          {filteredOptions.map((opt, i) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={i === highlightIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(opt);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
              style={{
                padding: '6px 8px',
                background: i === highlightIndex ? '#f0f0f0' : '#fff',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
              title={opt.label}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
