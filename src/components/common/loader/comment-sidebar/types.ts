export type UserInfo = {
  name: string;
  email: string;
  user_id: string;
  tenant_id: string;
};

export type Comment = {
  id: string;
  tenant_id: string;
  item_id: string;
  comment_type: "row" | "field";
  field_key: string | null;
  comment: string;
  source: string;
  action: string;
  action_key: string | null;
  created_at: string;
  created_by: UserInfo;
  updated_at: string;
  updated_by: UserInfo;
};

export type CommentsResponse = {
  comments: Comment[];
  total?: number;
};
