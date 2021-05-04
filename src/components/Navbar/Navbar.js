import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { PhoneIphone, ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import useStyles from './styles';

const Navbar = ({ totalItems }) => {

  const classes = useStyles();
  const location = useLocation();

  return (
    <AppBar position="fixed" className={classes.appBar} color="inherit">
      <Toolbar>
        <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
          <PhoneIphone /> MobileShop
        </Typography>
        <div className={classes.grow} />
        {location.pathname === '/' && 
          <div>
            <IconButton component={Link} to="/cart" aria-label="Voir le panier" color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;