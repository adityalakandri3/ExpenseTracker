import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useProfileFetchDetails, useUpdateProfile } from "../../../hooks/react-query/query-hooks/authQuery";
import { useParams } from "react-router-dom";
import { City, State } from "country-state-city";



const ProfileUpdate = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useProfileFetchDetails(id);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: {
        state: "",
        city: "",
      },
    },
  });

  const { mutate } = useUpdateProfile();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const selectedState = watch("location.state");

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (selectedState) {
      const stateData = states.find((s) => s.name === selectedState);
      if (stateData) {
        const stateCities = City.getCitiesOfState("IN", stateData.isoCode);
        setCities(stateCities);
      }
    }
  }, [selectedState, states]);

  useEffect(() => {
    if (data?.data) {
      const profile = data.data;
      setValue("name", profile.name);
      setValue("email", profile.email);
      setValue("phone", profile.phone);
      setValue("location.state", profile.location?.state || "");
      setValue("location.city", profile.location?.city || "");
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("location[state]", formData.location.state);
    payload.append("location[city]", formData.location.city);
    if (imageFile) {
      payload.append("image", imageFile);
    }

    mutate({ id, data: payload });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching profile details</div>;

  return (
 
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
          mt:4
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Update Profile
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              disabled
              {...register("email")}
            />

            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              {...register("phone", { required: "Phone is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.location?.state}>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={watch("location.state") || ""}
                {...register("location.state", { required: true })}
              >
                {states.map((state) => (
                  <MenuItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.location?.state && (
                <Typography variant="caption" color="error">
                  State is required
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.location?.city}>
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={watch("location.city") || ""}
                {...register("location.city", { required: true })}
                disabled={!selectedState}
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

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#4338CA",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Container>
      </Box>
  );
};

export default ProfileUpdate;
