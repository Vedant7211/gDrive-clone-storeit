import { FileModal } from '@/types/file'
import React from 'react'
import Thumbnail from './thumbnail'
import FormattedDateAndTime from './FormattedDateAndTime'
import { convertFileSize, formatDateTime } from '@/lib/utils'


export const ImageThumbnail = ({file}: {file: FileModal}) => (
  <div className = 'file-details-thumbnail'>
    <Thumbnail type = {file.type} extension = {file.extention} url = {file.Url} />
    <div className = 'flex flex-col'></div>
    <p className = 'suntitle-2 mb-1'>{file.name}</p>
    <FormattedDateAndTime date = {file.$createdAt} className = 'caption' />
      
  </div>
)
 
const DetailRow =({label , value}: {label: string , value: string}) => (
    <div className = 'flex '>
      <p className = 'file-details-label'>{label}</p>
      <p className = 'file-details-value'>{value}</p>
    </div>
)


export const FileDetails = ({file}: {file: FileModal}) => {
    {return (
      <>
        <ImageThumbnail file={file} />
        <DetailRow label="Format:" value={file.type} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Name:" value={file.name} />
        <DetailRow label="Created On:" value={formatDateTime(file.$createdAt)} />
        <DetailRow label="Updated On:" value={formatDateTime(file.$updatedAt)} />
      </>
    );}
}