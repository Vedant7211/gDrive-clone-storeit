import React from 'react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'

const FormattedDateAndTime = ({date , className }: {date: string , className?: string}) => {
  return (
    <p className = {cn("body-2 text-light-200", className)}>{formatDateTime(date)}</p>
    
  )
}

export default FormattedDateAndTime