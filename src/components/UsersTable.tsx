import React, { useEffect, useState, useContext } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Check as EnableIcon,
} from '@mui/icons-material';
import { getAllUsers, deleteUser, disableUser, enableUser } from '../services/userService';
import { UserDto, ApiError } from '../types/Interfaces';
import { toast } from 'react-toastify';
import EditUserDialog from './EditUserDialog';
import { AuthContext } from '../context/AuthContext';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserDto; direction: 'asc' | 'desc' } | null>(null);

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        if (err.response && err.response.data) {
          setError(err.response.data as ApiError);
        } else if (err instanceof Error) {
          setError({
            status: 500,
            message: err.message,
            errors: [err.message],
          });
        } else {
          setError({
            status: 500,
            message: 'An unknown error occurred.',
            errors: ['Unknown error'],
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (currentUser?.id === userId) return;
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete user.');
    }
  };

  const handleDisable = async (userId: string) => {
    if (currentUser?.id === userId) return;
    if (!window.confirm('Are you sure you want to disable this user?')) return;

    try {
      await disableUser(userId);
      setUsers(users.map((user) => (user.id === userId ? { ...user, active: false } : user)));
      toast.info('User disabled successfully!');
    } catch (err: any) {
      toast.error('Failed to disable user.');
    }
  };

  const handleEnable = async (userId: string) => {
    try {
      await enableUser(userId);
      setUsers(users.map((user) => (user.id === userId ? { ...user, active: true } : user)));
      toast.success('User enabled successfully!');
    } catch (err: any) {
      toast.error('Failed to enable user.');
    }
  };

  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser: UserDto) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    toast.success('User updated successfully!');
  };

  const sortTable = (key: keyof UserDto) => {
    const direction = sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] !== undefined && b[key] !== undefined) {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setUsers(sortedUsers);
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => sortTable('email')} style={{ cursor: 'pointer' }}>
              Email
            </TableCell>
            <TableCell onClick={() => sortTable('role')} style={{ cursor: 'pointer' }}>
              Role
            </TableCell>
            <TableCell onClick={() => sortTable('active')} style={{ cursor: 'pointer' }}>
              Active
            </TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.active ? 'Yes' : 'No'}</TableCell>
              <TableCell align="center">
                <Tooltip title="Edit User">
                  <IconButton onClick={() => handleEdit(user)} disabled={currentUser?.id === user.id}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
                {user.active ? (
                  <Tooltip title="Disable User">
                    <IconButton onClick={() => handleDisable(user.id)} disabled={currentUser?.id === user.id}>
                      <BlockIcon color="warning" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Enable User">
                    <IconButton onClick={() => handleEnable(user.id)}>
                      <EnableIcon color="success" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete User">
                  <IconButton onClick={() => handleDelete(user.id)} disabled={currentUser?.id === user.id}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <EditUserDialog
          open={openEditDialog}
          onClose={handleEditDialogClose}
          user={selectedUser}
          onUpdate={handleUserUpdate}
        />
      )}
    </>
  );
};

export default UsersTable;
