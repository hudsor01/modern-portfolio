import { Playfair_Display, Roboto } from 'next/font/google'

export const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto',
})

export const playfair = Playfair_Display({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-playfair',
})
