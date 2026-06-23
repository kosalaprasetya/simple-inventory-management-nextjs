import { PagingType } from "@/lib/types";
import { ItemTypes } from "../item.interface";

const Item = ({
  data,
}: {
  data: { items: ItemTypes.ItemType[]; paging: PagingType };
}) => {
  return <div>Item</div>;
};

export default Item;
