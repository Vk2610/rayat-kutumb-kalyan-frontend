import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

export default function FormDialog({ data, isDisabled, handleUpdate }) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const value = formJson.text; 

    console.log("SUBMITTED VALUE:", value);

    try {
      if (data.title === "Status") {
        await axios.patch("http://localhost:3000/admin/update-form-status", {
          id: data.requestId,
          status: value
        });
        alert("Form status updated!");
      }

      else if (data.title === "Approved Amount") {
        await axios.patch("http://localhost:3000/admin/update-appr-amt", {
          id: data.requestId,
          amt: value
        });
        alert("Approved amount updated!");
      }

      handleUpdate();
      handleClose();
    } catch (error) {
      console.error("Error submitting update:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} disabled={isDisabled}>
        Edit {data.title}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit {data.title}</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit} id="dialog-form">
            {data.type === 'dropdown' ? (
              <FormControl fullWidth margin="dense">
                <InputLabel>{data.title}</InputLabel>
                <Select
                  name="text"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  label={data.title}
                >
                  {data.options?.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                autoFocus
                required
                margin="dense"
                name="text"
                type={data.type}
                fullWidth
                variant="standard"
              />
            )}
          </form>
        </DialogContent>

        <DialogActions>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' color='success' type="submit" form="dialog-form">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
