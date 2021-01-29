import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { RequestError } from "resources/api";
import { ErrorAlert } from "components/ErrorAlert";

const LoadingAlertDialogBody = ({
  loading,
  title,
  children,
}: {
  loading: boolean;
  title: string;
  children: React.ReactNode;
}) => {
  if (loading)
    return (
      <AlertDialogBody>
        <Center>
          <VStack>
            <Spinner color="blue.500" />
            {title}
          </VStack>
        </Center>
      </AlertDialogBody>
    );
  return <AlertDialogBody>{children}</AlertDialogBody>;
};
interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onConfirm: () => Promise<void>;
  header: string;
}
export const LoadingConfirm = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [err, setErr] = React.useState<RequestError>();
  const ref = React.useRef<HTMLButtonElement>(null);
  const handleConfirm = () => {
    setLoading(true);
    props
      .onConfirm()
      .then(props.onClose)
      .catch(setErr)
      .finally(() => setLoading(false));
  };
  return (
    <AlertDialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      leastDestructiveRef={ref}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          {props.header}
        </AlertDialogHeader>
        {err && (
          <ErrorAlert
            title="Đổi tên hình ảnh không thành công"
            description={err.Err}
            onClose={() => setErr(undefined)}
          />
        )}
        <LoadingAlertDialogBody title="Đang cập nhật" loading={loading}>
          {props.children}
        </LoadingAlertDialogBody>
        <AlertDialogFooter>
          <Button
            isLoading={loading}
            variant="ghost"
            onClick={handleConfirm}
            ml={3}
          >
            Xác nhận
          </Button>
          <Button variantColor="blue" ref={ref} onClick={props.onClose}>
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
