/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderColor: {
  			primary: 'var(--color-primary-300)',
  			secondary: 'var(--color-primary)',
  			gray: 'var(--color-foreground)',
  			dark: '#171738'
  		},
  		backgroundImage: {
  			'gradient-button': 'linear-gradient(90deg, #41419e 31%, #171738 100%)',
  			'gradient-login': 'linear-gradient(90deg, rgba(151,125,255,0) 0%, #977DFF 10%, #624FE2 25%, #0600AF 50%, #000000 80%, rgba(0,0,0,0) 100%)'
  		},
  		colors: {
  			title: 'var(--color-text-primary)',
  			nomarl: 'var(--color-text-secondary)',
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
  				'900': 'var(--color-error-900)'
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
  				'900': 'var(--color-success-900)'
  			},
  			gray: 'var(--color-foreground)',
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
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
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
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
