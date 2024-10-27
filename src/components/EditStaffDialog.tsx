import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { StaffDto } from '../types/Interfaces';
import * as Yup from 'yup';
import { updateStaff } from '../services/userService';
import { toast } from 'react-toastify';

interface EditStaffDialogProps {
  open: boolean;
  onClose: () => void;
  staff: StaffDto;
  onUpdate: (updatedStaff: StaffDto) => void;
}

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({
  open,
  onClose,
  staff,
  onUpdate,
}) => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
    name: Yup.string()
      .matches(/^[a-zA-Z]*$/, 'Name must contain only letters')
      .min(2, 'Name must have at least 2 characters')
      .required('Required'),
    surname: Yup.string()
      .matches(/^[a-zA-Z]*$/, 'Surname must contain only letters')
      .min(2, 'Surname must have at least 2 characters')
      .required('Required'),
    position: Yup.string()
      .oneOf(['WAITER', 'COOK', 'BARTENDER', 'MANAGER'], 'Invalid position')
      .required('Required'),
    contactInfo: Yup.string()
      .min(5, 'Contact info must have at least 5 characters')
      .required('Required'),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Staff Member</DialogTitle>
      <Formik
        initialValues={{
          email: staff.email,
          password: '',
          name: staff.name,
          surname: staff.surname,
          position: staff.position,
          contactInfo: staff.contactInfo,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const updatedStaff = await updateStaff(staff.id, {
              email: values.email,
              password: values.password,
              name: values.name,
              surname: values.surname,
              position: values.position,
              contactInfo: values.contactInfo,
            });
            onUpdate(updatedStaff);
            onClose();
          } catch (err: any) {
            toast.error('Failed to update staff member.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="surname"
                  label="Surname"
                  fullWidth
                  error={touched.surname && Boolean(errors.surname)}
                  helperText={touched.surname && errors.surname}
                />
                <FormControl fullWidth>
                  <InputLabel id="position-label">Position</InputLabel>
                  <Field
                    as={Select}
                    labelId="position-label"
                    label="Position"
                    name="position"
                    error={touched.position && Boolean(errors.position)}
                  >
                    <MenuItem value="WAITER">WAITER</MenuItem>
                    <MenuItem value="COOK">COOK</MenuItem>
                    <MenuItem value="BARTENDER">BARTENDER</MenuItem>
                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                  </Field>
                  {touched.position && errors.position && (
                    <Typography color="error" variant="caption">
                      {errors.position}
                    </Typography>
                  )}
                </FormControl>
                <Field
                  as={TextField}
                  name="contactInfo"
                  label="Contact Info"
                  fullWidth
                  error={touched.contactInfo && Boolean(errors.contactInfo)}
                  helperText={touched.contactInfo && errors.contactInfo}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditStaffDialog;
