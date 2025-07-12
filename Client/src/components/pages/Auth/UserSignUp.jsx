import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { State, City } from "country-state-city";
import {
  TextField,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel,
  Container,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserSignUpMutation } from "../../../hooks/react-query/query-hooks/authQuery";
import "@fontsource/montserrat";
import { Link as RouterLink } from "react-router-dom";



const UserSignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      image: "",
      location: {
        state: "",
        city: "",
      },
    },
  });

  const { mutate } = useUserSignUpMutation();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const selectedState = watch("location.state");

  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  useEffect(() => {
    if (selectedState) {
      const stateObj = states.find((s) => s.name === selectedState);
      if (stateObj) {
        const stateCities = City.getCitiesOfState("IN", stateObj.isoCode);
        setCities(stateCities);
        setValue("location.city", "");
      }
    }
  }, [selectedState, setValue, states]);

const onSubmit = (data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("role", data.role);
  formData.append("phone", data.phone);
  formData.append("image", data.image[0]); 
  formData.append("location[state]", data.location.state);
  formData.append("location[city]", data.location.city);

  mutate(formData); 
  reset();
};

  return (
   
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 4,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            mt: 10,
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create Your <span style={{ color: "#10B981" }}>Expense</span>{" "}
            Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  {...register("name", { required: true })}
                  error={!!errors.name}
                  helperText={errors.name && "Name is required"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  {...register("email", { required: true })}
                  error={!!errors.email}
                  helperText={errors.email && "Email is required"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  label="Password"
                  fullWidth
                  {...register("password", { required: true })}
                  error={!!errors.password}
                  helperText={errors.password && "Password is required"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    defaultValue=""
                    {...register("role", { required: true })}
                    label="Role"
                  >
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error">
                      Role is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Phone"
                  fullWidth
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be exactly 10 digits",
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  type="file"
                  fullWidth
                  {...register("image", { required: true })}
                  error={!!errors.image}
                  helperText={errors.image && "Image is required"}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.location?.state}>
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    defaultValue=""
                    {...register("location.state", { required: true })}
                  >
                    {states.map((s) => (
                      <MenuItem key={s.isoCode} value={s.name}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.location?.state && (
                    <Typography variant="caption" color="error">
                      State is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.location?.city}>
                  <InputLabel>City</InputLabel>
                  <Select
                    label="City"
                    defaultValue=""
                    disabled={!selectedState}
                    {...register("location.city", { required: true })}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.location?.city && (
                    <Typography variant="caption" color="error">
                      City is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#4338CA",
                },
              }}
            >
              Submit
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Button
                component={RouterLink}
                to="/signin"
                size="small"
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontWeight: "bold",
                  p: 0,
                }}
              >
                Login Here
              </Button>
            </Typography>

            <Typography align="center">
              Forgot password?{" "}
              <Button
                component={RouterLink}
                to="/reset-password-link"
                size="small"
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontWeight: "bold",
                  p: 0,
                }}
              >
                Click Here
              </Button>
            </Typography>
          </Box>
        </Container>
      </Box>
    
  );
};

export default UserSignUp;
