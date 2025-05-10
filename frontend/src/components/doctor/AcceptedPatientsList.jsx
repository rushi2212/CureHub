import React from "react";
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
} from "@mui/material";

const AcceptedPatientsList = ({ patients, onSelectPatient }) => {
  if (patients.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1">No accepted patients found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Records</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <React.Fragment key={patient.patientId}>
              {patient.records.map((record, index) => (
                <TableRow key={`${patient.patientId}-${index}`}>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{patient.patientEmail}</TableCell>
                  <TableCell>
                    <div>
                      <strong>Date:</strong> {record.date}
                    </div>
                    <div>
                      <strong>Symptoms:</strong> {record.symptoms}
                    </div>
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
