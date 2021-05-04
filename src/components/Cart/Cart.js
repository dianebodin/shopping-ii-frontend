import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import { CartItem } from '../index';

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {

  const classes = useStyles();
  const isEmpty = cart.line_items && !cart.line_items.length;

  const EmptyCart = () => (
    <Typography variant="subtitle1">
      Vous n'avez aucun article, <Link to="/" className={classes.link}>ajoutez-en</Link> !
    </Typography>
  );

  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem 
              item={item} 
              onUpdateCartQty={onUpdateCartQty}
              onRemoveFromCart={onRemoveFromCart}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant="h4">
          Total: {cart.subtotal.formatted_with_code}
        </Typography>
        <div>
          <Button 
            className={classes.emptyButton} 
            size="large"
            type="button"
            variant="contained"
            color="secondary"
            onClick={() => onEmptyCart()}
          >
            Vider le panier
          </Button>
          <Button
            component={Link}
            to="/checkout" 
            className={classes.emptyButton} 
            size="large"
            type="button"
            variant="contained"
            color="primary"
          >
            Valider
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h4" gutterBottom>
        Votre panier
      </Typography>
      {isEmpty ? <EmptyCart /> : <FilledCart />}
    </Container>
  );
};

export default Cart;