import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Description as DescriptionIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  Person as PersonIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Form validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  priority: Yup.string().required('Priority is required'),
  dueDate: Yup.date().nullable(),
  attachments: Yup.array(),
});

const categories = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'software', label: 'Software' },
  { value: 'network', label: 'Network' },
  { value: 'email', label: 'Email' },
  { value: 'account', label: 'Account' },
  { value: 'other', label: 'Other' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Basic Information';
    case 1:
      return 'Details';
    case 2:
      return 'Review & Submit';
    default:
      return 'Unknown step';
  }
}

const NewTicket = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFileNames(files.map((file) => file.name));
    setFieldValue('attachments', files);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (activeStep !== 2) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would submit the form data to your API here
      console.log('Submitting ticket:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to tickets list on success
      navigate('/tickets', { state: { ticketCreated: true } });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setFieldError('submit', 'Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const initialValues = {
    title: '',
    description: '',
    category: '',
    priority: '',
    dueDate: null,
    attachments: [],
  };

  return (
    <Box>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          New Service Request
        </Typography>
        <Typography color="textSecondary" paragraph>
          Fill out the form below to submit a new service request.
        </Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <Card>
                <CardHeader
                  title={
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                      {[0, 1, 2].map((label) => (
                        <Step key={label}>
                          <StepLabel>{getStepContent(label)}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  }
                />
                <Divider />
                <CardContent>
                  {activeStep === 0 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Field
                          name="title"
                          as={TextField}
                          fullWidth
                          label="Title"
                          variant="outlined"
                          error={touched.title && Boolean(errors.title)}
                          helperText={touched.title && errors.title}
                          InputProps={{
                            startAdornment: (
                              <DescriptionIcon color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                          <InputLabel id="category-label">Category</InputLabel>
                          <Field
                            name="category"
                            as={Select}
                            labelId="category-label"
                            label="Category"
                            startAdornment={<CategoryIcon color="action" sx={{ mr: 1 }} />}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.value} value={category.value}>
                                {category.label}
                              </MenuItem>
                            ))}
                          </Field>
                          {touched.category && errors.category && (
                            <FormHelperText>{errors.category}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
                          <InputLabel id="priority-label">Priority</InputLabel>
                          <Field
                            name="priority"
                            as={Select}
                            labelId="priority-label"
                            label="Priority"
                            startAdornment={<PriorityIcon color="action" sx={{ mr: 1 }} />}
                          >
                            {priorities.map((priority) => (
                              <MenuItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </MenuItem>
                            ))}
                          </Field>
                          {touched.priority && errors.priority && (
                            <FormHelperText>{errors.priority}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  )}

                  {activeStep === 1 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Field
                          name="description"
                          as={TextField}
                          fullWidth
                          multiline
                          rows={6}
                          label="Description"
                          variant="outlined"
                          error={touched.description && Boolean(errors.description)}
                          helperText={
                            touched.description
                              ? errors.description
                              : 'Please provide a detailed description of your issue.'
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Due Date (Optional)"
                          value={values.dueDate}
                          onChange={(date) => setFieldValue('dueDate', date)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <EventIcon color="action" sx={{ mr: 1 }} />
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <input
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                          style={{ display: 'none' }}
                          id="raised-button-file"
                          multiple
                          type="file"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                        />
                        <label htmlFor="raised-button-file">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PersonIcon />}
                          >
                            Add Attachments
                          </Button>
                        </label>
                        {fileNames.length > 0 && (
                          <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                              {fileNames.length} file(s) selected
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 1, mt: 1, maxHeight: 100, overflow: 'auto' }}>
                              {fileNames.map((name, index) => (
                                <Typography key={index} variant="body2" noWrap>
                                  {name}
                                </Typography>
                              ))}
                            </Paper>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {activeStep === 2 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Review Your Request
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Title
                              </Typography>
                              <Typography>{values.title}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Category
                              </Typography>
                              <Typography>
                                {categories.find((c) => c.value === values.category)?.label || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Priority
                              </Typography>
                              <Typography>
                                {priorities.find((p) => p.value === values.priority)?.label || 'N/A'}
                              </Typography>
                            </Grid>
                            {values.dueDate && (
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                  Due Date
                                </Typography>
                                <Typography>
                                  {new Date(values.dueDate).toLocaleDateString()}
                                </Typography>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Description
                              </Typography>
                              <Typography whiteSpace="pre-line">{values.description}</Typography>
                            </Grid>
                            {fileNames.length > 0 && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                  Attachments ({fileNames.length})
                                </Typography>
                                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                  {fileNames.map((name, index) => (
                                    <Typography component="li" key={index} variant="body2">
                                      {name}
                                    </Typography>
                                  ))}
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          By submitting this request, you acknowledge that the information provided is accurate.
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                  <Button
                    disabled={activeStep === 0 || isSubmitting}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box>
                    {activeStep < 2 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={isSubmitting}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            </Form>
          )}
        </Formik>
      </LocalizationProvider>
    </Box>
  );
};

export default NewTicket;
