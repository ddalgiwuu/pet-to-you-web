"use client"

import * as React from "react"
import { useForm, FieldValues, UseFormReturn, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: Partial<T>
  children: (methods: UseFormReturn<T>) => React.ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        {children(methods)}
      </form>
    </FormProvider>
  )
}
