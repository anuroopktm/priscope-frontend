export async function openConfirmationModal(action: string, confirm: any) {
  const result = await confirm({
    header: "Admin Approval Required!",
    message: `You don’t have permission to ${action} rates, but you can suggest changes for admin approval. They will take effect once approved.`,
    confirmButtonText: "Understood",
    cancelButtonText: "Cancel",
  });

  return result;
}
