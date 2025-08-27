import React, { useState } from "react";
import { FileModal } from "@/types/file";
import { ImageThumbnail } from "./actionModalContent";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
  file: FileModal;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
  emails: string[];
}

const ShareInput = ({ file, onInputChange, onRemove, emails }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddEmail = () => {
    const value = inputValue.trim();
    if (value && !emails.includes(value)) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        onInputChange([...emails, value]);
        setInputValue("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <>
      <div>
        <ImageThumbnail file={file} />
        <div className="share-wrapper">
          <p className="subtitle-2">Share with</p>
          <Input
            type="email"
            placeholder="Enter email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddEmail}
          />

          {/* Show emails being added */}
          {emails.length > 0 && (
            <div className="mt-4">
              <p className="subtitle-2 mb-2">Will be shared with:</p>
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div
                    key={`new-${email}-${index}`}
                    className="flex items-center gap-2 justify-between bg-gray-50 p-2 rounded"
                  >
                    <p className="subtitle-2">{email}</p>
                    <Button
                      onClick={() => onRemove(email)}
                      className="share-remove-user"
                      type="button"
                    >
                      <Image
                        src="/assets/icons/remove.svg"
                        alt="remove"
                        width={16}
                        height={16}
                        className="share-remove-user-icon"
                      />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <div className="flex justify-between">
              <p className="subtitle-2">Currently shared with</p>
              <p className="subtitle-2">{file.users.length} users</p>
            </div>
            {file.users.length > 0 && (
              <div className="mt-2 space-y-2">
                {file.users.map((userEmail, index) => (
                  <div
                    key={`${userEmail}-${index}`}
                    className="flex items-center gap-2 justify-between"
                  >
                    <p className="subtitle-2">{userEmail}</p>
                    <Button
                      onClick={() => onRemove(userEmail)}
                      className="share-remove-user"
                      type="button"
                    >
                      <Image
                        src="/assets/icons/remove.svg"
                        alt="remove"
                        width={16}
                        height={16}
                        className="share-remove-user-icon"
                      />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareInput;  
