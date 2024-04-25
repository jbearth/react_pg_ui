"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  score: string;
}

interface Props {
  onSubmit: (formData: FormData) => void;
}

const DataForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    score: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    score: "",
  });

  const [data, setData] = useState([]);
  const [modeEdit, setModeEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // console.log("value ", name);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const buttonId = e.nativeEvent.submitter.id;
    // console.log("Button id:", buttonId);
    let formValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      formValid = false;
      newErrors.firstName = "First name is required.";
    } else {
      newErrors.firstName = "";
    }

    if (!formData.lastName.trim()) {
      formValid = false;
      newErrors.lastName = "Last name is required.";
    } else {
      newErrors.lastName = "";
    }

    if (!formData.gender) {
      formValid = false;
      newErrors.gender = "Gender is required.";
    } else {
      newErrors.gender = "";
    }
    if (!formData.score) {
      formValid = false;
      newErrors.score = "Score is required.";
    } else {
      if (String(formData.score).charAt(0) == "-") {
        formValid = false;
        newErrors.score = "Minimum is 0";
      } else if (+formData.score > 100) {
        formValid = false;
        newErrors.score = "Maximum is 100";
      } else {
        newErrors.score = "";
      }
    }

    setErrors(newErrors);

    if (formValid) {
      // console.log("Form submitted:", formData);
      if (buttonId == "Edit") {
        fetch("/api/updateuser?id=" + editId, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Form data submitted successfully!");
              setModeEdit(false);
              setEditId("");
            } else {
              console.error("Failed to submit form data:", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Error while submitting form data:", error);
          });
      } else {
        fetch("/api/createuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Form data submitted successfully!");
            } else {
              console.error("Failed to submit form data:", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Error while submitting form data:", error);
          });
      }
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        score: "",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        const jsonData = await response.json();
        // console.log("data: ", jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (id: number) => {
    setEditId(id + "");
    const response = await fetch("/api/getuserspecify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    const jsonData = await response.json();
    console.log("jsonData: ", jsonData);
    let genderedit = "";
    if (jsonData.gender == "M") {
      genderedit = "male";
    } else if (jsonData.gender == "F") {
      genderedit = "female";
    } else {
      genderedit = "unknown";
    }

    setModeEdit(true);

    setFormData({
      firstName: jsonData.firstname,
      lastName: jsonData.lastname,
      gender: genderedit,
      score: jsonData.score + "",
    });
  };

  const handleCancel = () => {
    setModeEdit(false);
    setEditId("");
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      score: "",
    });
    const newErrors = { ...errors };
    newErrors.firstName = "";
    newErrors.lastName = "";
    newErrors.gender = "";
    newErrors.score = "";
    setErrors(newErrors);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#8ca8d8",
      color: theme.palette.common.white,
      border: "1px solid #fff",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      border: "1px solid #ddd",
      padding: theme.spacing(1),
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": {
      backgroundColor: "#eff4ff",
    },
    "&:nth-of-type(odd)": {
      backgroundColor: "#fff",
    },
  }));

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      padding: 10,
    },
  }));

  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#A0AAB4",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#E0E3E7",
      },
      "&:hover fieldset": {
        borderColor: "#B2BAC2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6F7E8C",
      },
    },
  });
  return (
    <>
      <Box my={5}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography alignItems={"center"}>
                First name
                <Typography component="span" color={"red"}>
                  *
                </Typography>
              </Typography>
              <TextField
                variant="outlined"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
              />
            </Grid>
            <Grid xs={6}>
              <Typography alignItems={"center"}>
                Last Name
                <Typography component="span" color={"red"}>
                  *
                </Typography>
              </Typography>
              <TextField
                variant="outlined"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
              />
            </Grid>
            <Grid xs={6}>
              <FormControl fullWidth variant="outlined">
                <Typography alignItems="center">
                  Gender
                  <Typography component="span" color="red">
                    *
                  </Typography>
                </Typography>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={!!errors.gender}
                  fullWidth
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="unknown">Unknown</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography color="red">{errors.gender}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid xs={6}>
              <Typography alignItems={"center"}>
                Score
                <Typography component="span" color={"red"}>
                  *
                </Typography>
              </Typography>
              <TextField
                variant="outlined"
                type="number"
                name="score"
                onChange={handleChange}
                value={formData.score}
                error={!!errors.score}
                helperText={errors.score}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid xs={"auto"} textAlign={"center"} mt={3}>
            {modeEdit ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                id="Edit"
                sx={{ mr: 3, textTransform: "none" }}
              >
                Edit
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                id="Add"
                sx={{ mr: 3, textTransform: "none" }}
              >
                Add
              </Button>
            )}
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "black", textTransform: "none" }}
              onClick={handleCancel}
            >
              Cencel
            </Button>
          </Grid>
        </form>
      </Box>
      <Table sx={{ width: "90%" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: "8%" }} align="center">
              No.
            </StyledTableCell>
            <StyledTableCell sx={{ width: "5%" }}></StyledTableCell>
            <StyledTableCell>First nme</StyledTableCell>
            <StyledTableCell>Last name</StyledTableCell>
            <StyledTableCell align="center">Gender</StyledTableCell>
            <StyledTableCell align="center">Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell align="center">{item.id}</StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="text"
                  sx={{
                    padding: 0,
                    color: "black",
                    "&.MuiButton-root": { minWidth: 1 },
                    "&:hover": {
                      backgroundColor: "gray",
                    },
                  }}
                  onClick={() => handleEdit(item.id)}
                >
                  ✏️
                </Button>
              </StyledTableCell>
              <StyledTableCell>{item.firstname}</StyledTableCell>
              <StyledTableCell>{item.lastname}</StyledTableCell>
              <StyledTableCell align="center">
                {item.gender === "M" ? (
                  <CustomTooltip title="Male" placement="right">
                    {item.gender}
                  </CustomTooltip>
                ) : item.gender === "F" ? (
                  <CustomTooltip title="Female" placement="right">
                    {item.gender}
                  </CustomTooltip>
                ) : (
                  <CustomTooltip title="Unknown" placement="right">
                    {item.gender}
                  </CustomTooltip>
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {item.score.toFixed(2)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default DataForm;
