import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'kids': ['Comic Neue', 'Comic Sans MS', 'cursive'],
                'teen': ['Poppins', 'sans-serif'],
                'adult': ['Inter', 'sans-serif'],
            },
            colors: {
                // Paleta para niños
                kids: {
                    primary: '#ff6b6b',
                    secondary: '#4ecdc4',
                    accent: '#ffe66d',
                    bg: '#fff5f5',
                    text: '#2d3748',
                },
                // Paleta para jóvenes
                teen: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    accent: '#f093fb',
                    bg: '#f7fafc',
                    text: '#2d3748',
                },
                // Paleta para adultos
                adult: {
                    primary: '#2d3748',
                    secondary: '#4a5568',
                    accent: '#3182ce',
                    bg: '#ffffff',
                    text: '#1a202c',
                },
                // Colores de contraste alto
                highContrast: {
                    bg: '#000000',
                    text: '#ffffff',
                    primary: '#ffffff',
                    secondary: '#ffff00',
                },
                // Colores de contraste extra alto
                extraHighContrast: {
                    bg: '#000000',
                    text: '#ffffff',
                    primary: '#ffff00',
                    secondary: '#00ffff',
                },
            },
            fontSize: {
                // Tamaños pequeños
                'xs-small': ['0.6rem', { lineHeight: '0.8rem' }],
                'sm-small': ['0.7rem', { lineHeight: '0.9rem' }],
                'base-small': ['0.8rem', { lineHeight: '1rem' }],
                'lg-small': ['0.9rem', { lineHeight: '1.1rem' }],
                'xl-small': ['1rem', { lineHeight: '1.2rem' }],
                
                // Tamaños grandes
                'xs-large': ['1rem', { lineHeight: '1.3rem' }],
                'sm-large': ['1.1rem', { lineHeight: '1.4rem' }],
                'base-large': ['1.2rem', { lineHeight: '1.5rem' }],
                'lg-large': ['1.4rem', { lineHeight: '1.7rem' }],
                'xl-large': ['1.6rem', { lineHeight: '1.9rem' }],
                
                // Tamaños extra grandes
                'xs-xlarge': ['1.2rem', { lineHeight: '1.5rem' }],
                'sm-xlarge': ['1.4rem', { lineHeight: '1.7rem' }],
                'base-xlarge': ['1.6rem', { lineHeight: '1.9rem' }],
                'lg-xlarge': ['1.8rem', { lineHeight: '2.1rem' }],
                'xl-xlarge': ['2rem', { lineHeight: '2.3rem' }],
            },
            animation: {
                'bounce-soft': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
            borderRadius: {
                'kids': '1.5rem',
                'teen': '0.75rem',
                'adult': '0.375rem',
            },
            spacing: {
                'kids': '1.5rem',
                'teen': '1rem',
                'adult': '0.75rem',
            },
        },
    },
    plugins: [
        forms,
        function({ addBase, addUtilities, theme }) {
            // Estilos base para cada modo de edad
            addBase({
                // Modo Niños
                '.mode-niños': {
                    '--kids-primary': theme('colors.kids.primary'),
                    '--kids-secondary': theme('colors.kids.secondary'),
                    '--kids-accent': theme('colors.kids.accent'),
                    '--kids-bg': theme('colors.kids.bg'),
                    '--kids-text': theme('colors.kids.text'),
                },
                '.mode-niños body': {
                    fontFamily: theme('fontFamily.kids').join(', '),
                    backgroundColor: 'var(--kids-bg)',
                    color: 'var(--kids-text)',
                },
                
                // Modo Jóvenes
                '.mode-jóvenes': {
                    '--teen-primary': theme('colors.teen.primary'),
                    '--teen-secondary': theme('colors.teen.secondary'),
                    '--teen-accent': theme('colors.teen.accent'),
                    '--teen-bg': theme('colors.teen.bg'),
                    '--teen-text': theme('colors.teen.text'),
                },
                '.mode-jóvenes body': {
                    fontFamily: theme('fontFamily.teen').join(', '),
                    backgroundColor: 'var(--teen-bg)',
                    color: 'var(--teen-text)',
                },
                
                // Modo Adultos
                '.mode-adultos': {
                    '--adult-primary': theme('colors.adult.primary'),
                    '--adult-secondary': theme('colors.adult.secondary'),
                    '--adult-accent': theme('colors.adult.accent'),
                    '--adult-bg': theme('colors.adult.bg'),
                    '--adult-text': theme('colors.adult.text'),
                },
                '.mode-adultos body': {
                    fontFamily: theme('fontFamily.adult').join(', '),
                    backgroundColor: 'var(--adult-bg)',
                    color: 'var(--adult-text)',
                },
                
                // Temas día/noche
                '.theme-día': {
                    '--theme-bg': '#ffffff',
                    '--theme-text': '#1a202c',
                    '--theme-surface': '#f7fafc',
                    '--theme-border': '#e2e8f0',
                },
                '.theme-noche': {
                    '--theme-bg': '#1a202c',
                    '--theme-text': '#f7fafc',
                    '--theme-surface': '#2d3748',
                    '--theme-border': '#4a5568',
                },
                
                // Tamaños de fuente
                '.font-pequeño': {
                    fontSize: '0.8rem',
                    lineHeight: '1rem',
                },
                '.font-pequeño h1': { fontSize: '1.2rem', lineHeight: '1.5rem' },
                '.font-pequeño h2': { fontSize: '1.1rem', lineHeight: '1.4rem' },
                '.font-pequeño h3': { fontSize: '1rem', lineHeight: '1.3rem' },
                
                '.font-normal': {
                    fontSize: '1rem',
                    lineHeight: '1.25rem',
                },
                '.font-normal h1': { fontSize: '1.5rem', lineHeight: '1.75rem' },
                '.font-normal h2': { fontSize: '1.375rem', lineHeight: '1.625rem' },
                '.font-normal h3': { fontSize: '1.25rem', lineHeight: '1.5rem' },
                
                '.font-grande': {
                    fontSize: '1.2rem',
                    lineHeight: '1.5rem',
                },
                '.font-grande h1': { fontSize: '1.8rem', lineHeight: '2.1rem' },
                '.font-grande h2': { fontSize: '1.65rem', lineHeight: '1.95rem' },
                '.font-grande h3': { fontSize: '1.5rem', lineHeight: '1.8rem' },
                
                '.font-extra-grande': {
                    fontSize: '1.4rem',
                    lineHeight: '1.7rem',
                },
                '.font-extra-grande h1': { fontSize: '2.1rem', lineHeight: '2.4rem' },
                '.font-extra-grande h2': { fontSize: '1.95rem', lineHeight: '2.25rem' },
                '.font-extra-grande h3': { fontSize: '1.8rem', lineHeight: '2.1rem' },
                
                // Contrastes
                '.contrast-normal': {
                    '--contrast-bg': 'var(--theme-bg)',
                    '--contrast-text': 'var(--theme-text)',
                    '--contrast-surface': 'var(--theme-surface)',
                    '--contrast-border': 'var(--theme-border)',
                },
                
                '.contrast-alto': {
                    '--contrast-bg': '#000000',
                    '--contrast-text': '#ffffff',
                    '--contrast-surface': '#1a1a1a',
                    '--contrast-border': '#333333',
                    filter: 'contrast(1.5)',
                },
                
                '.contrast-extra-alto': {
                    '--contrast-bg': '#000000',
                    '--contrast-text': '#ffffff',
                    '--contrast-surface': '#000000',
                    '--contrast-border': '#ffffff',
                    filter: 'contrast(2) brightness(1.2)',
                },
            });

            // Utilidades personalizadas
            addUtilities({
                // Botones adaptativos por edad
                '.btn-adaptive': {
                    transition: 'all 0.2s ease-in-out',
                },
                '.mode-niños .btn-adaptive': {
                    borderRadius: theme('borderRadius.kids'),
                    padding: theme('spacing.kids'),
                    fontWeight: '600',
                    transform: 'scale(1)',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)',
                    },
                },
                '.mode-jóvenes .btn-adaptive': {
                    borderRadius: theme('borderRadius.teen'),
                    padding: theme('spacing.teen'),
                    fontWeight: '500',
                    background: 'linear-gradient(135deg, var(--teen-primary), var(--teen-secondary))',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.2)',
                    },
                },
                '.mode-adultos .btn-adaptive': {
                    borderRadius: theme('borderRadius.adult'),
                    padding: theme('spacing.adult'),
                    fontWeight: '400',
                    '&:hover': {
                        backgroundColor: 'var(--adult-secondary)',
                    },
                },
                
                // Tarjetas adaptativas
                '.card-adaptive': {
                    transition: 'all 0.2s ease-in-out',
                },
                '.mode-niños .card-adaptive': {
                    borderRadius: theme('borderRadius.kids'),
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.15)',
                    border: '3px solid var(--kids-accent)',
                },
                '.mode-jóvenes .card-adaptive': {
                    borderRadius: theme('borderRadius.teen'),
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    backdropFilter: 'blur(10px)',
                },
                '.mode-adultos .card-adaptive': {
                    borderRadius: theme('borderRadius.adult'),
                    backgroundColor: 'var(--adult-bg)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
                
                // Texto adaptativo
                '.text-adaptive': {
                    lineHeight: '1.6',
                },
                '.mode-niños .text-adaptive': {
                    fontWeight: '500',
                    letterSpacing: '0.025em',
                },
                '.mode-jóvenes .text-adaptive': {
                    fontWeight: '400',
                    letterSpacing: '0.015em',
                },
                '.mode-adultos .text-adaptive': {
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                },
            });
        },
    ],
}; 