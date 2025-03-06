import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-hidden focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] shadow-xs hover:bg-[hsl(var(--color-primary)/0.9)]',
				destructive:
					'bg-[hsl(var(--color-destructive))] text-white shadow-xs hover:bg-[hsl(var(--color-destructive)/0.9)]',
				outline:
					'border border-[hsl(var(--color-input))] bg-[hsl(var(--color-background))] shadow-xs hover:bg-[hsl(var(--color-accent)/0.1)] hover:text-[hsl(var(--color-accent))]',
				secondary: 'bg-[hsl(var(--color-secondary))] text-[hsl(var(--color-secondary-foreground))] shadow-xs hover:bg-[hsl(var(--color-secondary)/0.8)]',
				ghost: 'hover:bg-[hsl(var(--color-accent)/0.1)] hover:text-[hsl(var(--color-accent))]',
				link: 'text-[hsl(var(--color-primary))] underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot='button'
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
