import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import useStyles from './styles';
import { AddressForm, PaymentForm } from '../../index';
import { commerce } from '../../../lib/commerce';

const steps = ["Adresse de livraison", "Détails de paiement"];

const Checkout = ({ cart, order, onCaptureCheckout }) => {

  const classes = useStyles();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
        setCheckoutToken(token);
      } catch (error) {
        history.push("/");
      }
    }
    generateToken();
  }, [cart, history]);


  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
    }, 3000);
  };

  let Confirmation = () => order.customer ? (
    <>
      <div>
        <Typography variant="h5">Merci pour votre achat, {order.customer.firstname} {order.customer.lastname} !</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Référence de la commande: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">Retour à l'accueil</Button>
    </>
  ) : isFinished ? (
    <>
      <div>
        <Typography variant="h5">Merci pour votre achat !</Typography>
        <Divider className={classes.divider} />
      </div>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">Retour à l'accueil</Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  );

  const Form = () => activeStep === 0 
    ? <AddressForm checkoutToken={checkoutToken} next={next} />
    : (
      <PaymentForm 
        checkoutToken={checkoutToken} 
        shippingData={shippingData} 
        backStep={backStep}
        nextStep={nextStep}
        onCaptureCheckout={onCaptureCheckout}
        timeout={timeout}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Valider</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;