import {
  Box,
  Heading,
  List,
  ListIcon,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import {
  MdDelete,
  MdAddCircle,
  MdSwapHoriz,
  MdRestore,
  MdTextFields,
} from "react-icons/md";
import React from "react";
import { ImageHistory } from "resources/models";
import moment from "moment";
import { imageAPI } from "resources/api";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import "moment/locale/vi";
moment.locale("vi");
interface Props {
  histories: ImageHistory[];
}

const ImageHistoryItem = ({ history }: { history: ImageHistory }) => {
  if (history.actionType === "create")
    return (
      <>
        <ListIcon as={MdAddCircle} color="green.500" /> Upload
      </>
    );
  if (history.actionType === "delete")
    return (
      <>
        <ListIcon as={MdDelete} color="red.500" /> Xóa
      </>
    );
  if (history.actionType === "rename")
    return (
      <>
        <ListIcon as={MdTextFields} color="blue.500" /> Đổi tên
      </>
    );
  if (history.actionType === "replace")
    return (
      <>
        <ListIcon as={MdSwapHoriz} color="blue.500" /> Đổi hình ảnh
      </>
    );
  if (history.actionType === "restore")
    return (
      <>
        <ListIcon as={MdRestore} color="green.500" /> Khôi phục hình ảnh
      </>
    );
  return <></>;
};

const ImageHistoriesView = (props: Props) => {
  return (
    <List spacing={3}>
      {props.histories.map((h) => (
        <ListItem key={h.id}>
          <ImageHistoryItem history={h} />
          <Box fontSize="sm" color="gray.400">
            {moment(h.at).format("lll")} {h.by ? ` - ${h.by}` : null}
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export const ImageHistories = ({ id }: { id: number }) => {
  const { oidcUser } = useReactOidc();
  const [histories, setHistories] = React.useState<ImageHistory[]>();
  React.useEffect(() => {
    imageAPI
      .getImageHistories(id, oidcUser.access_token)
      .then(setHistories)
      .catch();
  }, [id, oidcUser]);
  return (
    <>
      <Heading size="lg" pb={6}>
        Changes
      </Heading>
      {histories ? <ImageHistoriesView histories={histories} /> : <Spinner />}
    </>
  );
};
