"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { FileDocument } from "@/types";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { renameFile, UpdateFileUser } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import { FileDetails } from "./actionModalContent";
import ShareInput from "./shareInput";
import { DeleteFile } from "@/lib/actions/file.action";

const ActionsDropdown = ({ file }: { file: FileDocument }) => {
  const path = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState("");
  const [newName, setNewName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const handleAction = async (value: string) => {
    // If this is the initial click from dropdown, just open modal
    if (
      !isModalOpen &&
      ["rename", "delete", "share", "details"].includes(value)
    ) {
      setAction(value);
      setIsModalOpen(true);
      setIsDropdownOpen(false); // Close dropdown when opening modal
      return;
    }
  };

  const executeAction = async () => {
    if (!action) return;

    // For details action, we don't need to do anything in executeAction
    // as we're just displaying information
    if (action === "details") return;

    // Validation for rename
    if (action === "rename" && (!newName || newName.trim() === "")) {
      console.error("New name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      if (action === "rename") {
        console.log("Renaming file:", {
          fileId: file.$id,
          newName,
          extension: file.extention,
          path,
        });
        const success = await renameFile(
          file.$id,
          newName.trim(),
          file.extention || '',
          path
        );
        console.log("Rename result:", success);
        if (success) {
          setIsModalOpen(false);
          setAction("");
        }
      }
      if (action === "share") {
        if (emails.length === 0) {
          console.error("No emails to share with");
          return;
        }

        try {
          console.log("Sharing file with emails:", emails);

          // Share with all emails at once using the updated function
          const result = await UpdateFileUser(file.$id, emails, path);
          console.log("Share result:", result);

          setIsModalOpen(false);
          setEmails([]); // Reset emails after sharing
          setAction(""); // Reset action
        } catch (error) {
          console.error("Error sharing file:", error);
        }
      }

      if (action === "delete") {
        console.log("Deleting file:", {
          fileId: file.$id,
          bucketFileId: file.bucketFileId,
          path,
        });
        const success = await DeleteFile(file.$id, file.bucketFileId, path);
        console.log("Delete result:", success);
        if (success) {
          setIsModalOpen(false);
          setAction("");
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialogContent = () => {
    const actionItem = actionsDropdownItems.find(
      (item) => item.value === action
    );
    const label = actionItem?.label || action;

    return (
      <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {label} {file.name}
          </DialogTitle>

          {action === "rename" && (
            <div className="space-y-2">
              <label
                htmlFor="newName"
                className="text-sm font-medium text-gray-700"
              >
                New name
              </label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {action === "delete" && (
            <DialogDescription className="text-sm text-gray-600">
              {`This action cannot be undone. This will permanently delete the file "${file.name}".`}
            </DialogDescription>
          )}

          {action === "details" && <FileDetails file={file} />}

          {action === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={(emailToRemove) =>
                setEmails(emails.filter((email) => email !== emailToRemove))
              }
              emails={emails}
            />
          )}
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="modal-submit-button"
          >
            Cancel
          </Button>
          {action !== "details" && (
            <Button
              variant={action === "delete" ? "destructive" : "default"}
              onClick={executeAction}
              className="modal-submit-button"
              disabled={
                isLoading || (action === "share" && emails.length === 0)
              }
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="Loading..."
                    width={16}
                    height={16}
                    className="animate-spin mr-2"
                  />
                  {action === "rename"
                    ? "Renaming..."
                    : action === "delete"
                      ? "Deleting..."
                      : action === "share"
                        ? "Sharing..."
                        : "Processing..."}
                </div>
              ) : (
                <span className="capitalize">{action}</span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 outline-none focus:outline-none">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={20}
            height={20}
            className="outline-none focus:outline-none"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]">
          <DropdownMenuLabel className="max-w-[200px] truncate px-4 py-2 text-sm font-medium text-gray-900">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-gray-200" />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => {
                if (item.value === "download") {
                  return; // Let the Link handle the download
                }
                handleAction(item.value);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer outline-none focus:outline-none"
            >
              {item.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-3 w-full text-gray-700 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={16}
                    height={16}
                  />
                  {item.label}
                </Link>
              ) : (
                <>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={16}
                    height={16}
                  />
                  {item.label}
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderDialogContent()}
      </Dialog>

      {/* Modal */}
    </>
  );
};

export default ActionsDropdown;
