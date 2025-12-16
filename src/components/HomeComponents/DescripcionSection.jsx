import React from "react";
import { Container, Card, Typography, Link, Grid, Box } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import BoltIcon from "@mui/icons-material/Bolt";
import EvStationIcon from "@mui/icons-material/EvStation";
import SavingsIcon from "@mui/icons-material/Savings";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TableChartIcon from "@mui/icons-material/TableChart";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BuildIcon from "@mui/icons-material/Build";

const DescripcionSection = () => {
  const features = [
    {
      icon: <PictureAsPdfIcon sx={{ fontSize: 50, color: "#1976d2" }} />,
      title: "Descarga de Informes PDF",
      description:
        "Obtén documentos PDF con informes técnicos personalizados de forma gratuita.",
    },
    {
      icon: <CloudOffIcon sx={{ fontSize: 50, color: "#217346" }} />,
      title: "Cloud-free / Sin nube",
      description:
        "Máxima seguridad y privacidad Tus datos no se almacenan en la nube ni en servidores externos.",
    },
    {
      icon: <TableChartIcon sx={{ fontSize: 50, color: "#217346" }} />,
      title: "Importar y Exportar en Excel",
      description:
        "Guarda tus sesiones localmente. Puedes importar/exportar tus datos en archivos Excel.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#1976d2" }} />,
      title: "Informes Estándar",
      description:
        "Los informes estándar se están ampliando continuamente para cubrir más temas. ",
    },
    {
      icon: <BuildIcon sx={{ fontSize: 50, color: "#1976d2" }} />,
      title: "Informes Personalizados",
      description:
        "Si tu informe no está disponible, contáctanos y lo generaremos a medida para ti.",
    },
  ];

  return (
    <Container id="descripcion" sx={{ py: { xs: 6, md: 8, lg: 10 } }}>
      <Typography
        variant="h2"
        align="center"
        sx={{
          mb: { xs: 4, md: 6 },
          fontFamily: "'Playfair Display', serif",
          position: "relative",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
          "&::after": {
            content: '""',
            position: "absolute",
            width: 80,
            height: 3,
            background: "#ffb300",
            bottom: -15,
            left: "50%",
            transform: "translateX(-50%)",
          },
        }}
      >
        Aplicación Web Interactiva para generar Informes Técnicos
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {features.map((feature, index) => (
          <Grid key={index} item xs={12} md={6} lg={4}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 3,
                borderTop: "4px solid",
                borderColor: "primary.main",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h5" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DescripcionSection;
