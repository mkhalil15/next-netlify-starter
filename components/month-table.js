import React, { useState, useEffect } from "react";
import axios from "axios";

import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function deleteTransaction(transaction_id) {
  axios.post('https://mkhalil.pythonanywhere.com/delete_transaction', {
      transaction_id: transaction_id
    })
}

function DeleteTransactionModal(props){
  return (
    <Modal
    open={props.modalOpen}
    onClose={props.handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete transaction?
            </Typography>
            <TextField 
                id="outlined-basic" 
                label="Merchant" 
                variant="outlined" 
                InputProps={{
                  readOnly: true,
                }}
                defaultValue={props.transaction.merchant}
                onChange={(event) => {
                  props.transaction.merchant = event.target.value;
                  }}
            />
            <TextField 
                id="outlined-basic" 
                label="Amount" 
                type="number" 
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined" 
                defaultValue={props.transaction.amount} 
                onChange={(event) => {
                    props.transaction.amount = event.target.value
                  }}
            />
            <TextField 
                id="outlined-basic" 
                label="Category" 
                variant="outlined" 
                InputProps={{
                  readOnly: true,
                }}
                defaultValue={props.transaction.category} 
                onChange={(event) => {
                    props.transaction.category = event.target.value
                  }}
            />
            <Stack direction="row" spacing={2}>
                <Button onClick={()=>{
                    deleteTransaction(props.transaction.id);
                    props.handleClose();
                    setTimeout(function(){
                        props.reloadTransactions();
                    }, 1000);
                }}>
                    DELETE
                </Button>
                <Button onClick={()=>props.handleClose()}>CANCEL</Button>
            </Stack>
        </Stack>
      </Box>
    </Modal>
);
}

function updateTransaction(transaction_id, merchant, amount, category) {
    axios.post('https://mkhalil.pythonanywhere.com/update_transaction', {
        id: transaction_id, merchant: merchant, amount: amount, category: category
      })
}

function EditTransactionModal(props){
    const [categories, setCategories] = useState([]);
    let fetchCategories = React.useCallback(async () => {
        const response = await axios.get("https://mkhalil.pythonanywhere.com/get_categories");
        setCategories(response.data["categories"]);
      },[])

    useEffect(() => {
        fetchCategories();
      }, [fetchCategories])
    return (
        <Modal
        open={props.modalOpen}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Stack spacing={2}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Transaction
                </Typography>
                <TextField 
                    id="outlined-basic" 
                    label="Merchant" 
                    variant="outlined" 
                    defaultValue={props.transaction.merchant}
                    onChange={(event) => {
                      props.transaction.merchant = event.target.value;
                      }}
                />
                <TextField 
                    id="outlined-basic" 
                    label="Amount" 
                    type="number" 
                    variant="outlined" 
                    defaultValue={props.transaction.amount} 
                    onChange={(event) => {
                        props.transaction.amount = event.target.value
                      }}
                />
                <Autocomplete
                    freeSolo={true}
                    id="combo-box-demo"
                    options={categories}
                    renderInput={(params) => <TextField {...params} label="Category"/>}
                    defaultValue={props.transaction.category}
                    onInputChange={(event, newValue) => {
                      props.transaction.category = newValue;
                      }}
                />
                <Stack direction="row" spacing={2}>
                    <Button onClick={()=>{
                        updateTransaction(props.transaction.id, props.transaction.merchant, props.transaction.amount, props.transaction.category);
                        props.handleClose();
                        setTimeout(function(){
                            props.reloadTransactions();
                            fetchCategories();
                        }, 1000);
                    }}>
                        UPDATE
                    </Button>
                    <Button onClick={()=>props.handleClose()}>CANCEL</Button>
                </Stack>
            </Stack>
          </Box>
        </Modal>
    );
}


function Row(props){
    const [open, setOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleClose = () => setModalOpen(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const handleDeleteModalClose = () => setDeleteModalOpen(false);
    const[selectedTransaction, setSelectedTransaction] = React.useState({})

    return (
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell align="left">{props.category}</TableCell>
            <TableCell align="left">{props.total}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                Category: {props.category}
                </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Merchant</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell align="left">Date</TableCell>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.category_transactions.map((row) => (
                        <TableRow>
                          <TableCell>{row.merchant}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell align="left">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSelectedTransaction(row);
                                        setModalOpen(true);
                                    }}
                                >
                                    EDIT
                                </Button>
                                <EditTransactionModal transaction={selectedTransaction} reloadTransactions={props.reloadTransactions} modalOpen={modalOpen} handleClose={handleClose}/>
                            </TableCell>
                            <TableCell align="left">
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedTransaction(row);
                                        setDeleteModalOpen(true);
                                    }}
                                >
                                    DELETE
                                </Button>
                                <DeleteTransactionModal transaction={selectedTransaction} reloadTransactions={props.reloadTransactions} modalOpen={deleteModalOpen} handleClose={handleDeleteModalClose}/>
                            </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
}



export default function MonthTable(props) {
    return (
        <div>
        <Typography variant="h2" gutterBottom>
        Month Spending: ${props.monthTotal}
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="left">Category</TableCell>
                <TableCell align="left">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.monthTransactions.map((row) => (
                <Row reloadTransactions={props.reloadTransactions} category={row.category} total={row.category_total} category_transactions={row.transactions} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      );
}