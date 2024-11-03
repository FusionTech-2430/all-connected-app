'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Input, InputProps } from '@/components/ui/input'

interface SearchInputProps extends Omit<InputProps, 'onChange' | 'placeholder' | 'value' | 'type'> {
    placeholder?: string
    paramName: string
}

interface SearchInputProps {
  className?: string;
  paramName: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ paramName, placeholder = 'Buscar por nombre', ...props }: SearchInputProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState(searchParams.get(paramName) || '')

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams)

        if (value) {
            params.set(paramName, value)
        } else {
            params.delete(paramName)
        }

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        handleSearch(e.target.value)
    }

    return (
        <Input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onInputChange(e)}
            {...props}
            />
    )

}