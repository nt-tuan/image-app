import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";
import React from "react";
interface Props {
  title: string;
  description: string;
  onClose?: () => void;
}
export const ErrorAlert = ({ title, description, onClose }: Props) => (
  <Alert status="error">
    <AlertIcon />
    <AlertTitle mr={2}>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
    {onClose && (
      <CloseButton
        onClick={onClose}
        position="absolute"
        right="8px"
        top="8px"
      />
    )}
  </Alert>
);
