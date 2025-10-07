/**@type {import('tailwindcss').Config}*/

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				Ubuntu: ['Ubuntu', 'sans-serif'],
				sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
			},
			colors: {
				primary: {
					DEFAULT: '#00A2DE',
					dark: '#0077B6',
				},
				success: '#28a745',
				error: '#dc3545',
			},
			animation: {
				'gradient-shift': 'gradientShift 15s ease infinite',
				'float': 'float 8s ease-in-out infinite',
				'shake': 'shake 0.4s',
				'success-pop': 'successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'spin-slow': 'spin 20s linear infinite',
				'spin-reverse': 'spinReverse 15s linear infinite',
			},
			keyframes: {
				gradientShift: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' },
				},
				successPop: {
					'0%': { 
						transform: 'scale(0) rotate(-180deg)', 
						opacity: '0' 
					},
					'60%': { 
						transform: 'scale(1.2) rotate(10deg)' 
					},
					'100%': { 
						transform: 'scale(1) rotate(0deg)', 
						opacity: '1' 
					},
				},
				spinReverse: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(-360deg)' },
				},
			},
		},
	},
	plugins: [],
}
