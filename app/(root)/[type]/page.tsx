import React from "react";
import { getFiles } from "@/lib/actions/file.action";
import Card from "@/components/Card";
import { FileModal } from "@/types/file";
import { getFileTypesParams } from "@/lib/utils";

const page = async ({searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.searchText as string) || "";
  const sort = ((await searchParams)?.sort as string) || "$createdAt-desc";
  const limit = ((await searchParams)?.limit as string) || "10";
  const types = getFileTypesParams(type) as FileType[];
  const files = await getFiles({  types, searchText : '', sort: '$createdAt-desc', limit: 10 });

  return (  
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1 hidden sm:block text-light-200">
            Total : <span className="h5">0 MB</span>
          </p>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="flex flex-wrap gap-6">
          {files.documents.map((file: FileModal) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="body-1 text-light-200">No files found</p>
      )}
    </div>
  );
};

export default page;
