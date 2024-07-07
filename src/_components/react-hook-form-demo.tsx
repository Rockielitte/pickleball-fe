"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import type { Accept } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/UploadImage/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import { getErrorMessage } from "@/lib/handle-error";

import { UploadedFilesCard } from "./uploaded-files-card";

const schema = z.object({
  images: z.array(z.instanceof(File)),
});

type Schema = z.infer<typeof schema>;
type Props = {
  label: string;
  isRequired: boolean;
  field: any;
  accetp?: Accept;
  defaultValue?: File[] | string[];
};
export function ReactHookFormDemo({
  field,
  isRequired,
  label,
  accetp,
  defaultValue,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { images: field.value ? field.value : defaultValue },
    mode: "onChange",
  });

  function onSubmit(input: Schema) {
    setLoading(true);

    toast.promise(uploadFiles(input.images), {
      loading: "Uploading images...",
      success: () => {
        form.reset();
        setLoading(false);
        return "Images uploaded";
      },
      error: (err) => {
        setLoading(false);
        return getErrorMessage(err);
      },
    });
  }
  React.useEffect(() => {
    field.onChange(form.watch("images"));
  }, [form.watch("images")]);

  console.log(form.watch("images"), "watch images");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="images"
          render={({ field: fieldForm }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>
                  {label}{" "}
                  {isRequired && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <FileUploader
                    accept={accetp}
                    value={fieldForm.value}
                    onValueChange={fieldForm.onChange}
                    maxFiles={10}
                    maxSize={10 * 1024 * 1024}
                    progresses={progresses}
                    // pass the onUpload function here for direct upload
                    // onUpload={uploadFiles}
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              {uploadedFiles.length > 0 ? (
                <UploadedFilesCard uploadedFiles={uploadedFiles} />
              ) : null}
            </div>
          )}
        />
        {/* <Button className="w-fit" disabled={loading}>
          Save
        </Button> */}
      </form>
    </Form>
  );
}
