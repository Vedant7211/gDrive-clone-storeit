import Link from "next/link";
import Thumbnail from "@/components/thumbnail";
import { convertFileSize, constructFileUrl } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateAndTime";
import ActionDropdown from "@/components/ActionsDropdown";
import { FileDocument } from "@/types";

const Card = ({ file }: { file: FileDocument }) => {
  const fileUrl = file.url || (file.bucketFileId ? constructFileUrl(file.bucketFileId) : "#");
  return (
    <Link href={fileUrl} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extention || ''}      
          url={fileUrl}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 truncate-2-lines">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        {file.owner && (
          <p className="caption truncate-2-lines text-light-200">
            By: {file.owner}
          </p>
        )}
      </div>
    </Link>
  );
};
export default Card;
