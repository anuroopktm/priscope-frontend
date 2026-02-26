const getListExportPayload = (modules: string[]) => {
  const payload = {
    modules: modules,
    status: ["completed", "failed"],
  };

  return payload;
};

export default getListExportPayload;
