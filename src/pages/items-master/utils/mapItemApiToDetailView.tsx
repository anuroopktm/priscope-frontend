type ItemApiResponse = Record<string, any>;

export const mapItemApiToDetailView = (
  data: ItemApiResponse,
): {
  title: string;
  items: Record<string, string | string[]>;
} => {
  const items: Record<string, string | string[]> = {};
  let title = "";

  if (!data) {
    return { title, items };
  }

  Object.values(data).forEach((value: any) => {
    if (value?.label && value?.value) {
      if (value.label === "Description") {
        title = value.value;
      } else {
        items[value.label] = value.value;
      }
    }
  });

  if (data.attributes && typeof data.attributes === "object") {
    Object.values(data.attributes).forEach((attr: any) => {
      if (attr?.label && attr?.value) {
        items[attr.label] = attr.value;
      }
    });
  }

  if (Array.isArray(data.suppliers) && data.suppliers?.length) {
    items["Supplier"] = data.suppliers.map((s: any) => s?.name).filter(Boolean);
  }

  if (Array.isArray(data.customers) && data.customers?.length) {
    items["Customer"] = data.customers.map((c: any) => c?.name).filter(Boolean);
  }

  return { title, items };
};
