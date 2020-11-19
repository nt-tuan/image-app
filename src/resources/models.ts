export interface ImageInfo {
  fullname: string;
  id: number;
  tags: string[];
  by?: string;
  at?: string;
  width: number;
  height: number;
  diskSize: number;
}

export type ActionType = "create" | "rename" | "replace" | "delete" | "restore";

export interface ImageHistory {
  id: number;
  at: string;
  fullname: string;
  backupFullname?: string;
  actionType: ActionType;
  by?: string;
  fileID: number;
}
