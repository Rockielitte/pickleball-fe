"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import type {
  DefaultValues,
  FormState,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

import AutoFormObject from "./fields/object";
import type { Dependency, FieldConfig } from "./types";
import type { ZodObjectOrWrapped } from "./utils";
import { getDefaultValues, getObjectFormSchema } from "./utils";

export function AutoFormSubmit({
  children,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button type="submit" disabled={disabled} className={className}>
      {children ?? "Submit"}
    </Button>
  );
}

function AutoForm<
  SchemaType extends ZodObjectOrWrapped,
  // SchemaType extends FieldValues,
>({
  controlForm,
  formSchema,
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onParsedValuesChange,
  onSubmit: onSubmitProp,
  fieldConfig,
  children,
  className,
  dependencies,
}: {
  controlForm?: UseFormReturn<z.infer<SchemaType>>;
  formSchema: SchemaType;
  values?: Partial<z.infer<SchemaType>>;
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onSubmit?: SubmitHandler<z.infer<SchemaType>>;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  children?:
    | React.ReactNode
    | ((formState: FormState<z.infer<SchemaType>>) => React.ReactNode);
  className?: string;
  dependencies?: Dependency<z.infer<SchemaType>>[];
}) {
  const objectFormSchema = getObjectFormSchema(formSchema);
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> | null =
    getDefaultValues(objectFormSchema, fieldConfig);

  const form =
    controlForm ||
    useForm<z.infer<typeof objectFormSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues ?? undefined,
      values: valuesProp,
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onSubmitProp?.(parsedValues.data);
    }
  }

  const values = form.watch();

  // valuesString is needed because form.watch() returns a new object every time
  const valuesString = JSON.stringify(values);

  React.useEffect(() => {
    onValuesChangeProp?.(values);
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onParsedValuesChange?.(parsedValues.data);
    }
  }, [valuesString]);

  const renderChildren =
    typeof children === "function"
      ? children(form.formState as FormState<z.infer<SchemaType>>)
      : children;

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          // noValidate
          onSubmit={(e) => {
            form.handleSubmit(onSubmit)(e);
          }}
          className={cn("space-y-5", className)}
        >
          <AutoFormObject
            schema={objectFormSchema}
            form={form}
            dependencies={dependencies}
            fieldConfig={fieldConfig}
          />

          {renderChildren}
        </form>
      </Form>
    </div>
  );
}

export default AutoForm;
