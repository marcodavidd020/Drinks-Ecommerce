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
                // Tamaños pequeños (más notables)
                'xs-small': ['0.6rem', { lineHeight: '0.8rem' }],
                'sm-small': ['0.7rem', { lineHeight: '0.9rem' }],
                'base-small': ['0.75rem', { lineHeight: '1rem' }],
                'lg-small': ['0.85rem', { lineHeight: '1.1rem' }],
                'xl-small': ['0.95rem', { lineHeight: '1.2rem' }],
                
                // Tamaños grandes (más notables)
                'xs-large': ['1.1rem', { lineHeight: '1.4rem' }],
                'sm-large': ['1.25rem', { lineHeight: '1.6rem' }],
                'base-large': ['1.4rem', { lineHeight: '1.8rem' }],
                'lg-large': ['1.6rem', { lineHeight: '2rem' }],
                'xl-large': ['1.8rem', { lineHeight: '2.2rem' }],
                
                // Tamaños extra grandes (más notables)
                'xs-xlarge': ['1.4rem', { lineHeight: '1.8rem' }],
                'sm-xlarge': ['1.6rem', { lineHeight: '2rem' }],
                'base-xlarge': ['1.8rem', { lineHeight: '2.2rem' }],
                'lg-xlarge': ['2.2rem', { lineHeight: '2.6rem' }],
                'xl-xlarge': ['2.5rem', { lineHeight: '3rem' }],
            },
            animation: {
                'bounce-soft': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'sparkle': 'sparkle 2s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(5deg)' },
                },
                sparkle: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(1.2)' },
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
            // Estilos base para cada modo de edad con fuentes aplicadas globalmente
            addBase({
                // Modo Niños
                '.mode-niños': {
                    '--kids-primary': theme('colors.kids.primary'),
                    '--kids-secondary': theme('colors.kids.secondary'),
                    '--kids-accent': theme('colors.kids.accent'),
                    '--kids-bg': theme('colors.kids.bg'),
                    '--kids-text': theme('colors.kids.text'),
                    fontFamily: theme('fontFamily.kids').join(', '),
                },
                '.mode-niños body': {
                    fontFamily: theme('fontFamily.kids').join(', ') + ' !important',
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
                    fontFamily: theme('fontFamily.teen').join(', '),
                },
                '.mode-jóvenes body': {
                    fontFamily: theme('fontFamily.teen').join(', ') + ' !important',
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
                    fontFamily: theme('fontFamily.adult').join(', '),
                },
                '.mode-adultos body': {
                    fontFamily: theme('fontFamily.adult').join(', ') + ' !important',
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
            });

            // Utilidades personalizadas mejoradas
            addUtilities({
                // Botones adaptativos por edad
                '.btn-adaptive': {
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '500',
                },
                '.mode-niños .btn-adaptive': {
                    borderRadius: theme('borderRadius.kids'),
                    padding: theme('spacing.kids'),
                    fontWeight: '700',
                    transform: 'scale(1)',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)',
                    '&:hover': {
                        transform: 'scale(1.1) rotate(1deg)',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                    },
                },
                '.mode-jóvenes .btn-adaptive': {
                    borderRadius: theme('borderRadius.teen'),
                    padding: theme('spacing.teen'),
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, var(--teen-primary), var(--teen-secondary))',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                    },
                },
                '.mode-adultos .btn-adaptive': {
                    borderRadius: theme('borderRadius.adult'),
                    padding: theme('spacing.adult'),
                    fontWeight: '500',
                    '&:hover': {
                        backgroundColor: 'var(--adult-secondary)',
                        transform: 'translateY(-1px)',
                    },
                },
                
                // Tarjetas adaptativas mejoradas
                '.card-adaptive': {
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
                '.mode-niños .card-adaptive': {
                    borderRadius: theme('borderRadius.kids'),
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.15)',
                    border: '3px solid var(--kids-accent)',
                    '&:hover': {
                        transform: 'translateY(-5px) rotate(-1deg)',
                        boxShadow: '0 15px 40px rgba(255, 107, 107, 0.25)',
                    },
                },
                '.mode-jóvenes .card-adaptive': {
                    borderRadius: theme('borderRadius.teen'),
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
                    },
                },
                '.mode-adultos .card-adaptive': {
                    borderRadius: theme('borderRadius.adult'),
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    },
                },
                
                // Texto adaptativo mejorado
                '.text-adaptive': {
                    lineHeight: '1.6',
                    transition: 'font-size 0.3s ease, color 0.3s ease',
                },
                '.mode-niños .text-adaptive': {
                    fontFamily: theme('fontFamily.kids').join(', ') + ' !important',
                    fontWeight: '500',
                    letterSpacing: '0.025em',
                },
                '.mode-jóvenes .text-adaptive': {
                    fontFamily: theme('fontFamily.teen').join(', ') + ' !important',
                    fontWeight: '400',
                    letterSpacing: '0.015em',
                },
                '.mode-adultos .text-adaptive': {
                    fontFamily: theme('fontFamily.adult').join(', ') + ' !important',
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                },
                
                // Efectos especiales para cada modo
                '.special-effect': {
                    transition: 'all 0.3s ease',
                },
                '.mode-niños .special-effect': {
                    animation: 'float 3s ease-in-out infinite',
                },
                '.mode-jóvenes .special-effect': {
                    background: 'linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 2s ease-in-out infinite',
                },
                '.mode-adultos .special-effect': {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
                
                // Utilidades para elementos interactivos
                '.interactive': {
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                },
                '.mode-niños .interactive:hover': {
                    animation: 'wiggle 0.5s ease-in-out',
                },
                '.mode-jóvenes .interactive:hover': {
                    transform: 'scale(1.02)',
                    filter: 'brightness(1.1)',
                },
                '.mode-adultos .interactive:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
            });
        },
    ],
}; 