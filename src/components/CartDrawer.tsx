import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Divider,
    Stack,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart, CartItem } from '../context/CartContext';
import { toast } from 'react-toastify';
import placeholderImg from '../assets/images/burger.jpg';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
    const { cartItems, removeFromCart, getTotalPrice, updateItemQuantity } = useCart();
    const navigate = useNavigate(); 

    const handleRemove = (itemId: string) => {
        removeFromCart(itemId);
        toast.info('Item removed from cart');
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemove(itemId);
        } else {
            updateItemQuantity(itemId, newQuantity);
            toast.info('Quantity updated');
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box
                sx={{
                    width: { xs: 300, sm: 400 },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    backgroundColor: '#2c2c2c',
                    color: '#ffffff',
                }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">Your Cart</Typography>
                    <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: '#444444' }} />

                {/* Cart Items */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                    {cartItems.length === 0 ? (
                        <Typography variant="body1">Your cart is empty.</Typography>
                    ) : (
                        <List>
                            {cartItems.map((item: CartItem) => (
                                <ListItem key={item.id} alignItems="flex-start" disableGutters>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="square"
                                            src={placeholderImg}
                                            alt={item.name}
                                            sx={{ width: 60, height: 60, mr: 2 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                                                {item.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
                                                    {item.description}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        aria-label="decrease quantity"
                                                        sx={{ color: '#ffffff' }}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <TextField
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value);
                                                            if (!isNaN(value)) {
                                                                handleQuantityChange(item.id, value);
                                                            }
                                                        }}
                                                        type="number"
                                                        inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            width: '60px',
                                                            '& .MuiOutlinedInput-root': {
                                                                color: '#ffffff',
                                                                borderColor: '#555555',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '6px 8px',
                                                            },
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#555555',
                                                            },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#ffffff',
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#ffffff',
                                                            },
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        aria-label="increase quantity"
                                                        sx={{ color: '#ffffff' }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleRemove(item.id)}
                                                        aria-label="remove item"
                                                        sx={{ ml: 'auto', color: '#ffffff' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </>
                                        }
                                    />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1, color: '#ffffff' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Footer with Total and Checkout */}
                {cartItems.length > 0 && (
                    <Box sx={{ p: 2, borderTop: '1px solid #444444' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">${getTotalPrice().toFixed(2)}</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleCheckout}
                            sx={{
                                fontFamily: 'League Spartan, sans-serif',
                                textTransform: 'none',
                                backgroundColor: '#D4AF37',
                                color: '#000000',
                                '&:hover': {
                                    backgroundColor: '#CDA434',
                                },
                            }}
                        >
                            Checkout
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    )
};
    
export default CartDrawer;