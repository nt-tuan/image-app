export interface ImageListItemProps {
  id: number;
  fullname: string;
  href: string;
  by?: string;
  at?: string;
  width?: number;
  height?: number;
  diskSize?: number;
  tags: string[];
}
