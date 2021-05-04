import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom'; 
import { commerce } from '../../lib/commerce';
import { FormInput } from '../index';

const AddressForm = ({ checkoutToken, next }) => {

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
  const options = shippingOptions.map((shippingOption) => (
    { id: shippingOption.id, label: `${shippingOption.description} (${shippingOption.price.formatted_with_code})` }
  ));

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId); //récupère la liste des pays livrables
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
    setShippingOptions(options);
    setShippingOption(Object.keys(options)[0].id);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, [checkoutToken]);

  useEffect(() => {
    if (shippingCountry) {
      fetchSubdivisions(shippingCountry);
    }
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) {
      fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }
  }, [checkoutToken, shippingCountry, shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>Adresse de livraison</Typography>
      <FormProvider {...methods}>
        <form 
          onSubmit={
            methods.handleSubmit((data) => next(
              { ...data, shippingCountry, shippingSubdivision, shippingOption }
            ))
          }
        >
          <Grid container spacing={3}>
            <FormInput name="firstName" label="Prénom" />
            <FormInput name="lastName" label="Nom" />
            <FormInput name="address1" label="Adresse" />
            <FormInput name="email" label="Email" />
            <FormInput name="city" label="Ville" />
            <FormInput name="zip" label="Code postal" />

            <Grid item xs={12} sm={6}>
              <InputLabel>Pays de livraison</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Département</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Options de livraison</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} to="/cart" variant="outlined">Retour au panier</Button>
            <Button type="submit" variant="contained" color="primary">Suivant</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;