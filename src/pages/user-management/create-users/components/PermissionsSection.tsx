import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import {
    useGetPrivilegeTemplates,
    useGetResourcePrivileges,
} from "../../../../services/user-management/user-management.queries";
import type { ResourcePrivilege } from "../../../../services/user-management/user-management.types";
import PermissionItem from "./PermissionItem";
import RoleSelector from "./RoleSelector";

interface PermissionsSectionProps {
    role: string | null;
    onRoleChange: (newRole: string | null) => void;
    checked: boolean;
    onCheckChange: (val: boolean) => void;
}

const PermissionsSection = ({
    role,
    onRoleChange,
    checked,
    onCheckChange,
}: PermissionsSectionProps) => {
    // Use the tenant_id provided in the example
    const tenantId = "123e4567-e89b-12d3-a456-426614174000";

    const { data: templates, isLoading: isLoadingTemplates } =
        useGetPrivilegeTemplates(tenantId);

    const { data: privileges, isLoading: isLoadingPrivileges } =
        useGetResourcePrivileges({
            role_id: role || "",
        });

    const roles = templates
        ? templates.map((t) => ({ id: t.role_id, name: t.role_name }))
        : [];

    const renderPrivileges = () => {
        if (!role) {
            return (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary">
                        Select a role to see permissions
                    </Typography>
                </Box>
            );
        }

        if (isLoadingPrivileges) {
            return (
                <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={24} />
                </Box>
            );
        }

        if (!privileges || privileges.length === 0) {
            return (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary">No permissions found</Typography>
                </Box>
            );
        }

        const midPoint = Math.ceil(privileges.length / 2);
        const leftCol = privileges.slice(0, midPoint);
        const rightCol = privileges.slice(midPoint);

        return (
            <Grid container>
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{ p: 3, borderRight: "1px solid #E4E7EC" }}
                >
                    {leftCol.map((p: ResourcePrivilege) => (
                        <PermissionItem
                            key={p.resource_privilege_id}
                            label={p.display_name}
                            desc={p.description}
                            checked={checked}
                            handleChange={onCheckChange}
                        />
                    ))}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3 }}>
                    {rightCol.map((p: ResourcePrivilege) => (
                        <PermissionItem
                            key={p.resource_privilege_id}
                            label={p.display_name}
                            desc={p.description}
                            checked={checked}
                            handleChange={onCheckChange}
                        />
                    ))}
                </Grid>
            </Grid>
        );
    };

    return (
        <>
            <RoleSelector
                value={role || ""}
                onChange={onRoleChange}
                roles={roles}
                loading={isLoadingTemplates}
            />

            <Paper
                variant="outlined"
                sx={{ borderRadius: "8px", borderColor: "#E4E7EC", minHeight: "100px" }}
            >
                {renderPrivileges()}
            </Paper>
        </>
    );
};

export default PermissionsSection;
