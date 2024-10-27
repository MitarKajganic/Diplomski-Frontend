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
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Check as EnableIcon,
} from '@mui/icons-material';
import {
  getAllStaff,
  deleteStaff,
  disableUser,
  enableUser,
} from '../services/userService';
import { StaffDto, ApiError } from '../types/Interfaces';
import { toast } from 'react-toastify';
import EditStaffDialog from './EditStaffDialog';
import AddStaffDialog from './AddStaffDialog';
import { AuthContext } from '../context/AuthContext';

const StaffTable: React.FC = () => {
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffDto | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof StaffDto; direction: 'asc' | 'desc' } | null>(null);

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getAllStaff();
        setStaff(data);
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

    fetchStaff();
  }, []);

  const handleDelete = async (staffId: string) => {
    if (currentUser?.id === staffId) return;
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await deleteStaff(staffId);
      setStaff(staff.filter((s) => s.id !== staffId));
      toast.success('Staff member deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete staff member.');
    }
  };

  const handleDisable = async (staffId: string) => {
    if (currentUser?.id === staffId) return;
    if (!window.confirm('Are you sure you want to disable this staff member?')) return;

    try {
      await disableUser(staffId);
      setStaff(staff.map((s) => (s.id === staffId ? { ...s, active: false } : s)));
      toast.info('Staff member disabled successfully!');
    } catch (err: any) {
      toast.error('Failed to disable staff member.');
    }
  };

  const handleEnable = async (staffId: string) => {
    try {
      await enableUser(staffId);
      setStaff(staff.map((s) => (s.id === staffId ? { ...s, active: true } : s)));
      toast.success('Staff member enabled successfully!');
    } catch (err: any) {
      toast.error('Failed to enable staff member.');
    }
  };

  const handleEdit = (staff: StaffDto) => {
    setSelectedStaff(staff);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedStaff(null);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleStaffUpdate = (updatedStaff: StaffDto) => {
    setStaff(staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    toast.success('Staff member updated successfully!');
  };

  const handleStaffCreate = (newStaff: StaffDto) => {
    setStaff([...staff, newStaff]);
    toast.success('Staff member created successfully!');
  };

  const sortTable = (key: keyof StaffDto) => {
    const direction = sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    const sortedStaff = [...staff].sort((a, b) => {
      if (a[key] !== undefined && b[key] !== undefined) {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setStaff(sortedStaff);
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddDialogOpen}>
          Add Staff Member
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => sortTable('email')} style={{ cursor: 'pointer' }}>
              Email
            </TableCell>
            <TableCell onClick={() => sortTable('name')} style={{ cursor: 'pointer' }}>
              Name
            </TableCell>
            <TableCell onClick={() => sortTable('surname')} style={{ cursor: 'pointer' }}>
              Surname
            </TableCell>
            <TableCell onClick={() => sortTable('position')} style={{ cursor: 'pointer' }}>
              Position
            </TableCell>
            <TableCell onClick={() => sortTable('contactInfo')} style={{ cursor: 'pointer' }}>
              Contact Info
            </TableCell>
            <TableCell onClick={() => sortTable('active')} style={{ cursor: 'pointer' }}>
              Active
            </TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.surname}</TableCell>
              <TableCell>{s.position}</TableCell>
              <TableCell>{s.contactInfo}</TableCell>
              <TableCell>{s.active ? 'Yes' : 'No'}</TableCell>
              <TableCell align="center">
                <Tooltip title="Edit Staff">
                  <IconButton onClick={() => handleEdit(s)} disabled={currentUser?.id === s.id}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
                {s.active ? (
                  <Tooltip title="Disable Staff">
                    <IconButton onClick={() => handleDisable(s.id)} disabled={currentUser?.id === s.id}>
                      <BlockIcon color="warning" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Enable Staff">
                    <IconButton onClick={() => handleEnable(s.id)}>
                      <EnableIcon color="success" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete Staff">
                  <IconButton onClick={() => handleDelete(s.id)} disabled={currentUser?.id === s.id}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Staff Dialog */}
      {selectedStaff && (
        <EditStaffDialog
          open={openEditDialog}
          onClose={handleEditDialogClose}
          staff={selectedStaff}
          onUpdate={handleStaffUpdate}
        />
      )}

      {/* Add Staff Dialog */}
      <AddStaffDialog open={openAddDialog} onClose={handleAddDialogClose} onCreate={handleStaffCreate} />
    </>
  );
};

export default StaffTable;
