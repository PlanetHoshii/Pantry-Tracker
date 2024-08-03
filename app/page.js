'use client'
import Image from "next/image";
import * as React from 'react';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button, IconButton } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "@firebase/firestore";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

export default function Home() {
  const [Inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState(1);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + Number(quantity) });
    } else {
      await setDoc(docRef, { quantity: Number(quantity) });
    }

    await updateInventory();
  };

  const updateItemQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await setDoc(docRef, { quantity: Number(quantity) });
    await updateInventory();
    setUpdateOpen(false);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (item, quantity) => {
    setUpdateItem(item);
    setUpdateQuantity(quantity);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  const filteredInventory = Inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)'
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant='outlined'
              type="number"
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              inputProps={{ min: 1 }}
            />
            <Button
              variant='outlined'
              onClick={() => {
                addItem(itemName, itemQuantity);
                setItemName('');
                setItemQuantity(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={updateOpen} onClose={handleUpdateClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)'
          }}
        >
          <Typography variant="h6">Update Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label="Item Name"
              value={updateItem}
              disabled
            />
            <TextField
              variant='outlined'
              type="number"
              label="Quantity"
              value={updateQuantity}
              onChange={(e) => setUpdateQuantity(e.target.value)}
              inputProps={{ min: 1 }}
            />
            <Button
              variant='outlined'
              onClick={() => {
                updateItemQuantity(updateItem, updateQuantity);
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          onClick={handleOpen}
        >
          Add new Item
        </Button>
        <TextField
          variant='outlined'
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Stack>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#E6FAFC"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color='#353D22'>
            Pantry Needs
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor='#9CFC97'
                padding={5}
              >
                <Typography variant='h3' color='#515B3A' textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant='h3' color='#353D2F' textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <IconButton color="primary" aria-label="add to shopping cart" onClick={() => {
                    addItem(name, 1);
                  }}>
                    <AddShoppingCartIcon />
                  </IconButton>
                  <IconButton aria-label="update" size="large" onClick={() => {
                    handleUpdateOpen(name, quantity);
                  }}>
                    <UpdateIcon fontSize="inherit" color="secondary" />
                  </IconButton>
                  <IconButton aria-label="delete" size="large" onClick={() => {
                    removeItem(name);
                  }}>
                    <DeleteIcon fontSize="inherit" color="error" />
                  </IconButton>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
