/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderColor: {
  			primary: 'var(--border-primary)',
  			secondary: 'var(--border-secondary)',
  			error: 'var(--border-error)',
  			gray: 'var(--border-300)',
  			dark: 'var(--color-dark)'
  		},
  		backgroundImage: {
  			'gradient-button': 'var(--color-background-gradient-button)',
  			'gradient-login': 'var(--color-background-gradient-login)'
  		},
  		colors: {
  			title: 'var(--color-text-primary)',
  			normal: 'var(--color-text-secondary)',
  			error: {
  				'50': 'var(--color-error-50)',
  				'100': 'var(--color-error-100)',
  				'200': 'var(--color-error-200)',
  				'300': 'var(--color-error-300)',
  				'400': 'var(--color-error-400)',
  				'500': 'var(--color-error-500)',
  				'600': 'var(--color-error-600)',
  				'700': 'var(--color-error-700)',
  				'800': 'var(--color-error-800)',
  				'900': 'var(--color-error-900)',
  				DEFAULT: 'var(--color-error-400)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			success: {
  				'50': 'var(--color-success-50)',
  				'100': 'var(--color-success-100)',
  				'200': 'var(--color-success-200)',
  				'300': 'var(--color-success-300)',
  				'400': 'var(--color-success-400)',
  				'500': 'var(--color-success-500)',
  				'600': 'var(--color-success-600)',
  				'700': 'var(--color-success-700)',
  				'800': 'var(--color-success-800)',
  				'900': 'var(--color-success-900)',
  				DEFAULT: 'var(--color-success-500)',
  				foreground: 'var(--success-foreground)'
  			},
  			primary: {
  				'50': 'var(--color-primary-50)',
  				'100': 'var(--color-primary-100)',
  				'200': 'var(--color-primary-200)',
  				'300': 'var(--color-primary-300)',
  				'400': 'var(--color-primary-400)',
  				'500': 'var(--color-primary-500)',
  				'600': 'var(--color-primary-600)',
  				'700': 'var(--color-primary-700)',
  				'800': 'var(--color-primary-800)',
  				'900': 'var(--color-primary-900)',
  				DEFAULT: 'var(--color-primary-500)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				'50': 'var(--color-secondary-50)',
  				'100': 'var(--color-secondary-100)',
  				'200': 'var(--color-secondary-200)',
  				'300': 'var(--color-secondary-300)',
  				'400': 'var(--color-secondary-400)',
  				'500': 'var(--color-secondary-500)',
  				'600': 'var(--color-secondary-600)',
  				'700': 'var(--color-secondary-700)',
  				'800': 'var(--color-secondary-800)',
  				'900': 'var(--color-secondary-900)',
  				DEFAULT: 'var(--color-secondary-500)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			rg: 'var(--shadow-rg)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)',
  			'3xl': 'var(--shadow-3xl)',
  			'4xl': 'var(--shadow-4xl)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
