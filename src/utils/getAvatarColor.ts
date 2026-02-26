// Utility to generate avatar color
export const getAvatarColor = (user: string) => {
  const colors = ["#CB5E5E", "#144E72", "#4caf50", "#ff9800", "#9c27b0"];
  let hash = 0;
  for (let i = 0; i < user.length; i++) {
    hash = user.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};