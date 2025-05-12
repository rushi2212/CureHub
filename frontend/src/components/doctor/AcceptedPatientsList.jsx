
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SickIcon from "@mui/icons-material/Sick";

const AcceptedPatientsList = ({ patients, onSelectPatient }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (patients.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1">No accepted patients found</Typography>
      </Box>
    );
  }

  // Mobile/Tablet View - Card-based layout
  if (isSmallScreen) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        {patients.map((patient) => (
          <Accordion 
            key={patient.patientId} 
            sx={{ 
              mb: 2,
              boxShadow: 2,
              "&:before": {
                display: "none",
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${patient.patientId}-content`}
              id={`panel-${patient.patientId}-header`}
              sx={{ 
                bgcolor: "primary.light", 
                color: "primary.contrastText",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <Typography fontWeight="medium">
                {patient.patientName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {patient.records.map((record, index) => (
                <Card 
                  key={`${patient.patientId}-${index}`} 
                  variant="outlined"
                  sx={{ 
                    mb: 1, 
                    border: "none", 
                    borderBottom: index < patient.records.length - 1 ? 1 : 0,
                    borderColor: "divider",
                    borderRadius: 0,
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            overflow: "hidden", 
                            textOverflow: "ellipsis",
                            width: "100%" 
                          }}>
                            {patient.patientEmail}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {record.date}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="flex-start" mb={1}>
                          <SickIcon fontSize="small" color="action" sx={{ mr: 1, mt: 0.5 }} />
                          <Typography variant="body2" sx={{ 
                            overflow: "hidden", 
                            textOverflow: "ellipsis",
                          }}>
                            {record.symptoms}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size={isXsScreen ? "small" : "medium"}
                      fullWidth={isXsScreen}
                      onClick={() =>
                        onSelectPatient({
                          patientId: patient.patientId,
                          recordId: record._id,
                          patientName: patient.patientName,
                          symptoms: record.symptoms,
                          date: record.date,
                        })
                      }
                    >
                      Add Prescription
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  }

  // Desktop View - Table layout
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="patient records table">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.light" }}>
            <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Patient Name</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Records</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <React.Fragment key={patient.patientId}>
              {patient.records.map((record, index) => (
                <TableRow 
                  key={`${patient.patientId}-${index}`}
                  sx={{ 
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                    "&:hover": { bgcolor: "action.selected" }
                  }}
                >
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.patientEmail}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2">{record.date}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <SickIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2">{record.symptoms}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        onSelectPatient({
                          patientId: patient.patientId,
                          recordId: record._id,
                          patientName: patient.patientName,
                          symptoms: record.symptoms,
                          date: record.date,
                        })
                      }
                      startIcon={<MedicalInformationIcon />}
                    >
                      Add Prescription
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AcceptedPatientsList;